const User = require('../models/User');
const bcrypt = require('bcryptjs/dist/bcrypt');


module.exports = class UserService {
  static async create({ username, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    return User.insert({
      username,
      passwordHash,
    });
  }
};
