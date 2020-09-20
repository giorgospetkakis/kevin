class User {
  constructor(_id, name, save_state) {
    this._id = _id;
    this.name = name;
    this.save_state = save_state;
  }
}

module.exports = User;
