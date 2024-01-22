"use strict"

// === Globals ===
let ctx = document.getElementById("mainCanvas").getContext("2d")
let bounds = { w: 0, h: 0, xMin: -10, yMin: -10, xMax: 10, yMax: 10 }
let graphName = "Unnamed Graph"
let isLoggedIn = false
let username = ""

// === Event Handlers ===
function UpdateDimensions()
{
    let canvasDiv = document.getElementById("canvasDiv")
    bounds.w = canvasDiv.getBoundingClientRect().width
    bounds.h = canvasDiv.getBoundingClientRect().height
    bounds.yMax = 10 * bounds.h / bounds.w
    bounds.yMin = -10 * bounds.h / bounds.w

    ctx.canvas.width = bounds.w
    ctx.canvas.height = bounds.h
}

function OnTextChanged(event)
{
    Refresh()
}

function Refresh()
{
    UpdateDimensions()
    OnDraw()
}

function ClearEquations()
{
    let eqnList = document.getElementById("eqnList")
    eqnList.innerHTML = ""
}

function AddEquation(str)
{
    let eqnList = document.getElementById("eqnList")

    // Create new list item
    let newInput = document.createElement("li")
    newInput.classList.add("list-group-item")
    newInput.classList.add("p-1")
    newInput.innerHTML = `<input type="text" class="form-control">`
    newInput.children[0].value = str

    // Add event listener
    newInput.children[0].addEventListener("input", OnTextChanged)

    // Add new item to eqnList
    eqnList.insertBefore(newInput, eqnList.children[eqnList.children.length - 1]);
}

function PlusButtonPressed(event)
{
    AddEquation("")
}

async function SaveButtonPressed(event)
{
    // == Prepare data for request ==
    let newGraph = {}
    newGraph.name = graphName
    newGraph.username = username

    // Get equation strings
    let eqnStringsArr = []
    let eqnList = document.getElementById("eqnList")
    for (let child of eqnList.children)
    {
        let textInput = child.children[0]
        eqnStringsArr.push(textInput.value)
    }
    newGraph.eqnStrings = JSON.stringify(eqnStringsArr)

    // Send POST request
    const response = await fetch("/newGraph", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGraph),
    })

    if (response.status == 201 || response.status == 200)
    {
        let checkmark = document.getElementById("saveCheck")
        checkmark.classList.remove("d-none")

        setTimeout(() => {
            let checkmark = document.getElementById("saveCheck")
            checkmark.classList.add("d-none")
        }, 3000)
    }
}

function RenameModalOpened()
{
    let renameInput = document.getElementById("renameInput")
    renameInput.value = graphName
}

function ChangeGraphName(newName)
{
    let graphNameDisplay = document.getElementById("graphNameDisplay")
    graphName = newName
    graphNameDisplay.innerHTML = graphName
}

function OnGraphRenamed()
{
    let renameInput = document.getElementById("renameInput")
    ChangeGraphName(renameInput.value)
}

async function LoginPressed()
{
    let usernameInput = document.getElementById("usernameInput")
    let passwordInput = document.getElementById("passwordInput")

    // Send request
    const response = await fetch(`/login?username=${usernameInput.value}&password=${passwordInput.value}`)

    let loginResult = document.getElementById("loginResult")
    loginResult.classList.remove("d-none")

    if (response.status == 200)
    {
        loginResult.innerHTML = "Login successful"
        SuccessfulLogin(loginInfo.username)
    }
    else if (response.status == 401)
        loginResult.innerHTML = "Incorrect password"
    else if (response.status == 404)
        loginResult.innerHTML = "Username not found"
    else
        loginResult.innerHTML = "Error occurred"

    // Disable login result after 3 seconds
    setTimeout(() => {
        let loginResult = document.getElementById("loginResult")
        loginResult.classList.add("d-none")
    }, 3000)
}

