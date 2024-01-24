## POST /newUser
Add a new user.

### JSON Body Parameters
A JSON object containing

| Name | Type | Description |
| ---- | ---- | ---- |
| `username` | String | The username of the user. |
| `password` | String | The user's password. |
### Example Code
```JS
const newUser = {
	username: "Steve653",
	password: "password123"
}

const response = await fetch("/newUser", {
	method: "POST",
	mode: "cors",
	headers: {"Content-Type": "application/json"},
	body: JSON.stringify(newUser)
})
```

### Example Responses
##### User Created
```
Status Code: 201
```
##### Username Already Exists
```
Error Code: 409
```