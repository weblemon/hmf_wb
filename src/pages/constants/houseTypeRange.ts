/**
 * 户型字典
 * 
 * 不可更改
 */

const houseTypeEnum =  [
  [
    '1室',
    '2室',
    '3室',
    '4室',
    '5室',
    '6室',
    '7室',
    '8室',
    '9室',
  ],
  [
    '0厅',
    '1厅',
    '2厅',
    '3厅',
    '4厅',
    '5厅',
    '6厅',
    '7厅',
    '8厅',
    '9厅',
  ],
  [
    '0卫',
    '1卫',
    '2卫',
    '3卫',
    '4卫',
    '5卫',
    '6卫',
    '7卫',
    '8卫',
    '9卫',
  ]
]

/**
 * 根据range查询名称
 */
export function getHousetTypeName(range: number[] | string, join: string = "") {
    if (!range) return;
    if (typeof range === 'string') {
        range = range.split(',').map(k => Number(k))
        return range.map((k, index) => {
            return houseTypeEnum[index][k]
        }).join(join)
    } else {
        return range.map((k, index) => {
            return houseTypeEnum[index][k]
        }).join(join)
    }
}

export default houseTypeEnum