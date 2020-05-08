const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { appParams } = require("./utils/apputils");
const { handleAllRequests, handleAllResponses, jwtParams } = require('./utils/authutils');

const app = express();

const urlHead = appParams.getApiUrlHead();

mongoose
    .connect("mongodb://t_ame:Special.girl1@cluster0-shard-00-00-jv57m.mongodb.net:27017,cluster0-shard-00-01-jv57m.mongodb.net:27017,cluster0-shard-00-02-jv57m.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log("Database connected");
        app.listen(3000);
    })
    .catch(err => console.log(err));

jwtParams.setNewSessionRoute({path: urlHead + "/users", method: "POST"});
jwtParams.setNewSessionRoute({path: urlHead + "/login", method: "POST"});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// app.use(handleAllRequests);

app.use(urlHead + "/users", userRoutes);
app.use(urlHead + "/", authRoutes);

app.use(handleAllResponses);


