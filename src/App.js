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
                            search={(query) => this.searchBooks(query)}
                        />
                    )
                }}/>
            </div>
        )
    }
}

export default BooksApp
