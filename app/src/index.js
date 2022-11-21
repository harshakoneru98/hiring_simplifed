import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import userDataSlice from './reduxSlices/userDataSlice';
import refreshSlice from './reduxSlices/refreshSlice';
import filterSlice from './reduxSlices/filterSlice';
import finalFilterSlice from './reduxSlices/finalFilterSlice';

// As of React 18
const store = configureStore({
    reducer: {
        userData: userDataSlice,
        refresh: refreshSlice,
        filter: filterSlice,
        finalFilter: finalFilterSlice
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <StyledEngineProvider injectFirst>
            <App />
        </StyledEngineProvider>
    </Provider>
);
