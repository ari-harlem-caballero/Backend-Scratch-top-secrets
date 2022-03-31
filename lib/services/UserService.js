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

  static async signIn({ username, password }) {
    const user = await User.getByUsername(username);

    if(!user) throw new Error('invalid input');

    const passwordCheck = bcrypt.compareSync(password, user.passwordHash);

    if(!passwordCheck) throw new Error('invalid imput');

    return user;
  }
};
