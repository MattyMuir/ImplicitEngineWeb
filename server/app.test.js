const request = require("supertest")
const app = require("./app")

/* eslint-disable */
describe("POST methods", () => {
	test("Add new user", () => {
		return request(app)
			.post("/newUser")
			.send({username: "matty", password: "matty"})
			.expect(201)
	})

	test("Add second user", () => {
		return request(app)
			.post("/newUser")
			.send({username: "bob", password: "bob"})
			.expect(201)
	})

	test("Add conflicting user", () => {
		return request(app)
			.post("/newUser")
			.send({username: "matty", password: "matty"})
			.expect(409)
	})

	test("Add new graph", () => {
		return request(app)
			.post("/newGraph")
			.send({name: 'MattysGraph', username: 'matty', eqnStrings: '["y=x","y=cos(x)"]'})
			.expect(201)
	})

	test("Update existing graph", () => {
		return request(app)
			.post("/newGraph")
			.send({name: 'MattysGraph', username: 'matty', eqnStrings: '["y=x","y=cos(x)"]'})
			.expect(200)
	})

	test("Add graph for non-existent user", () => {
		return request(app)
			.post("/newGraph")
			.send({name: 'aGraph', username: 'steve', eqnStrings: '["y=x","y=cos(x)"]'})
			.expect(404)
	})
})

describe("GET methods", () => {
	test("GET individual graph", () => {
		return request(app)
			.get("/graph")
			.query({name: "MattysGraph", username: "matty"})
			.expect(200)
			.expect('Content-Type', /json/)
	})

	test("GET non-existent graph", () => {
		return request(app)
			.get("/graph")
			.query({name: "IDontExist", username: "matty"})
			.expect(404)
	})

	test("Successful login", () => {
		return request(app)
			.get("/login")
			.query({username: "matty", password: "matty"})
			.expect(200)
	})

	test("User not found login", () => {
		return request(app)
			.get("/login")
			.query({username: "steve", password: "steve"})
			.expect(404)
	})

	test("Wrong password login", () => {
		return request(app)
			.get("/login")
			.query({username: "matty", password: "wrongPassword"})
			.expect(401)
	})

	test("List graphs works", () => {
		return request(app)
			.get("/listGraphs")
			.query({username: "matty"})
			.expect(200)
			.expect('Content-Type', /json/)
	})

	test("List graphs for non-existent user", () => {
		return request(app)
			.get("/listGraphs")
			.query({username: "steve"})
			.expect(404)
	})

	test("Users is not empty", () => {
		return request(app)
			.get("/listUsers")
			.expect(200)
			.expect('Content-Type', /json/)
	})

	test("GET individual user", () => {
		return request(app)
			.get("/user")
			.query({username: "matty"})
			.expect(200)
			.expect('Content-Type', /json/)
	})

	test("GET non-existent user", () => {
		return request(app)
			.get("/user")
			.query({username: "steve"})
			.expect(404)
	})
})