import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import App from './components/App';

const server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname)));

const templateFile = path.join(__dirname, 'templates/index.html');
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

server.get('*', (req, res, next) => {
  try {
    let uri = req.path;
    let notFound = false;
    let data = {
      description: ''
    };
    let app = <App
      path = { req.path }
      onSetTitle = { (title) => { data.title = title; } }
      onPageNotFound = { () => { notFound = true; }}/>;

    data.body = React.renderToString(app);
    if (notFound) {
      res.status(404).send();
    } else {
      let html = template(data);
      res.send(html);
    }
  } catch(err) {
    next(err);
  }
});

server.listen(server.get('port'), () => {
  if (process.sed) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' +
      server.get('port'));
  }
});
