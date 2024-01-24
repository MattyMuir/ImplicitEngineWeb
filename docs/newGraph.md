## POST /newGraph
Add a new graph for a specific user.

### JSON Body Parameters
A JSON object containing

| Name | Type | Description |
| ---- | ---- | ---- |
| `name` | String | The name of the graph. |
| `username` | String | The username of the user the graphs belongs to. |
| `eqnStrings` | String | String containing array of strings for the equations of this graph. |
### Example Code
```JS
const newGraph = {
	name: "My Graph",
	username: "Steve653",
	eqnStrings: '["y=x","y=cos(x)"]'
}

const response = await fetch("/newGraph", {
	method: "POST",
	mode: "cors",
	headers: {"Content-Type": "application/json"},
	body: JSON.stringify(newGraph)
})
```

### Example Responses
##### Graph Created
```
Status Code: 201
```
##### Existing Graph Updated
```
Status Code: 200
```