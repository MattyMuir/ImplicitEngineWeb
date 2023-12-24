"use strict"

// === Globals ===
var ctx = document.getElementById("mainCanvas").getContext("2d")
var w = 0
var h = 0

// === Event Handlers ===
function UpdateDimensions()
{
    var canvasDiv = document.getElementById("canvasDiv")
    w = canvasDiv.getBoundingClientRect().width
    h = canvasDiv.getBoundingClientRect().height

    ctx.canvas.width = w
    ctx.canvas.height = h
}

function Refresh()
{
    UpdateDimensions()
    console.log(`w: ${w} h: ${h}`)
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
    ctx.moveTo(0, 0)
    ctx.lineTo(w, h)
    ctx.moveTo(0, h)
    ctx.lineTo(w, 0)
    ctx.stroke()
}

// === Main ===
Refresh()