/**
 * 门锁字典
 */

 enum DoorLookTypes {
    "密码锁" = 0,
    "指纹密码锁",
    "普通门锁"
 }

 type HouseDoorLookTypes = Array<HouseDoorLookType>;
 interface HouseDoorLookType {id: number, name: string};


const houseDoorLookType: HouseDoorLookTypes = [
    {
        id: 0,
        name: DoorLookTypes[0]
    },
    {
        id: 1,
        name: DoorLookTypes[1]
    },
    {
        id: 2,
        name: DoorLookTypes[2]
    }
]

/**
 * 根据name索引id
 */
export function getHouseDoorLookTypeId(name: string ) {
    if (!name) return 0
    return (houseDoorLookType.find((item) => item.name === name) as HouseDoorLookType).id
}

/**
 * 根据id索引name
 */
export function getHouseDoorLookTypeName(id: number) {
    if (!id) houseDoorLookType[0].name
    return (houseDoorLookType.find(item => item.id === id) as HouseDoorLookType).name;
}


// 要去掉项目请在map后面添加filter过滤掉即可
export default houseDoorLookType.map(item => item.name)