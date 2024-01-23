## GET /graph
Get the details of an individual graph belonging to a user.

### Query Parameters
| Name | Type | Description |
| ---- | ---- | ---- |
| `name` | String | The name of the graph. |
| `username` | String | The username of the user the graphs belongs to. |
### Example Code
```JS
const graphName = "MyCircle"
const username = "SomeUser"
const response = await fetch(`/graph?name=${graphName}&username=${username}`)
const graph = await response.json()
```

### Example Responses
##### Success
```JSON
{
	name: "MyGraph",
	username: "Bob",
	eqnStrings: ["y=x", "y=cos(x)"]
}
```
##### Graph not found
```
Error Code: 404
```

### Response Fields
| Name | Type | Description |
| ---- | ---- | ---- |
| `name` | String | The name of the graph |
| `username` | String | The name of the user who owns the graph |
| `eqnStrings` | Array | An array of strings containing the equations belonging to this graph. |