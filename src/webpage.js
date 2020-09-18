var express = require("express");
var rive = require("./rive-backend");

var app = express();
app.set("port", process.env.PORT || 5000);

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "index.htm");
});

app.get("/process_get", function (req, res) {
  // Prepare output in JSON format
  response = {
    user_message: req.query.user_message,
  };

  handleWebMessage(response.user_message, res);
});

// Query rive to respond to messages
function handleWebMessage(message, res) {
  rive
    .getRiveBackend()
    .reply("web-user", message)
    .then(function (reply) {
      res.send(reply);
      res.sendFile(__dirname + "/" + "index.htm");
    });
}

// Fix the Heroku $PORT error
app
  .get("/", function (request, response) {
    var result = "App is running";
    response.send(result);
  })
  .listen(app.get("port"), function () {
    console.log(
      "App is running, server is listening on port ",
      app.get("port")
    );
  });

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.post("/process_get", (req, res) => {
  console.log(req.body);
});
