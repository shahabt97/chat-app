const express = require("express");
const uuid = require("uuid").v4;

const {authentication,serverOnly} = require("../auth/auth");
const { getMessages, getUserInfo, savePvMessages } = require("../controllers/general");

const router = express.Router();


// main page
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/chat");
  } else {
    res.render("login");
  }
});

// Public chat
router.get("/chat", (req, res) => {
  res.render("public-chat");
});

router.get("/error", (req, res) => {
  res.send("Error");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// get user id and username for frontend
router.get("/get-user-id", authentication, getUserInfo);

// get public and pv messages to use in frontend
router.get("/get-messages", authentication, getMessages);

// save pv meassages
router.post("/save-pv-messages", serverOnly,savePvMessages);

module.exports = router;
