
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./database');
require('dotenv').config();



app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

db.createTables();

app.get('/', (req, res) => {
  res.send("Hello");
})

app.get('/users',async (req,res) => {
  const users = await db.getAllUsers();
  res.json(users);
})

app.post('/add_user', (req, res) => {
  const { name, email ,username ,password} = req.body;
  try {
    db.createUser(name, email,username, password);
   
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/add_sg', (req,res) => {
  const { user_id, course_id } = req.body;
  try {
    db.createSuggestion(user_id,course_id);
    res.sendStatus(201);
  } catch(error) {
    console.error(error);
    res.sendStatus(500);
  }
})

app.post('/add_tag',(req,res) =>{
  const {title} = req.body;
  try {
    db.createTag(title);
    res.sendStatus(201);
  } catch(error) {
    console.error(error);
    res.sendStatus(500);
  }
})

app.post('/add_course', (req,res) =>{
  const {user_id,title,description} = req.body;
  try {
    db.createCourse(user_id,title,description);
    res.sendStatus(201);
  } catch(error) {
    console.error(error);
    res.sendStatus(500);
  }
})