"use strict"

// === Globals ===
var ctx = document.getElementById("mainCanvas").getContext("2d")
var bounds = { w: 0, h: 0, xMin: -10, yMin: -10, xMax: 10, yMax: 10 }

// === Event Handlers ===
function UpdateDimensions()
{
    var canvasDiv = document.getElementById("canvasDiv")
    bounds.w = canvasDiv.getBoundingClientRect().width
    bounds.h = canvasDiv.getBoundingClientRect().height

    ctx.canvas.width = bounds.w
    ctx.canvas.height = bounds.h
}

function Refresh()
{
    UpdateDimensions()
    OnDraw()
}

function OnResize(event)
{
    Refresh()
}
window.onresize = OnResize;

// === Other Functions ===
function OnDraw()
{
    var eqnList = document.getElementById("eqnList")
    for (var child of eqnList.children)
    {
        var textInput = child.children[0]
        RenderEquation(ctx, textInput.value, bounds)
    }
    ctx.stroke()
}

// === Main ===
Refresh()