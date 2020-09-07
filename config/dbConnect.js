var Sequelize = require('sequelize');

const dbConnect = new Sequelize('qbfm-velect-db', 'root', 'rootroot', {
 dialect: 'mysql',
 host: 'localhost'
});

module.exports = dbConnect;