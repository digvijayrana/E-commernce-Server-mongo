const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000
const {connectToDatabase} = require('./config/config')



connectToDatabase()
app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})