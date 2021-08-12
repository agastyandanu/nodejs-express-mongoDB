const { ObjectID } = require('bson');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/node-basic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});









//membuat schema/model
// const Contacts = mongoose.model('tb_contact', {
//     nama: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     nohp: {
//         type: String,
//         required: true
//     }
// });

// const data1 = new Contacts({
//     nama: "Siapa Yahh",
//     email: "siapa@gmail.com",
//     nohp: "081234567777"
// });

// data1
//     .save()
//     .then((result) => {
//         console.log(result);
//     });

//delete 1 data
// Contacts.deleteOne(
//     {
//         _id: ObjectID('611252f09344051eecdaa97c')
//     }
// )
// .then((result) => {
//     console.log(result);
// })
// .catch((error) => {
//     console.log(error);
// });
