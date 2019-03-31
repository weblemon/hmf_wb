/**
 * 楼层字典
 * 
 * 添加字典项时
 * 字典name不可重复
 * 字典id不可重复
 * 字典项（不可删除 不可删除 不可删除）
 */


/**
 * 获取总楼层
 */
export function getCountFloorRange(start = -1, end = 100) {
    if (start < 1) start = 1;
    const floors = []
    for (; start <= end; start++) {
        if (start === 0) continue;
        floors.push('共' + start + '层');
    }
    return floors;
}

/**
 * 获取楼层数组
 */
export function getFloorRange(start = -2, end = 100) {
    const floors = []
    for (; start <= end; start++) {
        if (start === 0) continue;
        floors.push(start + '层');
    }
    return floors;
}

/**
 * 根据range查询楼层字符串
 * @param { Array } range 
 */
export function getHouseFloorTypeName(range: number[] | string) {
    if (typeof range === 'string') {
        range = range.split(',').map(k => Number(k))
        const max = getCountFloorRange(range[0] - 1)
        return `${getFloorRange()[range[0]]}/${max[range[1]]}`
    } else {
        const max = getCountFloorRange(range[0] - 1)
        return `${getFloorRange()[range[0]]}/${max[range[1]]}`
    }
}


// 要去掉项目请在map后面添加filter过滤掉即可
export default [getFloorRange(), getCountFloorRange()]