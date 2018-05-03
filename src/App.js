import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = '';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// ES5
// var url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
// ES6
// eslint-disable-next-line
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

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
    title: 'React1',
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

// function isSearched(searchTerm) {
//   return function (item) {
//   console.log("item.title", item.title);

//     if (!item.title) {
//       return item.title.toLowerCase().includes(searchTerm.toLowerCase())
//         || item.author.toLowerCase().includes(searchTerm.toLowerCase()) 
//     }
//     else{
//       return item.author.toLowerCase().includes(searchTerm.toLowerCase())      
//     }
//   }
// };

const isSearched = (searchTerm) => item =>
  (item.title
    ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
    : false)
  || item.author.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: list,
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result: result });
  }

  onSearchChange = (event) => {
    const updatedValue = event.target.value;
    this.setState({ searchTerm: updatedValue })
  }

  onDismiss = (id) => {
    const updateList = this.state.result.hits.filter(x => id !== x.objectID);
    this.setState({
      // result: Object.assign({}, this.state.result, { hits: updatedHits })
      result: { ...this.state.result, hits: updateList }
    });
  }

  componentDidMount() {
    console.log("Entrei componentDidMount");

    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  render() {
    const helloWorld = 'Welcome to React learn.';
    // eslint-disable-next-line
    const { searchTerm, list, result } = this.state
    console.log("Entrei no render()", result);

    // if (!result) {
    //   return null;
    // }

    return (
      <div className="page">
        <div className="interactions">
          <h1>{helloWorld}</h1>
          <h2 className="App-title">{user.name}</h2>
          <br />
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search text
          </Search>
          <br />
          {
            result &&
            <Table
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          }
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children}
    <input
      type="text"
      value={value}
      onChange={onChange}
      ref={(input) => { this.nameInput = input; }}
    />
  </form>

const Table = ({ list, pattern, onDismiss }) => {
  const maxlength = {
    width: '40%',
  }

  return (
    <div className="table">
      <div className="table-header">
        <span style={maxlength}>
          Title
        </span>
        <span style={{ width: '30%' }}>
          Author
        </span>
        <span style={{ width: '10%' }}>
          Comments
        </span>
        <span style={{ width: '10%' }}>
          Points
        </span>
        <span style={{ width: '10%' }}>
        </span>
      </div>
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={maxlength}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '30%' }}>{item.author}</span>
          <span style={{ width: '10%' }}>{item.num_comments}</span>
          <span style={{ width: '10%' }}>{item.points}</span>
          <span style={{ width: '10%' }}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
              </Button>
          </span>
        </div>
      )}
    </div>
  )
}

const Button = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  )
};

export default App;
