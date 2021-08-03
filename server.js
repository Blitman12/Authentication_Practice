const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json())

const users = []

app.get('/users', (req,res) => {
    res.json(users)
})


app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = {name: req.body.name, password: hashedPassword}
        users.push(user)
    } catch (error) {
        console.log(error)
    }
})


app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name == req.body.name)
    if (user == null) {
        return res.sendStatus(400).send("cannot find user")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send("not allowed")
        }
    } catch {
        res.status(500).send()
    }
})

app.listen(3000)