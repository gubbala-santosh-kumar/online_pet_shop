// Assigning all the packages
require('dotenv').config();

const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const admin = require('firebase-admin');

const bcrypt = require('bcrypt');

const fs = require('fs');

const app = express();

const PORT = 4000;

//body Parser

app.use(bodyParser.json());

//Setting THE EJS Engine

app.set('view engine','ejs');

//Getting dynamic paths

app.use('/static',express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Firebase Generated Key.

const serviceAccountPath = process.env.FIREBASE_KEY_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath));

 admin.initializeApp({
     credential:admin.credential.cert(serviceAccount)
 });

 const db = admin.firestore();

//Insertion Into Database

  app.post('/signup', async (req,res)=>{
      const {name, email, password} = req.body;
      console.log(req.body);
      const userDoc = await db.collection('petshop').doc(email).get();
      if(userDoc.exists){
          res.send('email already exists');
      }
      const hashedPassword = await bcrypt.hash(password,5);
      await db.collection('petshop').doc(email).set({
          name,
          email,
          password: hashedPassword
      });
      res.render('signin');
  });


//Getting Details For Checking Authentication For the Login Process.

  app.post('/signin', async (req,res)=>{
      const { email, password} = req.body;
      console.log(req.body);
      const userDoc = await db.collection('petshop').doc(email).get();
      if(!userDoc.exists){
          res.send('Un Authorized Accsess');
      }
      const isValidPassword = await bcrypt.compare(password,userDoc.data().password);
      if(!isValidPassword){
          res.send("Invalid Password");
      }
      res.render('home');
  })



// Routes

app.get('/',(req,res)=>{
    res.render('dashboard');
});

app.get('/dashboard',(req,res)=>{
    res.render('dashboard');
});

app.get('/home',(req,res)=>{
    res.render('home');
});

app.get('/signin',(req,res)=>{
    res.render('signin');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.get('/rating',(req,res)=>{
    res.render('rating');
});

app.get('/profile',(req,res)=>{
    res.render('profile');
});

app.get('/decision',(req,res)=>{
    res.render('decision')
})

app.get('/my_orders',(req,res)=>{
    res.render('my_orders')
})

app.get('/contact',(req,res)=>{
    res.render('contact')
})

//decision routes

app.get('/decision/breeds',(req,res)=>{
    res.render('breeds')
})

app.get('/decision/food',(req,res)=>{
    res.render('food')
})

app.get('/decision/toys',(req,res)=>{
    res.render('toys')
})

app.get('/decision/shelter',(req,res)=>{
    res.render('shelter')
})

app.get('/decision/tags',(req,res)=>{
    res.render('tags')
})

app.get('/decision/clothing',(req,res)=>{
    res.render('clothing')
})

//cart -------------------------------------

let cart = [];

// Route to render cart page
app.get('/cart', (req, res) => {
    res.render('cart', { cart });
});

// Route to handle adding to cart
app.post('/add-to-cart', (req, res) => {
    const { id, name, description, price } = req.body;
    cart.unshift({ id, name, description, price });
    res.sendStatus(200);
});

// Route to handle removing from cart
app.post('/remove-from-cart', (req, res) => {
    const { id } = req.body;
    cart = cart.filter(item => item.id !== id);
    res.sendStatus(200);
});


//---------------------------------------------------



//Listening Port 

app.listen(PORT,()=>{
    console.log(`Port Is Listening http://localhost:${PORT}`);
});