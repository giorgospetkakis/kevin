const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const User = require("./user.js");
const rive = require("./rive-backend");

// Connection URL
const url =
  "mongodb+srv://admin:2JAYeNCRAtEzOJbo@cluster0.nfckk.gcp.mongodb.net/chatbot?retryWrites=true&w=majority";

// Database Name
const dbName = "chatbot";

const save_progress = function (db, user, callback) {
    // Get the documents collection
    const collection = db.collection("users");
    // Insert some documents
    collection.updateOne({ _id: user._id },
        { $set: user },
        { upsert: true });
  };

const insert_user = function (db, user, callback) {
  // Get the documents collection
  const collection = db.collection("users");
  // Insert some documents
  collection.insertOne(user, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);

    console.log("Added" + user + "to the users collection");
    callback(result);
  });
};

const try_get_user = function (db, id) {
  // Get the documents collection
  const collection = db.collection("users");
  // Find a document
  collection
    .findOne({ _id: id })
    .then(function (result) {
      var entries = Object.entries(result).slice(1);
      entries.forEach((element) => {
        var input_string = "userinfo " + element[0] + " " + element[1];
        rive.getRiveBackend().reply(id, input_string);
      });

      rive.getRiveBackend().reply(id, "userinfo EOF");
    })
    .catch(function () {
      rive.getRiveBackend().reply(id, "userinfo NOTFOUND");
    });
};

module.exports = {
  add_user: (user) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      // console.log("Connected successfully to MongoDB server");

      const db = client.db(dbName);

      insert_user(db, user, function () {
        client.close();
      });
    });
  },

  save: (user) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      // console.log("Connected successfully to MongoDB server");

      const db = client.db(dbName);

      save_progress(db, user, function () {
        client.close();
      });
    });
  },

  get_user: (id) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      // console.log("Connected successfully to MongoDB server");

      const db = client.db(dbName);

      try_get_user(db, id, function (result) {
        client.close();
      });
    });
  },
};
