const express = require("express");

const {authentication} = require("../auth/auth");
const {
  registerHandler,
  logOutHandler,
  pvChatWithUsername,
  loginHandler,
} = require("../controllers/user");

const router = express.Router();

// Login
router.post("/login", loginHandler);

// Register via username and password
router.post("/register", registerHandler);

// Log out
router.get("/logout", authentication, logOutHandler);

// PV chat
router.get("/pv-chat/:username", authentication, pvChatWithUsername);

module.exports = router;
