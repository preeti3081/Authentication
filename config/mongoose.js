const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authentication',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting Mongodb"));
db.once('open',function(){
    console.log('Connected to Database::Mongodb');
}); 

module.exports = db;
