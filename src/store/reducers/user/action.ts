import { Action } from "redux";
import { UserInfo } from ".";

export enum AdminActionTypes {
    SET_ADMIN_USER = 0,
    SET_AUTHORIZATION
}

// 设置用户
export class SetUserAction implements Action {
    public readonly type = AdminActionTypes.SET_ADMIN_USER;
    constructor(
        public readonly user: UserInfo
    ) {}
}

// 设置登录凭证
export class SetAuthorizationAction implements Action {
    public readonly type = AdminActionTypes.SET_AUTHORIZATION;
    constructor (
        public readonly Authorization: string | null
    ) {}
}

export type AdminActions = SetUserAction | SetAuthorizationAction;