// code for reset schema
const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    isValid:{
        type: Boolean,
        default: true
    },
    acessToken:{
        type: String
    }
},{
    timestamps: true
});

const Reset = mongoose.model('Reset', resetSchema);
module.exports = Reset