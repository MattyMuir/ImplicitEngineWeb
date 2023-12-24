"use strict"

// Main
var canvas = document.getElementById("mainCanvas")
var w = canvas.getBoundingClientRect().width
var h = canvas.getBoundingClientRect().height

// Drawing
var ctx = canvas.getContext("2d")

ctx.canvas.width = w
ctx.canvas.height = h

ctx.moveTo(0, 0)
ctx.lineTo(w, h)
ctx.moveTo(0, h)
ctx.lineTo(w, 0)
ctx.stroke()