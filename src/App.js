import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'
import './App.css'

class DisplayBook extends React.Component {

  handleChange = (event) => {
    this.props.onChangeShelf(event.target.value, this.props.book)
  }

  render() {
    const myBooks = this.props.myBooks
    const { title, authors, shelf, imageLinks} = this.props.book
    const isItOnShelf = myBooks.filter((mybook) => mybook.title === title)

      return (

        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url('${imageLinks.thumbnail})` }}></div>

              {isItOnShelf.length === 0 && (
              <div className="book-shelf-changer">
                <select defaultValue="none" onChange={this.handleChange}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                </select>
              </div>
              )}

              {isItOnShelf.length === 1 && (
              <div className="book-shelf-changer">
                <select value={shelf} onChange={this.handleChange}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                </select>
              </div>
              )}

          </div>
          <div className="book-title">{title}</div>
          <div className="book-authors">{authors}</div>
        </div>
    )
  }
}

class DisplayShelf extends React.Component {
  render() {
    return (
        <div className="bookshelf">
          <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">

            {this.props.books.map((book) => (
                <DisplayBook key={book.id} onChangeShelf={this.props.onChangeShelf}
                shelfTitle={this.props.shelfTitle} book={book} myBooks={this.props.myBooks}/>
            ))}

            </ol>
          </div>
        </div>
    )
  }
}

class SearchBox extends React.Component {
  state = {
    query: '',
    books: []
  }

  updateQuery = (query) => {
    this.search(query.trim())
    this.setState({ query: query })
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  search = (query) => {
    BooksAPI.search(query, 10).then((results) => {
      console.log(results)
      this.setState({
        books: results
      })
    })
  }

  render() {
    const { onChangeShelf } = this.props
    const { query, books } = this.state
    let showingBooks
    console.log(books.length)
    if (books.length > 0) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingBooks = books.filter((book) => match.test(book.title))
    } else {
      showingBooks = books
    }
    books.length > 0 && showingBooks.sort(sortBy('title'))
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search" >Close</Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input type="text" placeholder="Search by title or author" value={query}
            onChange={(event) => this.updateQuery(event.target.value)
            }/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">

            {(books.length > 0 && <DisplayShelf books={showingBooks} myBooks={this.props.myBooks} shelfTitle='Results'
            onChangeShelf={onChangeShelf}/>)}

          </ol>
        </div>
      </div>
    )
  }
}

class BooksApp extends React.Component {
  state = {
    myBooks: [],
    books: {
      currentlyReading: [],
      read: [],
      wantToRead: []
    }
  }

  componentWillMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({
        myBooks: books,
        books: {
          currentlyReading: books.filter((book) => book.shelf === 'currentlyReading'),
          read: books.filter((book) => book.shelf === 'read'),
          wantToRead: books.filter((book) => book.shelf === 'wantToRead')
        }})
    })
  }

  changeShelf = (targetshelf, book) => {
    book.shelf = targetshelf

    const isItOnMyBooks = this.state.myBooks.filter((mybook) => mybook.title === book.title)
    isItOnMyBooks.length === 0 &&
      this.setState((state) => ({
        myBooks: this.state.myBooks.concat([ book ])
      }))

    targetshelf === 'currentlyReading' &&
      this.setState((state) => ({
        books: {
          currentlyReading: state.books.currentlyReading.concat([ book ]),
          read: state.books.read.filter((b) => b.id !== book.id),
          wantToRead: state.books.wantToRead.filter((b) => b.id !== book.id)
        }
      }))

    targetshelf === 'read' &&
      this.setState((state) => ({
        books: {
          currentlyReading: state.books.currentlyReading.filter((b) => b.id !== book.id),
          read: state.books.read.concat([ book ]),
          wantToRead: state.books.wantToRead.filter((b) => b.id !== book.id)
        }
      }))

    targetshelf === 'wantToRead' &&
      this.setState((state) => ({
        books: {
          currentlyReading: state.books.currentlyReading.filter((b) => b.id !== book.id),
          read: state.books.read.filter((b) => b.id !== book.id),
          wantToRead: state.books.wantToRead.concat([ book ])
        }
      }))

    BooksAPI.update(book, targetshelf)
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div className="bookshelf">
                <DisplayShelf books={this.state.books.currentlyReading} myBooks={this.state.myBooks}
                shelfTitle='Current Reading' onChangeShelf={this.changeShelf}/>
                <DisplayShelf books={this.state.books.read} myBooks={this.state.myBooks}
                shelfTitle='Read' onChangeShelf={this.changeShelf}/>
                <DisplayShelf books={this.state.books.wantToRead} myBooks={this.state.myBooks}
                shelfTitle='Want To Read' onChangeShelf={this.changeShelf}/>
                <div className="open-search">
                  <Link to="/search">Add a book</Link>
                </div>
              </div>
            </div>
          </div>
          )}/>

        <Route path="/search" render={() => (
          <div>
            <SearchBox myBooks={this.state.myBooks} onChangeShelf={this.changeShelf}/>
          </div>
        )}/>

      </div>
    )
  }
}

export default BooksApp
