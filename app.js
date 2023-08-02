if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const expresserror = require("./utils/expresserror");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const password = encodeURIComponent("8B42IwjEzI1Cc7zI");
const db_url = `mongodb+srv://trupti:${password}@cluster0.sfioioq.mongodb.net/?retryWrites=true&w=majority` || 'mongodb://localhost:27017/yelp-camp' 
const MongoStore = require("connect-mongo");
const store = MongoStore.create({
  mongoUrl: db_url,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "thisshouldbeabettersecret!",
  },
});
store.on("error", function (e) {
  console.log("session store error", e);
});
// `mongodb+srv://truptilakhara:${password}@cluster0.cixwxze.mongodb.net/?retryWrites=true&w=majority`;
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/review");
const campgroundRoutes = require("./routes/campground");

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  store,
  secret: "thisisshouldbebettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

// how do we get store a user in the session
passport.serializeUser(User.serializeUser());
// how do you get a user out of that session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("Listening on port number 3000");
});
