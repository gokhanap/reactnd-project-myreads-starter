import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import DisplayShelf from './DisplayShelf'
import SearchBox from './SearchBox'
import './App.css'

class BooksApp extends Component {
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

    targetshelf === 'remove' &&
      this.setState((state) => ({
        books: {
          currentlyReading: state.books.currentlyReading.filter((b) => b.id !== book.id),
          read: state.books.read.filter((b) => b.id !== book.id),
          wantToRead: state.books.wantToRead.filter((b) => b.id !== book.id)
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
