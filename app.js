const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port =  process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
var moment = require("moment");

// require

const Customer = require("./models/customerSchema");

// update data
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

// send data db
app.use(express.urlencoded({ extended: true }));
//  auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

mongoose
  .connect(
    "mongodb+srv://alazzi77:Uup8BY8WreNrCcwS@cluster0.dsfyymd.mongodb.net/all-data?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// get requiest
app.get("/", (req, res) => {
  Customer.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

app.get("/user/view.html", (req, res) => {
  res.render("user/view");
});

app.get("/user/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      console.log(result);
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/edit/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// post requiest
app.post("/user/add.html", (req, res) => {
  console.log(req.body);
  Customer.create(req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/search", (req, res) => {
  console.log(req.body.searchText);
  Customer.find({ firstName: req.body.searchText })
    .then((result) => {
      res.render("user/search", {arr: result})
    })
    .catch((err) => {
      console.log(err)
    });
});

//  put request
app.put("/edit/:id", (req, res) => {
  console.log(req.body);
  Customer.updateOne({ _id: req.params.id }, req.body)
    .then((params) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

//  delete request

app.delete("/delete/:id", (req, res) => {
  Customer.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});
