var passport = require("passport");
var bcrypt = require("bcryptjs");

const { Strategy } = require("passport-local");
const User = require("../database/models/user");

// Plug-in Local Strategy
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      //   if (err) { return done(err); }
      console.log(user);

      if (!user) {
        return done(null, false, {
          message: "Incorrect username or passwordddddd.",
        });
      }

      let isMatch = null;

      await bcrypt.compare(password, user.password, (err, matched) => {
        if (err) {
          console.log(err);
        }
        isMatch = matched;
        if (!isMatch) {
          console.log(password);
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        return done(null, user);
      });
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, { id: user.id, username: user.username });
});
