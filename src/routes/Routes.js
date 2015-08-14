import React from 'react';
import { Route } from 'react-router';
import { App, HomePage, NotFoundPage } from '../components';

const routes = (
    <Route handler={App}>
      <Route path="home" handler={HomePage}/>
      <Route path="/*" handler={NotFoundPage}/>
    </Route>
);

export default routes;
