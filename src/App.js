import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = '';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

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

// User for search in client-side
// eslint-disable-next-line
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
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchTermChange = this.onSearchTermChange.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result

    const oldHist = page !== 0
      ? this.state.result.hits
      : []

    const updatedHits = [
      ...oldHist,
      ...hits
    ]

    this.setState({
      result: { hits: updatedHits, page }
    });
  }

  fetchSearchTopStories = (searchTerm, page = 0, event) => {

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);

    event.preventDefault();
  }

  onSearchTermChange = (event) => {
    const updatedValue = event.target.value;
    this.setState({ searchTerm: updatedValue })
  }

  onDismiss = (id) => {
    const updateList = this.state.result
      ? this.state.result.hits.filter(x => id !== x.objectID)
      : this.state.list.filter(x => id !== x.objectID);

    this.state.result &&
      this.setState({
        result: { ...this.state.result, hits: updateList }
      });

    this.setState({
      // result: Object.assign({}, this.state.result, { hits: updatedHits })
      list: updateList
    });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    const page = 0;
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  render() {
    const helloWorld = 'Welcome to React learn.';

    // eslint-disable-next-line
    const { list, result, searchTerm } = this.state
    const page = (result && result.page) || 0;

    console.log("Entrei no render()", this.state);

    return (
      <div className="page">
        <div className="interactions">
          <h1>{helloWorld}</h1>
          <h2 className="App-title">{user.name}</h2>
          <br />
          <Search
            value={searchTerm}
            onChange={this.onSearchTermChange}
            onSubmit={(event) => this.fetchSearchTopStories(searchTerm, 0, event)}
          >
            Search text
          </Search>
          <br />
          {
            result
              ? <Table
                list={result.hits}
                onDismiss={this.onDismiss}
              />
              : <Table
                list={list}
                pattern={searchTerm}
                onDismiss={this.onDismiss}
              />
          }

          <div className="interactions">
            <Button onClick={(event) => this.fetchSearchTopStories(searchTerm, page + 1, event)}>
              More
            </Button>
          </div>

        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    {children}
    <input
      type="text"
      value={value}
      onChange={onChange}
      ref={(input) => { this.nameInput = input; }}
    />
    <button
      type="submit"
      className="button-inline">
      Submit
    </button>
  </form>

const Table = ({ list, pattern, onDismiss }) => {
  const maxlength = {
    width: '40%',
  }

  if (!list) {
    return null;
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
      {/* {list.filter(isSearched(pattern)).map(item => */}
      {list.map(item =>
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
