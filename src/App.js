import React from 'react'
import {Route, Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Search from "./Search";
import Bookshelf from "./Bookshelf";

class BooksApp extends React.Component {
    state = {
        searchResult: [],
        bookshelves: {
            'currentlyReading': {
                id: 'currentlyReading',
                title: 'Currently Reading',
                books: []
            },
            'wantToRead': {
                id: 'wantToRead',
                title: 'Want to Read',
                books: []
            },
            'read': {
                id: 'read',
                title: 'Read',
                books: []
            }
        }
    }

    constructor(props) {
        super(props)
        this.onAssignBookshelf = this.onAssignBookshelf.bind(this)
    }

    componentDidMount() {
        BooksAPI.getAll().then(books => {
            const bookshelves = {...this.state.bookshelves}
            books.forEach(book => {
                if (bookshelves[book.shelf]) {
                    bookshelves[book.shelf].books.push(book)
                }
            })

            this.setState({
                bookshelves
            })
        })
    }

    searchBooks = (query) => {
        BooksAPI.search(query).then(result => {
            if (!result.error) {
                this.setState({
                    searchResult: result
                })
            } else {
                console.log('error')
            }
        })
    }

    removeBookFromShelf(book, bookshelf) {
        return bookshelf.books.filter(storedBook => storedBook.id !== book.id)
    }

    onAssignBookshelf(book, shelf) {
        const updatedBook = {...book}
        BooksAPI.update(updatedBook, shelf).then(result => {
            const bookshelves = {...this.state.bookshelves}
            if (!result.error) {
                bookshelves[updatedBook.shelf].books = this.removeBookFromShelf(
                    updatedBook,
                    bookshelves[updatedBook.shelf]
                )
                if (shelf !== 'none') {
                    updatedBook.shelf = shelf
                }else {
                    delete updatedBook.shelf
                }
                bookshelves[shelf].books.push(updatedBook)
                this.setState({
                    bookshelves
                })
            } else {
                console.log('error')
            }
        })
    }

    render() {
        return (
            <div className="app">
                <Route exact path="/" render={() => {
                    return (
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
                                            onAssignBookshelf={this.onAssignBookshelf}
                                        />)
                                    })}
                                </div>
                            </div>
                            <div className="open-search">
                                <Link to="/search">Add a book</Link>
                            </div>
                        </div>
                    )
                }}/>
                <Route path="/search" render={() => {
                    return (
                        <Search
                            searchResult={this.state.searchResult}
                            onAssignBookself={this.onAssignBookself}
                            search={(query) => this.searchBooks(query)}
                        />
                    )
                }}/>
            </div>
        )
    }
}

export default BooksApp
