const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
require('dotenv').config();
let Todo = require('./models/todo.model'); // Important line 27, 38 for ex
const todoRoutes = express.Router();

app.use(cors());

app.use(bodyParser.json()); // DIDNT WORK 
app.use(bodyParser.urlencoded({extended: false})); //ALL STARTED TO WORK AFTER THAT
//app.use(express.bodyParser());  NOT IN USE ANYMORE

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})



app.use('/todos', todoRoutes);

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function(req, res) {
    //console.log(req.body);
    let todo = new Todo(req.body);
    console.log(req.body.name);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
   
        console.log(todo);
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/:id').delete(function(req, res) {
     Todo.findOneAndDelete({ _id: req.params.id }, (err, event) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!event) {
            return res
                .status(404)
                .json({ success: false, error: `Todo not found` })
        }

        return res.status(200).json({ success: true, data: event })
    }).catch(err => console.log(err))
   
});




app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});