import  { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import React, { Component } from 'react'

import http from './utils/http'
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/LoginPage';

import './App.less';
import AdminIndex from './pages/admin/Index';
import NotFound from './pages/NotFound';

class App extends Component {
    public render() {
        return (
            <BrowserRouter>
                <div className='app'>
                    <Switch>
                        {/* <Route exact path={'/'} component={HomePage} /> */}
                        <Redirect exact path={'/'} to={'/admin/'} />
                        <Route exact path={'/login.html'} component={LoginPage} />
                        <Route path={'/admin/'} component={AdminIndex} />
                        <Route exact path={'/404.html'} component={NotFound} />
                        <Redirect to={'/404.html'} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

export default App