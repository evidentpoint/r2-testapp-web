// tslint:disable-next-line
import 'es6-shim';
// tslint:disable-next-line
import 'promise-polyfill/src/polyfill';
// tslint:disable-next-line
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import { ReadiumNGViewer } from './viewer';

ReactDOM.render(
  <ReadiumNGViewer/>,
  document.getElementById('viewer'));
