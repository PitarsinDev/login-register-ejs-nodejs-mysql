const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_register_ejs'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) throw err;
  
      if (results.length > 0) {
        const user = results[0];
        bcrypt.compare(password, user.password, (err, passwordMatch) => {
          if (err) throw err;
  
          if (passwordMatch) {
            res.redirect('/home');
          } else {
            res.render('index.ejs', { error: 'Invalid password' });
          }
        });
      } else {
        res.render('index.ejs', { error: 'User not found' });
      }
    });
});
  
app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
  
      connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
        if (err) throw err;
  
        res.redirect('/home');
      });
    });
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});
app.get('/register', (req, res) => {
    res.render('register.ejs');
});
app.get('/home', (req, res) => {
    res.render('home.ejs');
});

app.listen(port, () => {
    console.log('Server is running');
});