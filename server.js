var express = require("express");
var app = express();
var path = require("path");

// Set port
app.set("port", process.env.PORT || 8080);
app.use("/", express.static(path.join(__dirname, "public")));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Listener
// =============================================================

app.listen(app.get("port"), function() {console.log("Hollaback on port: "+app.get("port"));});