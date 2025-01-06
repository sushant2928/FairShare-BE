const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const serviceAccount = require("../fairshare000-firebase-adminsdk-thpqm-8f79591468.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
