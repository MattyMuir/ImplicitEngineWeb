class Point
{
    constructor(x_, y_)
    {
        this.x = x_;
        this.y = y_;
    }
}

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

function ToScreen(p, bounds)
{
    var worldW = bounds.xMax - bounds.xMin
    var worldH = bounds.yMax - bounds.yMin
    var xScreen = (p.x - bounds.xMin) / worldW * bounds.w
    var yScreen = (1 - (p.y - bounds.yMin) / worldH) * bounds.h

    return new Point(xScreen, yScreen)
}

function DrawLine(p0, p1, ctx, bounds)
{
    var p0Screen = ToScreen(p0, bounds)
    var p1Screen = ToScreen(p1, bounds)

    ctx.moveTo(p0Screen.x, p0Screen.y)
    ctx.lineTo(p1Screen.x, p1Screen.y)
}

function RenderEquation(ctx, eqnStr, bounds)
{
    // Pre-process and compile equation
    var eqn = math.compile(EquationToExpression(eqnStr))

    // Grid dimensions
    const gridW = 100
    const gridH = 100

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

            var edges = [
                new Point(x + dx / 2, y),
                new Point(x + dx, y + dy / 2),
                new Point(x + dx / 2, y + dy),
                new Point(x, y + dy / 2)
            ]

            for (var i = 0; i < edgeIndices.length; i += 2)
            {
                var p0 = edges[edgeIndices[i]]
                var p1 = edges[edgeIndices[i + 1]]
                DrawLine(p0, p1, ctx, bounds)
            }
        }
    }
}