import thunkMiddleware from 'redux-thunk';
import reduxLogger from 'redux-logger';
import {createStore, combineReducers, Middleware, compose, applyMiddleware} from 'redux'
import {adminUserReducer, AdminUserState} from "./reducers/admin";
import {AdminUserAction} from "./actions/admin/AdminUserAction";


const middleware: Middleware[] = [
    thunkMiddleware
];
if (process.env.NODE_ENV === 'development') {
    middleware.push(reduxLogger)
}

const store = createStore<IStore, AdminUserAction, {}, {}>(
    combineReducers({
        admin: adminUserReducer
    }),
    compose(
        applyMiddleware(...middleware)
    )
);

export interface IStore {
    admin: AdminUserState;
}

export default store;