import http, { BaseResponse } from "../http";
import { HouseInfo } from "./getHouseList";

export function getHouseInfo(id: string | number) {
    return http.get<BaseResponse<HouseInfo>>('/housingResources/queryHousingResources', {
        params: {
            id
        }
    })
}