const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Find a user by email
 * @param {string} email - The email to search for
 * @returns {Promise<Object|null>} The user object or null if not found
 */
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

/**
 * Find a user by ID
 * @param {string} id - The user ID to search for
 * @returns {Promise<Object|null>} The user object or null if not found
 */
const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

/**
 * Create a new user
 * @param {Object} userData - User data containing email, password, and optional displayName
 * @returns {Promise<Object>} The created user object
 */
const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData
  });
};

/**
 * Update a user by ID
 * @param {string} id - The user ID to update
 * @param {Object} userData - The user data to update
 * @returns {Promise<Object>} The updated user object
 */
const updateUser = async (id, userData) => {
  return await prisma.user.update({
    where: { id },
    data: userData
  });
};

/**
 * Delete a user by ID
 * @param {string} id - The user ID to delete
 * @returns {Promise<Object>} The deleted user object
 */
const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id }
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser
};
