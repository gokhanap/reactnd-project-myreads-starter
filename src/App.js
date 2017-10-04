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
    const book = this.props.book
     // console.log(book.shelf)
      return (

        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url('${book.imageLinks.thumbnail})` }}></div>




              {this.props.shelfTitle === 'Results' && (
              <div className="book-shelf-changer">
                <select defaultValue="none" onChange={this.handleChange}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                </select>
              </div>
              )}




              {(book.shelf === 'currentlyReading' ||
                book.shelf === 'read' ||
                book.shelf === 'wantToRead') && (
              <div className="book-shelf-changer">
                <select value={book.shelf} onChange={this.handleChange}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                </select>
              </div>
              )}



          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.authors}</div>
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
                shelfTitle={this.props.shelfTitle} book={book}/>
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
    this.setState({ query: query.trim() })
    this.search(query)
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }


  search = (query) => {
    BooksAPI.search(query, '10').then((books) => {
      this.setState({
        books: books
      })
    })
  }


  render() {

    const { onChangeShelf } = this.props
    const { query, books } = this.state

    let showingBooks

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingBooks = books.filter((book) => match.test(book.title))
    } else {
      showingBooks = books
    }
    showingBooks.sort(sortBy('title'))
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


            {(query !== '' && <DisplayShelf books={showingBooks} shelfTitle='Results'
            onChangeShelf={onChangeShelf}/>)}


          </ol>
        </div>
      </div>
    )
  }
}




class BooksApp extends React.Component {
  state = {
    books: {
      currentlyReading: [],
      read: [],
      wantToRead: []
    }
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({
        books: {
          currentlyReading: books.filter((book) => book.shelf === 'currentlyReading'),
          read: books.filter((book) => book.shelf === 'read'),
          wantToRead: books.filter((book) => book.shelf === 'wantToRead')
        }})
    })
  }


  changeShelf = (targetshelf, book) => {

    book.shelf = targetshelf

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

    //BooksAPI.update(book, targetshelf)
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
                <DisplayShelf books={this.state.books.currentlyReading} shelfTitle='Current Reading'
                onChangeShelf={this.changeShelf}/>
                <DisplayShelf books={this.state.books.read} shelfTitle='Read'
                onChangeShelf={this.changeShelf}/>
                <DisplayShelf books={this.state.books.wantToRead} shelfTitle='Want To Read'
                onChangeShelf={this.changeShelf}/>
                <div className="open-search">
                  <Link to="/search">Add a book</Link>
                </div>
              </div>
            </div>
          </div>
          )}/>

        <Route path="/search" render={() => (
          <div>
            <SearchBox books={this.state.books.wantToRead}
                onChangeShelf={this.changeShelf}/>
          </div>
        )}/>

        <Route exact path="/static" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">To Kill a Mockingbird</div>
                          <div className="book-authors">Harper Lee</div>
                        </div>
                      </li>
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: 'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">Ender's Game</div>
                          <div className="book-authors">Orson Scott Card</div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">1776</div>
                          <div className="book-authors">David McCullough</div>
                        </div>
                      </li>
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">Harry Potter and the Sorcerer's Stone</div>
                          <div className="book-authors">J.K. Rowling</div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">The Hobbit</div>
                          <div className="book-authors">J.R.R. Tolkien</div>
                        </div>
                      </li>
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 174, backgroundImage: 'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">Oh, the Places You'll Go!</div>
                          <div className="book-authors">Seuss</div>
                        </div>
                      </li>
                      <li>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api")' }}></div>
                            <div className="book-shelf-changer">
                              <select>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">The Adventures of Tom Sawyer</div>
                          <div className="book-authors">Mark Twain</div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}
        />
      </div>
    )
  }
}

export default BooksApp
