import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem';
import loadingGif from './loading.gif';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true  
    };

    this.apiUrl = 'https://5cd47b26b231210014e3d9e2.mockapi.io';

    this.alert = this.alert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    
  }
  
  async componentDidMount() {
    const response = await axios.get(`${this.apiUrl}/todos`);
    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false
      });
    }, 1000);
    
  }
  
  alert(notification) {
    this.setState({
      notification
    });
    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 
    1500);
  }
  handleChange(event) {
    this.setState({
      newTodo: event.target.value
    });
  }
  async addTodo(event) {
    const response = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newTodo
    });
    const todos = this.state.todos;
    todos.push(response.data);
    
    this.setState({
      todos: todos,
      newTodo: ''
    });

    this.alert('Todo added successfully');
  }
  async deleteTodo(index) {
    const todo = this.state.todos[index];
    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
    const todos = this.state.todos;
    delete todos[index];
    this.setState({ todos });
    this.alert('Todo deleted successfully');
  }
  editTodo(index) {
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });
  }
  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex];
    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newTodo
    });
    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;
    this.setState({ 
      todos, 
      editing: false, 
      editingIndex: null, 
      newTodo: '' 
    });
    this.alert('Todo updated successfully');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h3 className="App-title">CRUD React</h3>
        </header>

        <div className="container">
          {
            this.state.notification &&
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          }
          
          <input 
            type="text"
            name="todo"
            className="my-4 form-control"
            placeholder="Add a new todo"
            onChange={this.handleChange}
            value={this.state.newTodo} //two way binding
          />

          <button 
            className="btn-success mb-3 form-control"
            onClick={this.state.editing ? this.updateTodo : this.addTodo}
            disabled={this.state.newTodo.length === 0}
          >
            {this.state.editing ? 'Update todo' : 'Add todo'}
          </button>
          {
            this.state.loading &&
            <img src={loadingGif} alt=""/>
          }
          {
            (!this.state.editing || this.state.loading) && 
            <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return <ListItem
                  key={item.id}
                  item={item}
                  editTodo={() => { this.editTodo(index); }}
                  deleteTodo={() => { this.deleteTodo(index); }}
              />;
              })}
            </ul>
          }
      </div>
    
      </div>
    );
  }
}

export default App;
