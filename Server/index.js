const express = require("express")
const cors = require("cors")
require('dotenv').config() ;
const userRoutes = require("./routes/userRoutes")
const dbConnect = require("./config/database") ;
const app = express() ;


const PORT = process.env.PORT || 10000 ;

app.use(express.json()) ;
app.use( cors( {origin:"*",} ) ) ;

dbConnect() ;

app.use("/api/v1" , userRoutes ) ;

app.get("/", (req, res) => {
    res.send(`<h1>Backend is Running on port no. ${PORT} and this is '/' Route.</h1>`);
});

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});
