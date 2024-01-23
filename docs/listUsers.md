## GET /listUsers
List all the users on the server.

### Query Parameters
`None`.
### Example Code
```JS
const response = await fetch(`/listUsers`)
const allUsers = await response.json()
```

### Example Responses
##### Success
```JSON
["Bob127", "Jim308", "Steve1996"]
```