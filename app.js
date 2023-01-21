const express = require("express");
const dotenv = require("dotenv").config();
const path = require('path');

const port = process.env.PORT || 5000;

const app = express();

app.use('/openai', require('./routes/openaiRoutes'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.listen(port, ()=>{

    console.log(`Server started at port: ${port}`);
});


