//npm install express body-parser cors mongoose 

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const port = 4000;

let Todo = require('./models/todo.model')

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27018/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log('Connected to the MongoDB...');
})

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if(err) console.log(err);
        res.json(todos);
    })
})

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    })
})

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added succesfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        })
})

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if(!todo) {
            res.status(404).send('todo not found!');
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    })
});

app.use('/todos', todoRoutes);

app.listen(port, function() {
    console.log("Listening on port " + port + "...");
});