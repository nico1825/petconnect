// classes/UserClass.js
const User = require('../models/User');

class UserClass {
  async register(data) {
    data.password = String(data.password);
    const exists = await User.findOne({ email: data.email });
    if (exists) throw new Error('User already exists');

    const user = new User(data);
    await user.save();
    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || user.password !== String(password)) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  async updateProfile(userId, updates) {
    return await User.findByIdAndUpdate(userId, updates, { new: true });
  }
}

module.exports = UserClass;
