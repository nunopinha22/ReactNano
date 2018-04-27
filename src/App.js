import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

const user = {
  id: 1,
  Name: 'Nunex'
};

// eslint-disable-next-line
const userService = {
  getUserName: (user) => {
    return user.Name + 'Surname'
  }
}

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
    }

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  onSearchChange = (event) => {
    const updatedValue = event.target.value;
    this.setState({ searchTerm: updatedValue })
  }

  onDismiss = (id) => {
    const updateList = this.state.list.filter(x => id !== x.objectID);
    this.setState({ list: updateList });
  }

  isSearched(searchTerm) {
    return function (item) {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }

    // const isSearched = searchTerm => item =>
    //   item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }

  render() {
    console.log("Entrei no render()");
    const helloWorld = 'Welcome to React learn.';
    const { searchTerm, list } = this.state
    return (
      <div className="App">
        <h1>{helloWorld}</h1>
        <h2 className="App-title">{user.name}</h2>
        <br />

        <form>
          <input
            type="text"
            value={searchTerm}
            ref={(input) => { this.nameInput = input; }}
            onChange={this.onSearchChange}
          />
        </form>
        <br />

        {list.filter(this.isSearched(searchTerm)).map(item =>
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button
                onClick={() => this.onDismiss(item.objectID)}
                type="button"
              >
                Dismiss
              </button>
              {/* <button
                onClick={function () {
                  console.log(item.objectID)
                }}
                type="button"
              >
                Do something
              </button> */}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
