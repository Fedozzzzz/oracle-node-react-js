import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import './App.css';
import ClientsPage from "./components/pages/ClientsPage";
import BooksPage from "./components/pages/BooksPage";
import JournalPage from "./components/pages/JournalPage";
import BookTypesPage from "./components/pages/BookTypesPage";
import '../public/favicon.ico';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Route exact path="/" component={LoginPage}/>
                    <Route exact path="/clients" component={ClientsPage}/>
                    <Route exact path="/books" component={BooksPage}/>
                    <Route exact path="/journal" component={JournalPage}/>
                    <Route exact path="/book-types" component={BookTypesPage}/>
                </Router>
            </div>
        );
    }
}

export default App;
