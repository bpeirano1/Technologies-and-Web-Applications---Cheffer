'use strict';

const bcrypt = require('bcrypt');
const PASSWORD_SALT = 10; // veces que se encripta la constraseña

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = await bcrypt.hash('adminpassword', PASSWORD_SALT);
    const password =  process.env.SEED_SUPERUSER_PASSWORD || 'defaultpassword';
    return queryInterface.bulkInsert('admins', [{
          username: 'admin',
          email: 'admin@cheffer.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', { email: 'admin@cheffer.com' }, {});
  }
};
