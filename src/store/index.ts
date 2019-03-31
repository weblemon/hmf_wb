import { createStore, combineReducers } from 'redux'
import { userReducer, UserState } from './reducers/user'
import { AdminActions } from './reducers/user/action';

const store = createStore<{user: UserState}, AdminActions, {}, {}>(
    combineReducers({
        user: userReducer
    })
)

export default store