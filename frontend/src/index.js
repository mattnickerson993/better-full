import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {darkTheme} from './Theme'


ReactDOM.render(
  <MuiThemeProvider theme={darkTheme}>
    <CssBaseline>
    <App />
    </CssBaseline>
  </MuiThemeProvider>,
  document.getElementById('root')
);


