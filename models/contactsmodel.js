const mongoose = require('mongoose');

const Contacts = mongoose.model('tb_contact', {
    nama: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    nohp: {
        type: String,
        required: true
    }
});

module.exports = Contacts;