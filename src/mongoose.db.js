import User from './models/User.js';
import Note from './models/Note.js';

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

  createNote: async (userId, title, content) => {
    return Note.create({
      userId,
      title,
      content,
    });
  },

  getNotesByUserId: async (userId) => {
    return Note.find({ userId }).exec();
  },


  getNoteByIdAndUserId: async (noteId, userId) => {
    return Note.findOne({ _id: noteId, userId }).exec();
  },

  updateNoteByIdAndUserId: async (noteId, userId, title, content) => {
    return Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content },
      { new: true }
    ).exec();
  },


  deleteNoteByIdAndUserId: async (noteId, userId) => {
    return Note.findOneAndDelete({ _id: noteId, userId }).exec();
  },
};