import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'
import logo from './logo.svg';
import './App.css';

injectTapEventPlugin()

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Content />
        <Material />
      </div>
    );
  }
}

const print = () => {
  console.log('tekittooooo')
}

const Material = () => (
  <MuiThemeProvider>
    <div>
      <RaisedButton label="Default" onTouchTap={print}/>
      <TextField hintText="Hint Text" />
    </div>
  </MuiThemeProvider>
)

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
    this.state = {data: ''};
  }

  loadCountFromServer = () => {
    fetch('/load')
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then(data => this.setState({data: data}));
  }

  moveTask = (body) => {
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
      .then(data => this.setState({data: data}));
  }

  componentWillMount() {
    this.loadCountFromServer()
  }

  componentDidMount() {
    setInterval(this.loadCountFromServer, 10000)
  }

  render() {
    return (
      <div className="content" id="content">
        <TaskList type="todo" taskList={this.state.data.todo_list}
                  onMoveTask={this.moveTask}/>
        <TaskList type="done" taskList={this.state.data.done_list}
                  onMoveTask={this.moveTask}/>
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

  render() {
    let taskNodes = undefined
    if (this.props.taskList !== undefined) {
      taskNodes = this.props.taskList.map(task => {
        const post_body = {
          id: task.id,
          type: this.props.type
        }
        return (
          <li key={task.id}>
            {task.title}
            <button type="button" className="move-button"
                    onClick={() => this.props.onMoveTask(post_body)}>
              move
            </button>
          </li>
        )
      })
    }
    return (
      <div className={this.className + " taskList"}>
        <h2>{this.title}</h2>
        <ul>
          <li><button type="button" className="add-button">＋</button></li>
          {taskNodes}
          <li><button type="button" className="add-button">＋</button></li>
        </ul>
      </div>
    )
  }
}

export default App;
