const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("./app/database/main");
const indexRouter = require("./app/routes/main");
const userRouter = require("./app/routes/user");
const { testRouter } = require("./app/test/test");
const { mongoHost } = require("./app/utils/hosts");
const app = express();
const server = require("./app/socket")(app);
require("./app/auth/index");



const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: `mongodb://${mongoHost}:27017/chat-application`,
    }),
    cookie: { expires: 10 * 24 * 60 * 60 * 1000 },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", testRouter);
app.use("/", userRouter);
app.use("/", indexRouter);

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
