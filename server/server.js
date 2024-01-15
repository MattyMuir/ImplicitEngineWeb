// Import and initialize express
const express = require("express")
const app = express()

// Add all static files in the root directory
app.use(express.static("client"))

// Interpret request bodies as JSON
app.use(express.json())

// === Data Structure ===
class User
{
	constructor(username_, password_)
	{
		this.username = username_
		this.password = password_
	}
}

class Graph
{
	constructor(id_, name_, username_, eqnStrings_)
	{
		this.id = id_
		this.name = name_
		this.username = username_
		this.eqnStrings = eqnStrings_
	}
}

let users = []
let nextGraphId = 0
let graphs = []

// Test data
users.push(new User("Matty", "12345"))
graphs.push(new Graph(nextGraphId, "BasicExample", "Matty", ["y=x", "x^2+y^2=1", "cos(x)+cos(y)=3"]))
nextGraphId++

// === GET Methods ===

// List graph GET method
app.get("/listGraphs", (request, response) => {
	// Prepare return object
	let result = []

	// Find all graphs belonging to this user
	let username = request.query.username
	for (const graph of graphs)
	{
		if (graph.username == username) result.push(graph)
	}

	response.send(result)
})

// Individual graph GET method
app.get("/graph", (request, response) => {
	// Find all graphs belonging to this user
	let id = request.query.id
	for (const graph of graphs)
	{
		if (graph.id == id) response.send(graph)
	}

	// Graph not found
	response.sendStatus(404)
})

app.post("/newGraph", (request, response) => {
	console.log(request.body)
	let graphInfo = request.body

	let newGraph = new Graph(nextGraphId++, graphInfo.name, graphInfo.username, JSON.parse(graphInfo.eqnStrings))
	graphs.push(newGraph)

	response.send()
})

// === POST Methods ===

// Start server
app.listen(8080)