class Point
{
    constructor(x_, y_)
    {
        this.x = x_;
        this.y = y_;
    }
}

class Line
{
    constructor(p0_, p1_)
    {
        this.p0 = p0_;
        this.p1 = p1_;
    }
}

class InvalidEquation extends Error
{
    constructor()
    {
        super()
    }
}

function EquationToExpression(eqnStr)
{
    if (eqnStr.length == 0) return ""
    let sides = eqnStr.split("=")

    // Equation validation
    if (sides.length != 2) throw new InvalidEquation()

    let lhs = sides[0]
    let rhs = sides[1]
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
    let worldW = bounds.xMax - bounds.xMin
    let worldH = bounds.yMax - bounds.yMin
    let xScreen = (p.x - bounds.xMin) / worldW * bounds.w
    let yScreen = (1 - (p.y - bounds.yMin) / worldH) * bounds.h

    return new Point(xScreen, yScreen)
}

function DrawLine(p0, p1, ctx, bounds)
{
    let p0Screen = ToScreen(p0, bounds)
    let p1Screen = ToScreen(p1, bounds)

    ctx.moveTo(p0Screen.x, p0Screen.y)
    ctx.lineTo(p1Screen.x, p1Screen.y)
}

function DrawAxes(ctx, bounds)
{
    DrawLine(new Point(0, bounds.yMin), new Point(0, bounds.yMax), ctx, bounds)
    DrawLine(new Point(bounds.xMin, 0), new Point(bounds.xMax, 0), ctx, bounds)

    ctx.font = "18px Calibri";

    // Axes markers
    // X Axis
    for (let x = Math.ceil(bounds.xMin); x <= Math.floor(bounds.xMax); x++)
    {
        let point = ToScreen(new Point(x, 0), bounds)
        ctx.fillText(`${x}`, point.x, point.y)
    }
    
    // Y Axis
    for (let y = Math.ceil(bounds.yMin); y <= Math.floor(bounds.yMax); y++)
    {
        let point = ToScreen(new Point(0, y), bounds)
        ctx.fillText(`${y}`, point.x, point.y)
    }
}

function GetCaseIndex(fs)
{
    let lutIdx = 0
    let pow2 = 1
    for (let i = 0; i < 4; i++)
    {
        lutIdx += IsPositive(fs[i]) * pow2
        pow2 *= 2
    }
    return lutIdx
}

function Interpolate(edgeIdx, xs, ys, fs)
{
    let point = new Point(0, 0)
    if (edgeIdx % 2 == 0) // Horizontal edge
    {
        // Point's y coordinate is trivial
        point.y = ys[edgeIdx]

        // Interpolate for x coordinate
        let x1 = xs[edgeIdx]
        let x2 = xs[edgeIdx + 1]
        let v1 = fs[edgeIdx]
        let v2 = fs[edgeIdx + 1]

        point.x = (x1 * v2 - v1 * x2) / (v2 - v1)
    }
    else // Vertical edge
    {
        // Point's x coordinate is trivial
        point.x = xs[edgeIdx]

        // Interpolate for y coordinate
        let y1 = ys[edgeIdx]
        let y2 = ys[(edgeIdx + 1) % 4]
        let v1 = fs[edgeIdx]
        let v2 = fs[(edgeIdx + 1) % 4]

        point.y = (y1 * v2 - v1 * y2) / (v2 - v1)
    }

    return point
}

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

function GetTileLines(xs, ys, fs)
{
    // Get edge indices using LUT
    lutIdx = GetCaseIndex(fs)
    edgeIndices = LUT[lutIdx]
    let lineNum = edgeIndices.length / 2

    // Prepare return value
    let lines = []

    for (let lineIdx = 0; lineIdx < lineNum; lineIdx++)
    {
        let firstEdge = edgeIndices[lineIdx * 2]
        let secondEdge = edgeIndices[lineIdx * 2 + 1]

        let firstPoint = Interpolate(firstEdge, xs, ys, fs)
        let secondPoint = Interpolate(secondEdge, xs, ys, fs)

        lines.push(new Line(firstPoint, secondPoint))
    }

    return lines
}

function RenderEquation(ctx, eqnStr, bounds)
{
    // Pre-process and compile equation
    try
    {
        let expression = EquationToExpression(eqnStr)
        if (expression == "") return
        var eqn = math.compile(expression)
    }
    catch (error)
    {
        throw new InvalidEquation()
    }

    // Grid dimensions
    const gridW = 200
    const gridH = 200

    // Pre-compute useful values
    let worldW = bounds.xMax - bounds.xMin
    let worldH = bounds.yMax - bounds.yMin
    let dx = worldW / gridW
    let dy = worldH / gridH

    // Loop over entire grid
    for (let yi = 0; yi < gridH; yi++)
    {
        for (let xi = 0; xi < gridW; xi++)
        {
            // Calculate coordinates of current square
            let x = bounds.xMin + xi * dx
            let y = bounds.yMin + yi * dy
            let xs = [x, x + dx, x + dx, x]
            let ys = [y, y, y + dy, y + dy]

            // Evaluate function over grid square
            // bottom-left, bottom-right, top-right, top-left
            let fs = [0, 0, 0, 0]
            for (let corner = 0; corner < 4; corner++)
                fs[corner] = Eval(eqn, xs[corner], ys[corner])

            // Compute the lines for this grid square
            lines = GetTileLines(xs, ys, fs)

            // Convert lines to screen coordinates and draw
            for (let i = 0; i < lines.length; i++)
                DrawLine(lines[i].p0, lines[i].p1, ctx, bounds)
        }
    }
}