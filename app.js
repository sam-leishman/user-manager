const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const usersFile = require('./users.json');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))



app.get('/', (req, res) => {
    res.render('index', { users: [] })
})

app.get('/form', (req, res) => {
    res.render('form')
})

app.get('/users', (req, res) => {
    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const usersObj = JSON.parse(data);

        res.render('users', { users: usersObj.users })
    })
})

app.post('/users', (req, res) => {
    let user = {};
    user.id = uuid.v4();
    user.username = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;

    usersFile.users.push(user)
    const userData = JSON.stringify(usersFile)
    fs.writeFile('./users.json', userData, (err) => {
        if (err) throw err;
    })

    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const usersObj = JSON.parse(data);

        res.render('users', { users: usersObj.users })
    })
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})