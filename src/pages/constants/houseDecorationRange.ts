/**
 * 装修字典
 * 
 */

enum HouseDecorations {
    "全新豪装家具家电齐全" = 0,
    "全新精装家具家电齐全",
    "住家装修家具家电齐全",
    "中等装修",
    "简装",
    "毛坯"
}


interface DecorationEnum { id: number, name: string };
type DecorationEnums = Array<DecorationEnum>;

const houseDecorationEnum: DecorationEnums = [
    {
        id: 0,
        name: HouseDecorations[0]
    },
    {
        id: 1,
        name: HouseDecorations[1]
    },
    {
        id: 2,
        name: HouseDecorations[2]
    },
    {
        id: 3,
        name: HouseDecorations[3]
    },
    {
        id: 4,
        name: HouseDecorations[4]
    },
    {
        id: 5,
        name: HouseDecorations[5]
    },
]

/**
 * 根据name返回装修类型id
 */
export function getHouseDecorationTypeId(name: string): number {
    if (!name) return 0
    return (houseDecorationEnum.find((item) => item.name === name) as DecorationEnum).id
}

/**
 * 根据id返回装修类型name
 */
export function getHouseDecorationTypeName(id: number): string {
    if (!id) return houseDecorationEnum[0].name
    return (houseDecorationEnum.find(item => item.id === id) as DecorationEnum).name
}

/**
 * 获取已装修的类型ids
 */
export function getHouseDecorationedTypeIds(id: number) {
    // 已装修类型ids
    const ids = [0, 1, 2, 3, 4]
    return houseDecorationEnum.map(item => {
        if (ids.includes(item.id)) return item.id
    })
}

/**
 * 获取未装修的类型id
 */
export function getHouseNotDecorationId() {
    return 5
}

// 要去掉项目请在map后面添加filter过滤掉即可
export default houseDecorationEnum.map(item => item.name);
