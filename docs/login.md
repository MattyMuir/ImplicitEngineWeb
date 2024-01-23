## GET /login
Make a login request to the server for a user.

### Query Parameters
| Name | Type | Description |
| ---- | ---- | ---- |
| `username` | String | The username of the user attempting to log in. |
| `password` | String | The entered password. |
### Example Code
```JS
let usernameInput = document.getElementById("usernameInput")
let passwordInput = document.getElementById("passwordInput")
const response = await fetch(`/login?
	username=${usernameInput.value}&password=${passwordInput.value}`)

const status = response.status
```

### Example Responses
##### Success
```
Status Code: 200
```
##### Incorrect Password
```
Status Code: 401
```
##### User does not exist
```
Status Code: 404
```