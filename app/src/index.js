import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userDataSlice from './reduxSlices/userDataSlice';
import refreshSlice from './reduxSlices/refreshSlice';
import App from './App';

// As of React 18
const store = configureStore({
    reducer: {
        userData: userDataSlice,
        refresh: refreshSlice
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
