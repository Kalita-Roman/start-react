import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
} from 'react-router-dom';

import './App.scss';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Router>
                   <div>
                        {`It works!`}
                   </div>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(App);
