//create web server
const express = require('express')

//create application
const app = express()

//create a port
const port = 3000

//create a home page
app.get('/', (req, res) => {
    res.send('Hello World!')
})

//create a comments page
app.get('/comments', (req, res) => {
    res.send('This is the comments page')
})

//create a comments page
app.get('/comments/:id', (req, res) => {
    res.send('This is the comments page for ' + req.params.id)
})

//start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
