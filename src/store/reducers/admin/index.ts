import {AdminUserAction, AdminUserInfo} from "../../actions/admin/AdminUserAction";
import {StoreActions} from "../../../pages/constants/StoreActions";
const initState: AdminUserState = {
    user: null,
    Authorization: localStorage.getItem('authorization')
};

export function adminUserReducer(state = initState, action: AdminUserAction) {
    switch (action.type) {
        case StoreActions.adminLogin:
            return  {
                ...state,
                user: action.user,
                Authorization: action.Authorization,
            };
        case StoreActions.adminLogout:
            return {
                user: null,
                Authorization: null
            };
        default:
            return state;
    }
}

export interface AdminUserState {
    // 用户
    user: AdminUserInfo | null;
    // 登录凭证
    Authorization: string | null;
}