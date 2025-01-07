const admin = require("firebase-admin");
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email;
    req.body.uid = uid;
    req.body.email = email;
    next();
  } catch(err){
console.log("🚀 ~ err:", err?.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticate;
