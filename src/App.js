// @flow
import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import logo from './logo.svg'
import './App.css'

injectTapEventPlugin()

const request = async (endpoint, opts = {}) => {
  const res = await fetch(endpoint, opts)
  const data = await res.json()
  return data
}

const App = () => (
  <div className="App">
    <Header />
    <Content />
  </div>
)

const Header = () => (
  <header className="header">
    <img src={logo} className="App-logo" alt="logo" />
    <h2 id="app-title">TODO App</h2>
  </header>
)

class Content extends Component {
  state = {
    data: '',
    isPressedTodo: false,
    isPressedDone: false,
  }

  post = async (endpoint, body) => {
    const opts = { method: 'POST', body: JSON.stringify(body) }
    const data = await request(endpoint, opts)
    this.setState({ data })
  }

  moveTask = body => this.post('/move', body)
  deleteTask = body => this.post('/delete', body)
  addTask = body => this.post('/add', body)

  loadCountFromServer = async () => {
    const data = await request('/load')
    this.setState({ data })
  }

  toggleTodo = () => {
    this.setState({ isPressedTodo: !this.state.isPressedTodo })
  }

  toggleDone = () => {
    this.setState({ isPressedDone: !this.state.isPressedDone })
  }

  componentWillMount() {
    this.loadCountFromServer()
  }

  componentDidMount() {
    setInterval(this.loadCountFromServer, 3000)
  }

  render() {
    return (
      <div className="content" id="content">
        <TaskList
          type="todo"
          title="TODO"
          className="todoList"
          taskList={this.state.data.todo_list}
          onMoveTask={this.moveTask}
          onDeleteTask={this.deleteTask}
          isPressed={this.state.isPressedTodo}
          onPressedAddButton={this.toggleTodo}
          addTask={this.addTask}
        />
        <TaskList
          type="done"
          title="DONE"
          className="doneList"
          taskList={this.state.data.done_list}
          onMoveTask={this.moveTask}
          onDeleteTask={this.deleteTask}
          isPressed={this.state.isPressedDone}
          onPressedAddButton={this.toggleDone}
          addTask={this.addTask}
        />
      </div>
    )
  }
}

class TaskList extends Component {
  render() {
    const {
      taskList,
      onDeleteTask,
      onMoveTask,
      isPressed,
      title,
      className,
      onPressedAddButton,
      type,
      addTask,
    } = this.props

    return (
      <div className={className + ' taskList'}>
        <h2>{title}</h2>
        <ul>
          <li id="add-button-li">
            <button
              type="button"
              className="add-button"
              onClick={() => onPressedAddButton(type)}
            >
              ＋
            </button>
          </li>
          {isPressed &&
            <AddedTask
              type={type}
              onPressedAddButton={() => onPressedAddButton(type)}
              addTask={addTask}
            />}
          {taskList &&
            taskList.map((task, i) => (
              <Task
                task={task}
                key={i}
                onDeleteTask={onDeleteTask}
                onMoveTask={onMoveTask}
                post_body={{ id: task.id, type }}
              />
            ))}
        </ul>
      </div>
    )
  }
}

const Task = ({ task, onDeleteTask, onMoveTask, post_body }) => (
  <li className="task">
    <button
      type="button"
      className="delete-button"
      onClick={() => onDeleteTask(post_body)}
    >
      ×
    </button>
    <button className="task-title">
      {task.title.split(/(\n)/g).map(line => {
        return line.match(/(\n)/g) ? <br /> : line
      })}
    </button>
    <button
      type="button"
      className="move-button"
      onClick={() => onMoveTask(post_body)}
    >
      move
    </button>
  </li>
)

class AddedTask extends Component {
  state = { text: '' }

  componentDidMount() {
    this.refs.task.focus()
  }

  handleTouchTap = () => {
    const { type, addTask, onPressedAddButton } = this.props
    let text = this.refs.task.getValue()

    this.setState({ text: '' })
    onPressedAddButton()
    addTask({ type, text })
  }

  handleChange = event => {
    if (event.target.value) {
      this.setState({ text: event.target.value })
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <TextField
            ref="task"
            value={this.state.text}
            onChange={this.handleChange}
            hintText="Write your task"
            multiLine={true}
            rows={1}
          />
          <RaisedButton label="Add" onTouchTap={this.handleTouchTap} />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
