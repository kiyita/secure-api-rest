import User from './models/User.js';

export const mongooseDb = {
  createUser: async (email, hashedPassword) => {
    return User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
  },

  findUserByEmail: async (email) => {
    return User.findOne({ email: email.toLowerCase() }).exec();
  },

  findUserById: async (id) => {
    return User.findById(id).exec();
  },
};