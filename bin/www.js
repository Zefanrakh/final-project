const http = require('http')
const app = require('../app')
const port = 3000
const httpServer = http.createServer(app)

httpServer.listen(port,()=>{
    console.log(`ada di port ${port}`)
})