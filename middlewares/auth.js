const admin = require("../firebase");

const authCheck = async (req, res, next) => {
  // console.log(req.headers); // token
  try {
    const decodedIdToken = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    // console.log("FIREBASE USER IN AUTHCHECK", decodedIdToken);
    console.log(decodedIdToken.picture);
    req.user = decodedIdToken;
    next();
  } catch (err) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

module.exports = authCheck;
