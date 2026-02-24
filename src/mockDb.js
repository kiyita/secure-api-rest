/**
 * Mock BDD faites par IA
 */
// Mock in-memory database
let users = [];
let notes = [];

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const mockDb = {
  // Créer un user
  createUser: async (email, hashedPassword) => {
    const id = generateId();
    const user = {
      _id: id,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };
    users.push(user);
    return user;
  },

  // Chercher user par email
  findUserByEmail: async (email) => {
    return users.find((u) => u.email === email.toLowerCase());
  },

  // Chercher user par ID
  findUserById: async (id) => {
    return users.find((u) => u._id === id);
  },

  // Créer une note
  createNote: async (userId, title, content) => {
    const note = {
      _id: generateId(),
      userId,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    notes.push(note);
    return note;
  },

  // Récupérer toutes les notes d'un user
  getNotesByUserId: async (userId) => {
    return notes.filter((n) => n.userId === userId);
  },

  // Récupérer une note spécifique d'un user
  getNoteByIdAndUserId: async (noteId, userId) => {
    return notes.find((n) => n._id === noteId && n.userId === userId) || null;
  },

  // Mettre à jour une note d'un user
  updateNoteByIdAndUserId: async (noteId, userId, title, content) => {
    const note = notes.find((n) => n._id === noteId && n.userId === userId);

    if (!note) {
      return null;
    }

    note.title = title;
    note.content = content;
    note.updatedAt = new Date();

    return note;
  },

  // Supprimer une note d'un user
  deleteNoteByIdAndUserId: async (noteId, userId) => {
    const noteIndex = notes.findIndex((n) => n._id === noteId && n.userId === userId);

    if (noteIndex === -1) {
      return null;
    }

    const [deletedNote] = notes.splice(noteIndex, 1);
    return deletedNote;
  },

  // Pour debug : afficher tous les users
  getAllUsers: () => users,

  // Pour debug : afficher toutes les notes
  getAllNotes: () => notes,

  // Reset pour tests
  reset: () => {
    users = [];
    notes = [];
  },
};
