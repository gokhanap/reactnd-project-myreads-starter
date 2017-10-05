import React from 'react'
import DisplayBook from './DisplayBook'

class DisplayShelf extends React.Component {

  render() {
    let { onChangeShelf } = this.props

    return (
        <div className="bookshelf">
          <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
              {this.props.books.map((book) => (
                  <DisplayBook
                  key={book.id}
                  id={book.id}
                  onChangeShelf={onChangeShelf}
                  book={book}
                  />
              ))}
            </ol>
          </div>
        </div>
    )
  }
}

export default DisplayShelf