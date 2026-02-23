// Mock in-memory database
let users = [];

export const mockDb = {
  // Créer un user
  createUser: async (email, hashedPassword) => {
    const id = Date.now().toString();
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

  // Pour debug : afficher tous les users
  getAllUsers: () => users,

  // Reset pour tests
  reset: () => {
    users = [];
  },
};
