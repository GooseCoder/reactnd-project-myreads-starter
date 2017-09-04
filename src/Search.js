import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Book from "./Book"

const WAIT_INTERVAL = 500;

export default class Search extends Component{
    timer = null

    state = {
        value: ''
    }

    handleChange = (e) => {
        const value = e.target.value
        this.setState({
            value
        })

        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.props.search(value)
        }, WAIT_INTERVAL)
    }

    componentWillMount() {
        this.timer = null
    }

    render() {
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author" value={this.state.value} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.props.searchResult.map(book => (
                            <li key={book.id}>
                                <Book {...book}/>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}
