const express = require('express')
const routes = require('./routes')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000


// Middleware parse JSON
app.use(express.json())

// Routes 
app.use('/api', routes)
app.use('/', routes)

// Start server
app.listen(PORT, () => {
  console.log(`server running: http://localhost:${PORT}`)
})