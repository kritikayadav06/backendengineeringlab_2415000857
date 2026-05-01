const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.get("/", (req, res) => {
  if (!req.session.user && req.cookies.user) {
    return res.send(
      "Welcome back! Last time you logged in as " + req.cookies.user,
    );
  }
  res.send("Welcome to Online Course Platform");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.send("Enter username and role");
  }

  req.session.user = { username, role };

  res.cookie("user", username, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.redirect("/profile");
});

app.get("/courses", (req, res) => {
  if (!req.session.user) return res.send("Login first");

  res.send("You can view courses");
});

app.get("/create-course", (req, res) => {
  if (!req.session.user) return res.send("Login first");

  if (req.session.user.role !== "instructor") {
    return res.send("Access denied");
  }

  res.send("You can create a course");
});

app.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  res.render("profile", {
    username: req.session.user.username,
    role: req.session.user.role,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.send("Logged out successfully");
  });
});
app.listen(8000, () => console.log("Server running on 8000"));
