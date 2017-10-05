import React from 'react'
import DisplayBook from './DisplayBook'

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

export default DisplayShelf