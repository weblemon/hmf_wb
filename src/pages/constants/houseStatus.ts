/**
 * 房源状态字典
 */

enum HouseStatusEnum {
    "上架中" = 0,
    "余额不足下架",
    "用户下架",
    "系统关闭"
}

interface HouseStatus {
    id: number;
    name: string;
}

const houseStatusEnum: Array<HouseStatus> = [
    {
        id: 0,
        name: HouseStatusEnum[0]
    },
    {
        id: 1,
        name: HouseStatusEnum[1]
    },
    {
        id: 2,
        name: HouseStatusEnum[2]
    },
    {
        id: 3,
        name: HouseStatusEnum[3]
    }
]


/**
 * 根据状态名称返回id
 */
export function getHouseStatusTypeId(name: string) {
    return (houseStatusEnum.find((item) => item.name === name) as HouseStatus).id;
}

/**
 * 根据状态id返回名称
 */
export function getHouseStatusTypeName(id: number) {
    return (houseStatusEnum.find((item) => item.id === id) as HouseStatus).name
}

// 要去掉项目请在map后面添加filter过滤掉即可
export default houseStatusEnum.map((item) => item.name)