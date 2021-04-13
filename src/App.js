import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/swiper.scss';
import 'swiper/components/effect-flip/effect-flip.scss';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Login from './components/Login/Index';
import Taks from './components/Tasks/Index';
import reducer from './reducers/index';

const store = createStore(reducer);

export default () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path={'/'} exact component={Login}></Route>
          <Route path={'/tasks'} exact component={Taks}></Route>
          <Route path='*' component={Login}></Route>
        </Switch>
      </Router>
    </Provider>
  );
}