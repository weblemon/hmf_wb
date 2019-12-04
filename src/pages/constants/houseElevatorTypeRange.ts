/**
 * 电梯类型字典
 */

interface HouseElevator {
    id: number;
    name: string;
}

enum HouseElevatorEnum {
    "有" = 0,
    "无"
}

const houseElevatorTypeEnum: Array<HouseElevator> = [
    {
        id: 0,
        name: HouseElevatorEnum[0]
    },
    {
        id: 1,
        name: HouseElevatorEnum[1]
    }
]

/**
 * 根据name返回电梯类型 id
 * @param { String } name 
 * @returns { Number }
 */
export function getHouseElevatorTypeId(name: string) {
    if (!name) return 0;
    return (houseElevatorTypeEnum.find((item) => item.name === name) as HouseElevator).id;
}

/**
 * 根据id返回电梯类型name
 * @param { Number } id
 * @returns { String } 
 */
export function getHouseElevatorTypeName(id: number) {
    if (!id) return houseElevatorTypeEnum[0].name
    return (houseElevatorTypeEnum.find((item) => item.id === id) as HouseElevator).name;
}


// 要去掉项目请在map后面添加filter过滤掉即可
export default houseElevatorTypeEnum.map((item) => item.name)