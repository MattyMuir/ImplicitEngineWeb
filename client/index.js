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

function PlusButtonPressed(event)
{
    let eqnList = document.getElementById("eqnList")

    // Create new list item
    let newInput = document.createElement("li")
    newInput.classList.add("list-group-item")
    newInput.classList.add("p-1")
    newInput.innerHTML = "<input type=\"text\" class=\"form-control\">"

    // Add new item to eqnList
    eqnList.appendChild(newInput)

    // Add event listener
    newInput.children[0].addEventListener("input", OnTextChanged)
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
    });

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

function OnEquationRenamed()
{
    let renameInput = document.getElementById("renameInput")
    let graphNameDisplay = document.getElementById("graphNameDisplay")
    graphName = renameInput.value
    graphNameDisplay.innerHTML = graphName
}

function LoginPressed()
{

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
    });

    console.log(response.status)

    let loginResult = document.getElementById("loginResult")
    loginResult.classList.remove("d-none")

    if (response.status == 201)
    {
        loginResult.innerHTML = "Success"
        SuccessfulLogin(newUserInfo.username)
    }
    else if (response.status == 409)
    {
        loginResult.innerHTML = "Username Taken"
    }
    else
    {
        loginResult.innerHTML = "Error Occurred"
    }

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
}

function OnResize(event)
{
    Refresh()
}
window.onresize = OnResize;

// === Other Functions ===
function OnDraw()
{
    let eqnList = document.getElementById("eqnList")
    for (let child of eqnList.children)
    {
        let textInput = child.children[0]
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