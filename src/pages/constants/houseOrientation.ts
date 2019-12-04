/**
 * 朝向字典
*/


enum HouseOrientationEnum {
    "东" = 0,
    "西",
    "南",
    "北",
    "东南",
    "西南",
    "东北",
    "西北"   
}

interface HouseOrientation {
    id: number;
    name: string;
}

type HouseOrientations = Array<HouseOrientation>;

const houseOrientationEnum: HouseOrientations = [
    {
        id: 0,
        name: HouseOrientationEnum[0]
    },
    {
        id: 1,
        name: HouseOrientationEnum[1]
    },
    {
        id: 2,
        name: HouseOrientationEnum[2]
    },
    {
        id: 3,
        name: HouseOrientationEnum[3]
    },
    {
        id: 4,
        name: HouseOrientationEnum[4]
    },
    {
        id: 5,
        name: HouseOrientationEnum[5]
    },
    {
        id: 6,
        name: HouseOrientationEnum[6]
    },
    {
        id: 7,
        name: HouseOrientationEnum[7]
    },
]

/**
 * 根据name索引id
 * @param { String } name 朝向名称
 * @returns { Number }
 */
export function getHouseOrientationTypeId(name: string) {
    if (!name) return 0;
    return (houseOrientationEnum.find((item) => item.name === name) as HouseOrientation).id
}

/**
 * 根据id索引name
 * @param { Number } id 
 * @returns { String }
 */
export function getHouseOrientationTypeName(id: number) {
    if (!id) return houseOrientationEnum[0].name
    return (houseOrientationEnum.find((item) => item.id === id) as HouseOrientation).name
}

// 要去掉项目请在map后面添加filter过滤掉即可
export default houseOrientationEnum.map(item => item.name)