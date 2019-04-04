import houstTypeRange from "./houstTypeRange";
import DateDiff from 'date-diff';
import houseOrientationRanges from "./houseOrientationRanges";
import houseDoorLookTypeRanges from "./houseDoorLookTypeRanges";
import houseDecorationRange from "./houseDecorationRange";

export function formatHouseType(range: string) {
    if (typeof range === 'string') {
        return range.split(',').map((k: string, index: number) => houstTypeRange[index][Number(k)]);
    }
}

/**
 * 格式化时间
 */
export function formatHouseTime(time: string) {
    if (!time) return;
    const now = new Date();
    const d = new Date(time.substring(0, 16).replace('T', ' ').replace(/\-/g, '/'))
    let date: any = d.getDate()
    let m: any = d.getMonth() + 1
    let mm: any = d.getMinutes()
    let hh: any = d.getHours()
    
    if (date < 10) date= `0${date}`;
    if (m < 10) m = `0${m}`;
    if (mm < 10) mm = `0${mm}`;
    if (hh < 10) hh = `0${hh}`
    

    const diff =  new DateDiff(now, d)
    if (diff.seconds() < 60) {
      return `刚刚${Math.ceil(diff.seconds())}秒前`
    }

    if (diff.minutes() < 60) {
      return `${Math.ceil(diff.minutes())}分钟前`
    }

    if (diff.days() < 1) {
      return `${Math.ceil(diff.hours())}小时前`
    }

    if (diff.days() < 2) {
      return `昨天 ${hh}:${mm}`
    }

    if (diff.days() < 3) {
      return `前天 ${hh}:${mm}`
    }

    return `${d.getFullYear()}-${m}-${date} ${hh}:${mm}`
}


/**
 * 格式化时间
 */
export function formatTime(time: string) {
    if (!time) return;
    const d = new Date(time.substring(0, 16).replace('T', ' ').replace(/\-/g, '/'))
    let date: any = d.getDate()
    let m: any = d.getMonth() + 1
    let mm: any = d.getMinutes()
    let hh: any = d.getHours()
    
    if (date < 10) date = `0${date}`;
    if (m < 10) m = `0${m}`;
    if (mm < 10) mm = `0${mm}`;
    if (hh < 10) hh = `0${hh}`
    return `${d.getFullYear()}-${m}-${date} ${hh}:${mm}`
}

/**
 * 格式化朝向
 */
export function formatHouseOrientation(type: number) {
    return houseOrientationRanges[type]
}

/**
 * 获取总楼层
 */
export function getMaxFloor(start = -1, end = 100) {
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
export function getFloor(start = -2, end = 100) {
    const floors = []
    for (; start <= end; start++) {
        if (start === 0) continue;
        floors.push(start + '层');
    }
    return floors;
}

/**
 * 格式化楼层
 */
export function formatHouseFloor(foolr: string) {
    if (!foolr) return;
    const f = foolr.split(',');
    const max = getMaxFloor(Number(f[0]) - 1)
    return `${getFloor()[Number(f[0])]}/${max[Number(f[1])]}`
}

/**
 * 格式化门锁类型
 */
export function formatHouseDoorLookType(type: number) {
    return houseDoorLookTypeRanges[type]
}

/**
 * 格式化装修类型
 */
export function formatHouseDecoration(type: number) {
    return houseDecorationRange[type]
}
