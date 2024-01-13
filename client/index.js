"use strict"

// === Globals ===
let ctx = document.getElementById("mainCanvas").getContext("2d")
let bounds = { w: 0, h: 0, xMin: -10, yMin: -10, xMax: 10, yMax: 10 }

// === Event Handlers ===
function UpdateDimensions()
{
    let canvasDiv = document.getElementById("canvasDiv")
    bounds.w = canvasDiv.getBoundingClientRect().width
    bounds.h = canvasDiv.getBoundingClientRect().height

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

    console.log("Pressed")
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
        catch(error)
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

function PlusButtonListener()
{
    let plusBtn = document.getElementById("plusBtn")
    plusBtn.onclick = PlusButtonPressed
}

// === Main ===
AddTextListeners()
PlusButtonListener()
Refresh()