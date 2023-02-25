const express = require ('express');
const colors = require ('colors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const {graphqlHTTP} = require('express-graphql');
const connectDB = require ('./config/db')
const schema = require ('./schema/schema')


const app = express();

//CONNECT TO DATABASE
connectDB();

app.use('/graphql', graphqlHTTP({

    schema,
    graphiql: process.env.NODE_ENV === 'development'

}))




app.listen(port, console.log(`server runing on port ${port}`));