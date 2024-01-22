// Import and initialize express
const express = require("express")
const cryptoJS = require("crypto-js")
const app = express()

// Add all static files in the root directory
app.use(express.static("client"))
app.use(express.static("../client"))

// Interpret request bodies as JSON
app.use(express.json())

// === Data Structure ===
class User
{
	constructor(username_, passwordHash_, timeJoined_)
	{
		this.username = username_
		this.passwordHash = passwordHash_
		this.timeJoined = timeJoined_
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
	let username = request.query.username

	// Prepare return object
	let result = []

	// Make sure user exists
	let userExists = false
	for (const user of users)
		if (user.username == username)
			userExists = true
	if (!userExists) response.sendStatus(404)

	// Find all graphs belonging to this user
	for (const graph of graphs)
	{
		if (graph.username == username) result.push(graph)
	}

	response.send(result)
})

// Individual graph GET method
app.get("/graph", (request, response) => {
	// Find the graph with the correct name belonging to this user
	let name = request.query.name
	let username = request.query.username
	for (const graph of graphs)
	{
		if (graph.name == name && graph.username == username)
		{
			response.send(graph)
			return
		}
	}

	// Graph not found
	response.sendStatus(404)
})

// Login GET method
app.get("/login", (request, response) => {
	let username = request.query.username
	let password = request.query.password

	for (const user of users)
	{
		if (user.username == username)
		{
			// User found
			if (cryptoJS.SHA256(password).toString() == user.passwordHash.toString())
				response.sendStatus(200) // OK
			else
				response.sendStatus(401) // Unauthorized
			return
		}
	}

	// User not found
	response.sendStatus(404) // Not found
})

// List users GET method
app.get("/listUsers", (request, response) => { // eslint-disable-line no-unused-vars
	let usernames = []
	for (const user of users) usernames.push(user.username)
	response.send(usernames)
})

// Individual user GET method
app.get("/user", (request, response) => {
	let username = request.query.username

	for (const user of users)
	{
		if (user.username == username)
		{
			response.send({ username: username, timeJoined: user.timeJoined })
			return
		}
	}

	response.sendStatus(404)
})

// === POST Methods ===

// New graph POST method
app.post("/newGraph", (request, response) => {
	let graphInfo = request.body

	// Make sure user exists
	let userExists = false
	for (const user of users)
		if (user.username == graphInfo.username)
			userExists = true
	if (!userExists) response.sendStatus(404)

	// Check if graph already exists
	for (let graph of graphs)
	{
		if (graph.name == graphInfo.name && graph.username == graphInfo.username)
		{
			graph.eqnStrings = JSON.parse(graphInfo.eqnStrings)
			response.sendStatus(200) // OK
			return
		}
	}

	let newGraph = new Graph(graphInfo.name, graphInfo.username, JSON.parse(graphInfo.eqnStrings))
	graphs.push(newGraph)
	response.sendStatus(201) // Created
})

// New user POST method
app.post("/newUser", (request, response) => {
	let newUserInfo = request.body

	// Check if username is taken
	for (const user of users)
	{
		if (newUserInfo.username == user.username)
		{
			// Username already taken
			response.sendStatus(409) // Conflict
			return
		}
	}

	// Add user
	users.push(new User(newUserInfo.username, cryptoJS.SHA256(newUserInfo.password), Date.now()))
	response.sendStatus(201) // Created
})

module.exports = app