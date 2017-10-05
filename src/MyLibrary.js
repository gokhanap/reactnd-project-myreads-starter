import React from 'react'
import { Link } from 'react-router-dom'
import DisplayShelf from './DisplayShelf'

class MyLibrary extends React.Component {

  render() {
    let { currentlyReading, read, wantToRead, onChangeShelf } = this.props

    return (

      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div className="bookshelf">
            <DisplayShelf
            shelfTitle='Currently Reading'
            shelf='currentlyReading'
            books={currentlyReading}
            onChangeShelf={onChangeShelf}
            />
            <DisplayShelf
            shelfTitle='Read'
            shelf='read'
            books={read}
            onChangeShelf={onChangeShelf}
            />
            <DisplayShelf
            shelfTitle='Want to Read'
            shelf='wantToRead'
            books={wantToRead}
            onChangeShelf={onChangeShelf}
            />
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MyLibrary
