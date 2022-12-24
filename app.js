const express = require("express");
const bodyParser = require('body-parser')

const app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json())
const routes = express.Router();

app.use(express.static(__dirname + "/public"));

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;

const url = 'mongodb://localhost:27017';

const client = new MongoClient(url, { useUnifiedTopology: true});
const db = client.db('medical');
let collection;

(async () => {
     try {
        await client.connect();
        console.log('успешно сеодинено с бд');
    } catch(err) {
        return console.log(err);
    } 
})();

// залогиниться
app.post('/api/login', async(req, res) => {
    collection = db.collection('users');
    try{
        const user = await collection.find({ login: req.body.login }).toArray();
        res.send(user);
    }
    catch(err){
        res.sendStatus(500);
        res.send('login error');
    }  
});

//получить все услуги
app.get("/api/services", (req, res) => {
    try{
        collection = db.collection('services');
        collection.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
          });
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

//получение услуги по id
app.get("/api/services/:id", async (req, res) => {
    collection = db.collection('services');
    try {
        const post = await collection.find({ id: Number(req.params.id) }).toArray();
        res.send(post[0]);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// добавление пациента
app.post("/api/addPatient", async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    collection = db.collection('patients');
    collection.insertOne({ name: req.body.name, surname: req.body.surname }, function (err, info) {
        const posts = collection.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
          });
  })
});

// получить авторизованных пользователей (Исп-ся, но нелогично)
app.get("/api/users", async(req, res) => {
    collection = db.collection('users');
    console.log('col', collection)
    try{
        const users = await collection.find({}).toArray();
        console.log('users', users)
        res.send(users);
    }
    catch(err){
        res.sendStatus(500);
    }  
});

const port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log(`Сервер бэка азпущен с портом ${port}`);
});
