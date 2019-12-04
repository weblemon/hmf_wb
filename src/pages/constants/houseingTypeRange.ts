/**
 * 房屋类型字典
 */

interface HouseingType {
    id: number;
    name: string;
}

enum HouseingTypeEnum {
    "高层" = 0,
    "洋房",
    "别墅",
    "商业"
}

const houseingTypeEnum: HouseingType[] = [
    {
        id: 0,
        name: HouseingTypeEnum[0]
    },
    {
        id: 1,
        name: HouseingTypeEnum[1]
    },
    {
        id: 2,
        name: HouseingTypeEnum[2]
    },
    {
        id: 3,
        name: HouseingTypeEnum[3]
    }
]

/**
 * 根据名称返回房屋类型 id
 */
export function getHouseingTypeId(name: string) {
    if (!name) return 0;
    return(houseingTypeEnum.find((item) => item.name === name) as HouseingType).id;
}

/**
 * 根据id返回房屋类型名称
 */
export function getHouseingTypeName(id: number) {
    if (!id) return houseingTypeEnum[0].name;
    return (houseingTypeEnum.find((item) => item.id === id) as HouseingType).name;
}

// 要去掉项目请在map后面添加filter过滤掉即可
export default houseingTypeEnum.map((item) => item.name)