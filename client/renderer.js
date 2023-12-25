function EquationToExpression(eqnStr)
{
    if (eqnStr.length == 0) return ""
    var sides = eqnStr.split("=")
    var lhs = sides[0]
    var rhs = sides[1]
    return `${lhs} - (${rhs})`
}

function Eval(eqn, x_, y_)
{
    return eqn.evaluate({ x: x_, y: y_ })
}

function IsPositive(x)
{
    return (x >= 0) ? 1 : 0
}

function DrawLine(ctx, bounds, x0, y0, x1, y1)
{
    var worldW = bounds.xMax - bounds.xMin
    var worldH = bounds.yMax - bounds.yMin
    var x0Screen = (x0 - bounds.xMin) / worldW * bounds.w
    var y0Screen = (1 - (y0 - bounds.yMin) / worldH) * bounds.h
    var x1Screen = (x1 - bounds.xMin) / worldW * bounds.w
    var y1Screen = (1 - (y1 - bounds.yMin) / worldH) * bounds.h

    ctx.moveTo(x0Screen, y0Screen)
    ctx.lineTo(x1Screen, y1Screen)
}

function RenderEquation(ctx, eqnStr, bounds)
{
    // Pre-process and compile equation
    var eqn = math.compile(EquationToExpression(eqnStr))

    // Grid dimensions
    const gridW = 1000
    const gridH = 1000

    // Marching squares lookup table
    const LUT = [
        [],
        [0, 3],
        [0, 1],
        [1, 3],
        [1, 2],
        [0, 3, 1, 2],
        [0, 2],
        [2, 3],
        [2, 3],
        [0, 2],
        [0, 1, 2, 3],
        [1, 2],
        [1, 3],
        [0, 1],
        [0, 3],
        []
    ]

    // Pre-compute useful values
    var worldW = bounds.xMax - bounds.xMin
    var worldH = bounds.yMax - bounds.yMin
    var dx = worldW / gridW
    var dy = worldH / gridH

    // Loop over entire grid
    for (let yi = 0; yi < gridH; yi++)
    {
        for (let xi = 0; xi < gridW; xi++)
        {
            var x = bounds.xMin + xi * dx
            var y = bounds.yMin + yi * dy

            // Evaluate function over grid square
            // bottom-left, bottom-right, top-right, top-left
            var fs = [0, 0, 0, 0]
            fs[0] = Eval(eqn, x, y)
            fs[1] = Eval(eqn, x + dx, y)
            fs[2] = Eval(eqn, x + dx, y + dy)
            fs[3] = Eval(eqn, x, y + dy)

            // Get lookup table index
            var lutIdx = 0
            var pow2 = 1
            for (let i = 0; i < 4; i++)
            {
                lutIdx += IsPositive(fs[i]) * pow2
                pow2 *= 2
            }
            
            // Get edge indices using LUT
            edgeIndices = LUT[lutIdx]
            var edgeXs = [x + dx / 2, x + dx, x + dx / 2, x]
            var edgeYs = [y, y + dy / 2, y + dy, y + dy / 2]

            for (var i = 0; i < edgeIndices.length; i += 2)
            {
                var edgeX0 = edgeXs[edgeIndices[i]]
                var edgeY0 = edgeYs[edgeIndices[i]]
                var edgeX1 = edgeXs[edgeIndices[i + 1]]
                var edgeY1 = edgeYs[edgeIndices[i + 1]]
                DrawLine(ctx, bounds, edgeX0, edgeY0, edgeX1, edgeY1)
            }
        }
    }
}