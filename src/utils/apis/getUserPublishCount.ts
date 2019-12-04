import http from "../http";
import { QueryHouseListParams, HouseListData } from "./getHouseList";

function queryPageHouses(params: QueryHouseListParams) {
    return http.get<HouseListData>(`/housingResources/queryPageHouses`, {
        params
    })
}

export function getUserPublishCount(releaseId: string | number) {
    const query: QueryHouseListParams[]  = [
        {
            releaseId,
            size: 0,
            auditStatus: 0
        },
        {
            releaseId,
            size: 0,
            auditStatus: 1
        },
        {
            releaseId,
            size: 0,
            auditStatus: 2
        },
        {
            releaseId,
            size: 0,
            auditStatus: 3
        }
    ]
    // return Promise.all()
}