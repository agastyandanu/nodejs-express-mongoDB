const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
const { ObjectID } = require('bson');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

//koneksi
require('./utils/db');
const Contacts = require('./models/contactsmodel');
const { deleteOne } = require('./models/contactsmodel');

//setup method-override
app.use(methodOverride('_method'));

//setup EJS
app.set('view engine', 'ejs'); //gunakan EJS
app.use(expressLayouts); // third-party middleware
app.use(express.static('public')); //built-in middleware - setting static public folder agar dapat diakses
app.use(express.urlencoded( {extended: true} )); // middleware untuk parsing/diuraikan data dari form

//setup flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 3000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());


//home page
app.get('/', (req, res) => {
    let dataUser = [
        {
            nama: 'Danu Agastyan',
            email: 'danoe@gmail.com',
            nohp: '081234567890'
        },
    ]
    res.render('index', {
    layout: 'layouts/main-layouts',
    title: 'Home | Express JS',
    name: 'Danu Agastyan',
    user: dataUser
    });
});

//about page
app.get('/about', (req, res) => {
    res.render('about', {
      layout: 'layouts/main-layouts',
      title: 'About | Express JS'
    });
});

//contact page
app.get('/contact', async (req, res) => {
    const result = await Contacts.find();
    res.render('contact',
    {
        layout: 'layouts/main-layouts',
        title: 'Contact | Express JS',
        contact: result,
        msg: req.flash('message')
    });
});

//contact add
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
      layout: 'layouts/main-layouts',
      title: 'Add Contact Page'
    });
});

//add process
app.post('/contact',
[
    body('nama').custom(async (value) => {
        const duplikat = await Contacts.findOne({ nama: value });
        if(duplikat) {
        throw new Error('Name Already Exists, Use Another Name');  
        }
        return true;
    }),
    check('nohp', 'Phone Number Is Not Valid - Indonesia Only').isMobilePhone('id-ID'),
    check('nohp', 'Character Number Is Not Valid').isLength({ min: 10 }),
    check('email', 'Email Is Not Valid').isEmail()
],
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-contact', {
        layout: 'layouts/main-layouts',
        title: 'Add Contact Page',
        comments: errors.array(),
        });
    } else {
        Contacts.insertMany(req.body, (error, result) => {
        req.flash('message', 'Data Successfully Added!');
        res.redirect('/contact');
        });     
    }    
});


//contact edit
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contacts.findOne({ nama: req.params.nama });  //ambil data contact
    res.render('edit-contact', {
      layout: 'layouts/main-layouts',
      title: 'Edit Contact Page',
      dataContact: contact //kirimkan data contact ke form edit
    });
});

//update process
app.put('/contact',
[
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contacts.findOne({ nama: value });
        if(value !== req.body.oldnama && duplikat) {
            throw new Error('Name Already Exists, Use Another Name');  
        }
        return true;
    }),
    check('nohp', 'Phone Number Is Not Valid - Indonesia Only').isMobilePhone('id-ID'),
    check('nohp', 'Character Number Is Not Valid').isLength({ min: 10 }),
    check('email', 'Email Is Not Valid').isEmail()
],
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
        layout: 'layouts/main-layouts',
        title: 'Edit Contact Page',
        comments: errors.array(),
        dataContact: req.body,
        });
    } else {
        Contacts.updateOne(
            { _id: req.body.id },
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp,
                }
            }
        )
        .then((result) => {
            req.flash('message', 'Data Successfully Updated!');
            res.redirect('/contact');
        })
        .catch((error) => {
            req.flash('message', 'Data Failed To Updated!');
            res.redirect('/contact');
        });
        
    }    
});


//delete contact
app.delete('/contact', (req, res) => {
    // res.send(req.body.nama)
    Contacts.deleteOne({ _id: req.body.id })
    .then((result) => {
        req.flash('message', 'Data Successfully Deleted!');
        res.redirect('/contact');
    })
    .catch((error) => {
        req.flash('message', 'Data Failed To Delete!');
        res.redirect('/contact');
    });
});




//detail contact
//letakkan di paling bawah agar saat ada params lain tidak mengarah ke halaman detail
app.get('/contact/:nama', async (req, res) => {
    const detailContacts = await Contacts.findOne({ nama: req.params.nama });
    res.render('detail', {
      layout: 'layouts/main-layouts',
      title: 'Detail Contact',
      contact: detailContacts
    });
});



app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at http::localhost:${port}`);
});