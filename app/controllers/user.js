const User = require("../database/models/user");
const bycrypt = require("bcryptjs");
const passport = require("passport");
const elastic = require("../utils/elastic");
const axios = require("axios");

module.exports.registerHandler = async (req, res) => {
  try {
    console.log(req.body);
    let credentials = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    if (credentials.username === "" || credentials.password === "") {
      //   req.flash("error", "Missing credentials");
      //   req.flash("showRegisterForm", true);
      console.log("Missing credentials");
      res.redirect("/error");
    } else {
      // Check if the username already exists for non-social account
      const user = await User.findOne({ username: req.body.username });
      console.log(user);

      if (user) {
        // req.flash("error", "Username already exists.");
        console.log("Username already exists.");
        // req.flash("showRegisterForm", true);
        res.redirect("/error");
      } else {
        await bycrypt.hash(credentials.password, 10, async (err, hash) => {
          if (err) {
            throw err;
          }
          credentials.password = hash;
          const newUser = await User.create(credentials);

          // const postData = {
          //     id: newUser._id,
          //     username: newUser.username,
          //     email: newUser.email,
          //   };

          //   const response = await axios.post('http://localhost:9200/users/_doc', postData, {
          //     headers: {
          //       'Content-Type': 'application/json'
          //     }
          //   });

          // console.log(response.data);
          const userElastic = await elastic.index({
            index: "users",
            document: {
              id: newUser._id,
              username: newUser.username,
              email: newUser.email,
            },
          });

          console.log("userElastic: ", userElastic);
          console.log("Your account has been created. Please log in.");
          // console.log("newUser: ", newUser);
        });
        // req.flash("success", "Your account has been created. Please log in.");

        res.redirect("/");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.loginHandler = passport.authenticate("local", {
  successRedirect: "/chat",
  failureRedirect: "/",
  // failureFlash: true,
});

module.exports.logOutHandler = (req, res) => {
  // console.log("1", req.session);

  req.logOut((err) => {
    // console.log("hiiii");
    if (err) {
      console.log(err);
    }
  });
  //   req.session.destroy();
  // console.log("2", req.session);
  res.redirect("/");
  //   req.session.destroy((err)=>{
  //     console.log(err);
  //   })
};

module.exports.pvChatWithUsername = async (req, res) => {
  // console.log(req.user.username !== req.params.username);
  if (req.user.username !== req.params.username) {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.render("pv-chat", { username: req.params.username });
    } else {
      res.redirect("error");
    }
  } else {
    res.redirect("error");
  }
};
