import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { AppContainer } from 'react-hot-loader';
import reducers from './src/reducers';
import './style/style.scss';

const store = createStore(reducers, (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(thunkMiddleware)));

render();

if (module.hot) {
    module.hot.accept('./src/components/App/App.js', () => {
        render();
    });
}

function render() {
    const App = require('./src/components/App/App.js').default;
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer>
                <App />
            </AppContainer>
        </Provider>,
        document.getElementById('root'),
    );
}
