## GET /user
Get the details of an individual user based on a username.

### Query Parameters
| Name | Type | Description |
| ---- | ---- | ---- |
| `username` | String | The username of the user. |
### Example Code
```JS
const username = "SomeUser"
const response = await fetch(`/graph?username=${username}`)
const user = await response.json()
```

### Example Responses
##### Success
```JSON
{
	username: "SomeUser",
	timeJoined: 4367543897534775
}
```
##### User not found
```
Error Code: 404
```

### Response Fields
| Name | Type | Description |
| ---- | ---- | ---- |
| `username` | String | The name of the user |
| `timeJoined` | Number | The number of milliseconds since epoch when this user joined, as returned by `Date.now()`. |
