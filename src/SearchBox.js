import React from 'react'
import { Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'
import DisplayShelf from './DisplayShelf'

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
      this.setState({
        books: results
      })
    })
  }

  render() {
    const { query, books } = this.state
    let showingBooks
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
            <input autoFocus type="text" placeholder="Search by title or author" value={query}
            onChange={(event) => this.updateQuery(event.target.value)
            }/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {(books.length > 0 &&
              <DisplayShelf
              shelfTitle='Results'
              shelf='results'
              books={books}
              onChangeShelf={this.props.onChangeShelf}
              />
              )}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBox
