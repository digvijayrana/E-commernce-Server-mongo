require('dotenv').config()
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000
const auth = require('./route/auth')
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use('/api/auth',auth)
app.use('/api/user',require('./route/user'))
app.use('/api/product',require('./route/product'))
app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})