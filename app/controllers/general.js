const User = require("../database/models/user");
const PublicMessage = require("../database/models/public-message");
const PvMessage = require("../database/models/pv-message");
const elastic = require("../utils/elastic");

module.exports.getMessages = async (req, res) => {
  if (req.query.status === "public") {
    const messages = await PublicMessage.find()
      .populate("sender")
      .sort({ createdAT: 1 });
    // console.log(messages);
    return res.json(messages);
  } else if (req.query.status === "pv") {
    // console.log(req.query.username);

    const user = await User.findOne({ username: req.query.username });
    const host = await User.findOne({ username: req.query.hostUser });

    const messages = await PvMessage.find({
      $or: [
        { sender: user._id, receiver: host._id },
        { sender: host._id, receiver: user._id },
      ],
    })
      .sort({ createdAT: 1 })
      .populate("sender");
    // console.log(messages);
    res.json(messages);
  }
};

module.exports.getUserInfo = async (req, res) => {
  res.json({ id: req.session.passport.user, username: req.user.username });
};

module.exports.savePvMessages = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.host });
    // console.log("req.body: ", req.body);
    // console.log("host user: ", user);

    const date = Date.now();
    await PvMessage.create({
      message: req.body.data.message,
      sender: req.body.data.userId,
      receiver: user._id,
      createdAT: date,
    });

    res.json({ isSaved: true });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
