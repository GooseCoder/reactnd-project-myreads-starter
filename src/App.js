import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Search from "./Search";
import Bookshelf from "./Bookshelf";

class BooksApp extends React.Component {
    state = {
        /**
         * TODO: Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        showSearchPage: false,
        bookshelves: {
            'currentlyReading': {
                title: 'Currently Reading',
                books: []
            },
            'wantToRead': {
                title: 'Want to Read',
                books: []
            },
            'read': {
                title: 'Read',
                books: []
            }
        }
    }

    componentDidMount() {
        BooksAPI.getAll().then(books => {
            const bookshelves = {...this.state.bookshelves}
            books.forEach(book => {
                switch (book.shelf) {
                    case 'currentlyReading':
                        bookshelves['currentlyReading'].books.push(book)
                        break
                    case 'wantToRead':
                        bookshelves['wantToRead'].books.push(book)
                        break
                    case 'read':
                        bookshelves['read'].books.push(book)
                        break
                    default:
                        break
                }
            })

            this.setState({
                bookshelves: bookshelves
            })
        })
    }

    render() {
        return (
            <div className="app">
                {this.state.showSearchPage ? (
                    <Search/>
                ) : (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                {Object.entries(this.state.bookshelves).map(([id, bookshelf]) => {
                                    return (<Bookshelf
                                        key={id}
                                        title={bookshelf.title}
                                        books={bookshelf.books}
                                    />)
                                })}
                            </div>
                        </div>
                        <div className="open-search">
                            <a onClick={() => this.setState({showSearchPage: true})}>Add a book</a>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default BooksApp
