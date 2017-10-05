import React from 'react'
import * as BooksAPI from './BooksAPI'

class DisplayBook extends React.Component {

  state = {
    title: '',
    authors: '',
    imageLinks: '',
    id: '',
    shelf: ''
  }

  componentDidMount() {
    BooksAPI.get(this.props.id).then((book) => {
      this.setState({
        title: book.title,
        authors: book.authors,
        imageLinks: book.imageLinks,
        id: book.id,
        shelf: book.shelf
        })
    })
  }

  handleChange = (event) => {
    this.setState({shelf: event.target.value})
    BooksAPI.update(this.props.book, event.target.value)
    this.props.onChangeShelf(event.target.value, this.props.book)
  }

  render() {
    const { title, authors, imageLinks, shelf } = this.state
    return (
      <div>
        {(title !== '' &&
          <div className="book">
            <div className="book-top">
              <div className="book-cover" style={{ backgroundImage: `url('${imageLinks.thumbnail})` }}></div>

              {(shelf !== 'none' &&
                <div className="book-shelf-changer">
                  <select value={shelf} onChange={this.handleChange}>
                    <option value="none" disabled>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                    <option value="none">Remove</option>
                  </select>
                </div>
              )}

              {(shelf === 'none' &&
                <div className="book-shelf-changer add">
                  <select defaultValue="none" onChange={this.handleChange}>
                    <option value="none" disabled>Add to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              )}

            </div>
            <div className="book-title">{title}</div>
            <div className="book-authors">{authors ? authors.join(', '): ''}</div>
          </div>
        )}
      </div>
    )
  }
}

export default DisplayBook