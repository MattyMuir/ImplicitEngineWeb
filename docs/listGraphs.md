## GET /listGraphs
Lists all the graphs belonging to a particular user.

### Query Parameters
| Name | Type | Description |
| ---- | ---- | ---- |
| `username` | String | The username of the user to list the graphs of. |
### Example Code
```JS
const username = "SomeUser"
const response = await fetch(`/listGraphs?username=${username}`)
const userGraphs = await response.json()
```

### Example Responses
##### Success
```JSON
[
	{
		name: "MyGraph",
		username: "Bob",
		eqnStrings: ["y=x", "y=cos(x)"]
	},
	{
		name: "OtherGraph",
		username: "Jim",
		eqnStrings: ["x^2+y^2=1"]
	}
]
```
##### User not found
```
Error Code: 404
```

##### User has no graphs
```JSON
[]
```