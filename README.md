## Nodejs RESTful API Boilerplate with JSONWebToken | Express Js

### How to use

- Clone the repository with __git clone__
- Run __npm install__
- Run __cp .env.example .env__ for create .env file
- Import __db.sql__ database
- Edit database credentials __.env__ file 
- Run __npm run dev__ for start server

### Serve run http://localhost:8080

## API Endpoints

#### Welcome
- **<code>GET</code> api/welcome**


#### Servers
- **<code>GET</code> api/users/getinfobydesc**
- **<code>GET</code> api/users/geterrores**
- **<code>GET</code> api/users/getservers**
- **<code>POST</code> api/users/gettopservers**


## API Status Code

Following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| `2xx Success` |
| 200 | `Success` |
| 201 | `Created` |
| `4xx Client Error` |
| 400 | `Bad Request` |
| 401 | `Unauthorized` |
| 404 | `Not Found` |
| `5xx Server Error` |
| 500 | `Internal Server Error` |
