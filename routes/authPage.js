const Session = require("../model/Session");
const Rooms = require("../model/Rooms");
const jwt = require("jsonwebtoken");

exports.authPage = () => async (req, res, next) => {
  try {
    const secret = "secret";
    const token = req.headers["authorization"].split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, secret);

      // Check if the token is expired
      if (decoded.iat <= Date.now() / 1000) {
        await Session.deleteOne({ user: decoded.userId });
        await Rooms.deleteOne({ id_user: decoded.userId });
        res.clearCookie("authorization");
      }
    }
    next();
  } catch (err) {
    next();
  }
};
