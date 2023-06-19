const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/Reg", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("Connection Failed"));
db.once("open", () => console.log("Connection established"));

app.post("/signup", (req, res) => {
  var fullname = req.body.fullname;
  var gender = req.body.gender;
  var email = req.body.email;
  var password = req.body.password;

  const data = {
    name: fullname,
    gender: gender,
    email: email,
    password: password,
  };
  db.collection("users").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    {
    console.log("Record Inserted Successfully");
    }
  });
  {
    return res.redirect("/signin");
  }
});
app.post("/signin", async (req, res) => {
  try {
    const check = await db.collection("users").findOne({ email: req.body.email });
    console.log(check);
    if (check.password === req.body.password) {
      res.redirect("/account");
    } else {
      console.log("Wrong Credentials");
    }
  } catch {
    console.log("Weong Details");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get("/signin", (req, res) => {
  res.sendFile(__dirname + "/public/signin.html");
});
app.get("/account", (req, res) => {
  res.sendFile(__dirname + "/public/account.html");
});
app.listen(3000, function () {
  console.log(`App listening on port ${port}`);
});
