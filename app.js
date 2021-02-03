const express = require('express');
const uuid = require('uuid');
const fs = require('fs');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:false}))



app.get('/', (req, res) => {
    res.render('index', { users: [] })
})

app.get('/form', (req, res) => {
    res.render('form')
})

app.get('/users', (req, res) => {
    res.render('users')
})

app.get('/lookup', (req, res) => {
    res.render('lookup')
})

app.post('/users', (req, res) => {
    console.log(req.body)
    let user = {};
    user.id = uuid.v4();
    user.username = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;
    // fs.writeFileSync('./users.json', JSON.stringify(user));
    res.render('users')
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})