async function CreateAccountPressed()
{
    let usernameInput = document.getElementById("usernameInput")
    let passwordInput = document.getElementById("passwordInput")

    let newUserInfo = { username: usernameInput.value, password: passwordInput.value }

    // Send request
    const response = await fetch("/newUser", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserInfo),
    })

    let loginResult = document.getElementById("loginResult")
    loginResult.classList.remove("d-none")

    if (response.status == 201)
    {
        loginResult.innerHTML = "Success"
        SuccessfulLogin(newUserInfo.username)
    }
    else if (response.status == 409)
        loginResult.innerHTML = "Username taken"
    else
        loginResult.innerHTML = "Error occurred"

    // Disable login result after 3 seconds
    setTimeout(() => {
        let loginResult = document.getElementById("loginResult")
        loginResult.classList.add("d-none")
    }, 3000)
}

function SuccessfulLogin(username_)
{
    isLoggedIn = true
    username = username_

    let saveBtn = document.getElementById("saveBtn")
    saveBtn.classList.remove("btn-outline-secondary")
    saveBtn.classList.add("btn-success")
    saveBtn.disabled = false

    let usernameDisplay = document.getElementById("usernameDisplay")
    usernameDisplay.innerHTML = username
}

async function GraphLoaded(event)
{
    let btn = event.target
    let graphName = btn.innerText

    // Shouldn't be possible but best to check
    if (!isLoggedIn) return

    // Request graph info from server
    const response = await fetch(`/graph?name=${graphName}&username=${username}`)
    const graph = await response.json()

    // Load graph into app
    ChangeGraphName(graphName)

    ClearEquations()
    for (const equation of graph.eqnStrings)
        AddEquation(equation)

    Refresh()
}

async function SidebarOpened()
{
    // Clear graph list 
    let graphList = document.getElementById("sidebarGraphList")
    graphList.innerHTML = ""

    // Exit here if not logged in
    if (!isLoggedIn) return

    // Add loading icon
    graphList.innerHTML = `<div class="col text-center"><div class="spinner-border" role="status"></div></div>`

    // GET graphs for current user
    const response = await fetch(`/listGraphs?username=${username}`)
    const userGraphs = await response.json()

    // Add graphs to list
    graphList.innerHTML = ""
    for (const graph of userGraphs)
    {
        let newElement = document.createElement("div")
        newElement.classList.add("col")
        newElement.classList.add("p-0")
        newElement.classList.add("border")
        newElement.innerHTML = `<button type="button" class="btn col-12 btn-light rounded-0 text-start">${graph.name}</button>`
        newElement.children[0].addEventListener("click", GraphLoaded)
        graphList.appendChild(newElement)
    }
}

function OnResize(event)
{
    Refresh()
}
window.onresize = OnResize

// === Other Functions ===
function OnDraw()
{
    // Draw axes
    DrawAxes(ctx, bounds)

    let eqnList = document.getElementById("eqnList")
    for (let child of eqnList.children)
    {
        let textInput = child.children[0]
        if (textInput.id == "plusBtn") continue
        try
        {
            RenderEquation(ctx, textInput.value, bounds)
            textInput.classList.remove("text-danger")
        }
        catch (error)
        {
            textInput.classList.add("text-danger")
        }
    }
    ctx.stroke()
}

function AddTextListeners()
{
    let eqnList = document.getElementById("eqnList")
    for (let child of eqnList.children)
    {
        let textInput = child.children[0]
        if (textInput.id == "plusBtn") continue
        textInput.addEventListener("input", OnTextChanged)
    }
}

function AddButtonListeners()
{
    // Plus button
    let plusBtn = document.getElementById("plusBtn")
    plusBtn.onclick = PlusButtonPressed

    // Save button
    let saveBtn = document.getElementById("saveBtn")
    saveBtn.onclick = SaveButtonPressed
}

// === Main ===
AddTextListeners()
AddButtonListeners()
Refresh()