import http, { BaseQueryListParams, BaseResponse } from "../http";

export function getHouseList(params: QueryHouseListParams) {
    return http.get<BaseResponse<HouseListData>>('/housingResources/queryPageHouses', {
        params
    })
}

export interface HouseListData {
    total: number;
    size: number;
    pages: number;
    current: number;
    records: HouseInfo[];
  }
  
  export interface HouseInfo {
    id: number;
    deleted: boolean;
    rawAddTime: string;
    rawUpdateTime?: any;
    houseTitle: string;
    houseArea: number;
    houseAreaPlus?: any;
    houseType: string;
    houseOrientation: number;
    price: number;
    houseDoorLookType: number;
    houseDecoration: number;
    houseElevator: number;
    houseFloor: string;
    auditStatus: string | number;
    housePhotos: string;
    houseRemarks: string;
    province?: any;
    housingType: number;
    city?: any;
    area?: any;
    detailedAddress?: any;
    houseLocation: HouseInfoLocation;
    user: HouseInfoUser;
    isCollect?: any;
    releaseId: number;
  }

export interface HouseInfoUser {
    id: number;
    nickName: string;
    realName: string;
    phone: string;
    sparePhone: string;
    avatarUrl: string;
    gender: number;
}
  
export interface HouseInfoLocation {
    id: number;
    deleted: boolean;
    rawAddTime?: any;
    rawUpdateTime?: any;
    houssId?: any;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }

export interface QueryHouseListParams extends BaseQueryListParams {
    id?: string | number;
    housingType?: string | number;
    phone?: string | number;
    latitude?: number| string;
    longitude?: number| string;
    range?: number| string;
    houseTitle?: string;
    houseArea?: number| string;
    houseAreaPlus?: number| string;
    houseType?: string;
    houseOrientation?: number| string;
    price?: number| string;
    houseDoorLookType?: number| string;
    houseDecoration?: number| string;
    houseElevator?: number| string;
    houseFloor?: string;
    auditStatus?: 0 | 1 | 2 | 3 | '0' | '1' | '2' | '3' | number | string;
    startAddTime?: string;
    endAddTime?: string;
    name?: string;
    address?: string;
    releaseId?: number| string;
    search?: number| string;
    hType?: number| string;
    startHouseArea?: number| string;
    endHouseArea?: number| string;
    startPrice?: number| string;
    endPrice?: number| string;
}