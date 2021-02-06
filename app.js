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

app.get('/editUsers', (req, res) => {
    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const usersObj = JSON.parse(data);

        res.render('editUsers', { users: usersObj.users })
    })
})

app.post('/users', (req, res) => {
    let user = {};
    user.id = uuid.v4();
    user.username = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;

    usersFile.users.push(user)
    const userData = JSON.stringify(usersFile, null, 2)
    fs.writeFile('./users.json', userData, (err) => {
        if (err) throw err;
    })

    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const usersObj = JSON.parse(data);

        res.render('users', { users: usersObj.users })
    })
})

app.post('/updateUsers', (req, res) => {
    let postUser = {};
    postUser.id = req.body.id;
    postUser.username = req.body.username;
    postUser.email = req.body.email;
    postUser.age = req.body.age;

    fs.readFile('./users.json', 'utf8', (err, data) => {
        if (err) throw err;

        const usersObj = JSON.parse(data);
        const usersArr = usersObj.users;

        var hasId = usersArr.some((obj) => { // Checks if the POST request has the same id as JSON file
            return obj.id == postUser.id;
        })

        if (hasId) {
            const updatedData = {
                id: postUser.id,
                username: postUser.username,
                email: postUser.email,
                age: postUser.age,
            }

            for (let arr of usersArr) {
                if (arr.id == postUser.id) {
                    let currentIndex = usersArr.indexOf(arr);

                    // checks to see if fields were empty
                    if (updatedData.username == '') {
                        const usernameReplacement = arr.username;
                        updatedData.username = usernameReplacement;
                    }
                    if (updatedData.email == '') {
                        const emailReplacement = arr.email;
                        updatedData.email = emailReplacement;
                    }
                    if (updatedData.age == '') {
                        const ageReplacement = arr.age;
                        updatedData.age = ageReplacement;
                    }

                    usersArr.splice(currentIndex, 1, updatedData);
                }
            }

            const newUsers = JSON.stringify(usersArr, null, 2);
            fs.writeFile('./users.json', `{"users": ${newUsers}}`, (err) => {
                if (err) throw err;
            })
        }
        res.render('users', { users: usersArr })
    })
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})