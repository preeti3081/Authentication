// code for create a queue for the mail

const kue = require('kue');
const queue = kue.createQueue();

module.exports = queue