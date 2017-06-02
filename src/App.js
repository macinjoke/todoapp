import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import logo from './logo.svg'
import './App.css'

injectTapEventPlugin()

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Content />
      </div>
    )
  }
}

class Header extends Component {
  render() {
    return (
      <header className="header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2 id="app-title">TODO App</h2>
      </header>
    )
  }
}

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '', isPressedTodoAddButton: false, isPressedDoneAddButton: false
    }
  }

  loadCountFromServer = () => {
    fetch('/load')
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then(data => this.setState({data: data}))
  }

  moveTask = body => {
    fetch('/move', {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then(data => this.setState({data: data}))
  }

  deleteTask = body => {
    fetch('/delete', {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then(data => this.setState({data: data}))
  }

  addTask = body => {
    fetch('/add', {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then(data => this.setState({data: data}))
  }

  toggleState = (type) => {
    if (type === 'todo') {
      if (this.state.isPressedTodoAddButton) {
        this.setState({isPressedTodoAddButton: false})
      } else {
        this.setState({isPressedTodoAddButton: true})
      }
    } else if (type === 'done') {
      if (this.state.isPressedDoneAddButton) {
        this.setState({isPressedDoneAddButton: false})
      } else {
        this.setState({isPressedDoneAddButton: true})
      }
    }
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
        <TaskList type="todo" taskList={this.state.data.todo_list}
                  onMoveTask={this.moveTask}
                  onDeleteTask={this.deleteTask}
                  isPressed={this.state.isPressedTodoAddButton}
                  onPressedAddButton={this.toggleState}
                  addTask={this.addTask}
                  />
        <TaskList type="done" taskList={this.state.data.done_list}
                  onMoveTask={this.moveTask}
                  onDeleteTask={this.deleteTask}
                  isPressed={this.state.isPressedDoneAddButton}
                  onPressedAddButton={this.toggleState}
                  addTask={this.addTask}
                  />
      </div>
    )
  }
}

class TaskList extends Component {
  constructor(props){
    super(props)
    switch (props.type) {
      case 'todo':
        this.className = 'todoList'
        this.title = 'TODO'
        break
      case 'done':
        this.className = 'doneList'
        this.title = 'DONE'
        break
      default:
        break
    }
  }

  nl2br = text => {
    const regex = /(\n)/g
    return text.split(regex).map(line => {
      return line.match(regex) ? <br /> : line
    })
  }

  render() {
    let taskNodes = undefined
    if (this.props.taskList !== undefined) {
      taskNodes = this.props.taskList.map(task => {
        const post_body = {
          id: task.id,
          type: this.props.type
        }
        return (
          <li className="task" key={task.id}>
            <button type="button" className="delete-button"
                    onClick={() => this.props.onDeleteTask(post_body)}>
              ×
            </button>
            <button className="task-title">
                    {this.nl2br(task.title)}</button>
            <button type="button" className="move-button"
                    onClick={() => this.props.onMoveTask(post_body)}>
              move
            </button>
          </li>
        )
      })
    }
    let addedTask
    if (this.props.isPressed) {
      addedTask = <AddedTask
        type={this.props.type}
        onPressedAddButton={this.props.onPressedAddButton.bind(this, this.props.type)}
        addTask={this.props.addTask}
      />
    }
    return (
      <div className={this.className + " taskList"}>
        <h2>{this.title}</h2>
        <ul>
          <li id="add-button-li">
            <button type="button" className="add-button"
            onClick={this.props.onPressedAddButton.bind(this, this.props.type)}>＋
            </button>
          </li>
          {addedTask}
          {taskNodes}
        </ul>
      </div>
    )
  }
}

class AddedTask extends Component {
  constructor(props) {
    super(props)
    this.state = {text: ""}
  }

  componentDidMount() {
    this.refs.task.focus()
  }

  handleTouchTap = () => {
    let text = this.refs.task.getValue()
    this.setState({text: ""})
    console.log(text)
    this.props.onPressedAddButton()
    console.log({type: this.props.type, text: text})
    this.props.addTask({type: this.props.type, text: text})
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <TextField ref="task" value={this.state.text} onChange={this.handleChange}
            hintText="Write your task" multiLine={true} rows={1}
          />
          <RaisedButton
            label="Add" onTouchTap={this.handleTouchTap}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
