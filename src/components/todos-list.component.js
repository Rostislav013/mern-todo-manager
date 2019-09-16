import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


//implementing Todo component
//props.todo= currentTodo?
const Todo = props => (
    <tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
            
        </td>
        
    </tr>
)

export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todos: []
        };
    }
    // to get data from database
    componentDidMount() {
        axios.get('http://localhost:3001/todos/')
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    // 2nd step - implementation of todoList method to TodosList
    // we only need to implement Todo component. Go up to see
    todoList() {
        return this.state.todos.map(function(currentTodo, i){
            
            return <Todo todo={currentTodo} key={i} />;
            
        })
        
    }

    render() {
        
         return (
            <div>
            <h3>Todos List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }} >
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Responsible</th>
                        <th>Priority</th>
                        <th>Action</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    { this.todoList() }
                </tbody>
            </table>
        </div>
         )
}}