// Import and initialize express
const express = require("express")
const cryptoJS = require("crypto-js")
const app = express()

// Add all static files in the root directory
app.use(express.static("client"))

// Interpret request bodies as JSON
app.use(express.json())

// === Data Structure ===
class User
{
	constructor(username_, passwordHash_)
	{
		this.username = username_
		this.passwordHash = passwordHash_
	}
}

class Graph
{
	constructor(name_, username_, eqnStrings_)
	{
		this.name = name_
		this.username = username_
		this.eqnStrings = eqnStrings_
	}
}

let users = []
let graphs = []

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

// === POST Methods ===

// New graph POST method
app.post("/newGraph", (request, response) => {
	console.log(request.body)
	let graphInfo = request.body

	// Check if graph already exists
	for (let graph of graphs)
	{
		if (graph.name == graphInfo.name && graph.username == graphInfo.username)
		{
			console.log("Updated")
			graph.eqnStrings = JSON.parse(graphInfo.eqnStrings)
			response.sendStatus(200) // OK
			return
		}
	}

	console.log("Created")
	let newGraph = new Graph(graphInfo.name, graphInfo.username, JSON.parse(graphInfo.eqnStrings))
	graphs.push(newGraph)
	response.sendStatus(201) // Created
})

// New user POST method
app.post("/newUser", (request, response) => {
	console.log(request.body)
	let newUserInfo = request.body

	// Check if username is taken
	for (const user of users)
	{
		if (newUserInfo.username == user.username)
		{
			// Username already taken
			console.log("Username taken")
			response.sendStatus(409) // Conflict
			return
		}
	}

	// Add user
	users.push(new User(newUserInfo.username, cryptoJS.SHA256(newUserInfo.password)))
	response.sendStatus(201) // Created

	console.log(users)
})

// Start server
app.listen(8080)