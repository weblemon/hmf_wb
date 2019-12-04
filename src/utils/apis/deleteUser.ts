import http, {BaseResponse} from "../http";

export function deleteUser(id: number) {
    /**
     * 更新用户
     * @param data
     */
    return http.post<BaseResponse>("/users/update", {
        id,
        deleted: true
    });
}