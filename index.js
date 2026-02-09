const express = require("express");
const bodyParser = require('body-parser')
const methodOverride = require("method-override")
const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")
const database = require("./config/database")
require("dotenv").config();

database.connect();

const app = express();
const port = process.env.port;

app.use(methodOverride('_method'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

app.set("views","./views");
app.set("view engine","pug");

app.use(express.static("public"))

route(app);
routeAdmin(app);

app.listen(port,() => {
    console.log("App listening port"+port)
})