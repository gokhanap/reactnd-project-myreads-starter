import React from 'react'

class DisplayBook extends React.Component {

  state = {
  }

  componentWillMount() {
    let comparison = []
    comparison = this.props.myBooks.filter((mybook) => mybook.id === this.props.book.id)
    comparison.length > 0 ? this.setState({onMyLibrary: 'yes'}) : this.setState({onMyLibrary: 'no'})
  }

  handleChange = (event) => {
    this.props.onChangeShelf(event.target.value, this.props.book)
  }

  render() {
    let onMyLibrary = this.state.onMyLibrary
    const myBooks = this.props.myBooks
    const { title, authors, imageLinks, id } = this.props.book
    const librarySource = myBooks.filter((mybook) => mybook.id === id)

      return (

        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ backgroundImage: `url('${imageLinks.thumbnail})` }}></div>

            {(onMyLibrary === 'yes' &&
              <div className="book-shelf-changer">
                <select value={librarySource[0].shelf} onChange={this.handleChange}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                  <option value="remove">Remove</option>
                </select>
              </div>
            )}

            {(onMyLibrary === 'no' &&
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
    )
  }
}

export default DisplayBook