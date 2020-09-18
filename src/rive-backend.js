const RiveScript = require("rivescript");

// Initialize Rivescript
var rive = new RiveScript({ utf8: true });
var riveDir = "./src/rivescript/";

rive
  .loadFile(riveDir + "kevin.rive")
  .then(loading_done)
  .catch(loading_error);

// Rivescript loading done
function loading_done() {
  console.log("Rivescript backend has finished loading.");
  rive.sortReplies();
}

// Rivescript loading failed
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

module.exports = {
    getRiveBackend: function ()
    {
        return rive;
    }
  };
