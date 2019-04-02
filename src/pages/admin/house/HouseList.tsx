import React, { Component, CSSProperties } from 'react'

import { Breadcrumb, Table, notification, Avatar, Switch, Button, DatePicker, Pagination, Row, Col, Modal, Input, Radio, Select, Cascader, Icon } from 'antd';
import { Link } from 'react-router-dom';
import http, { BaseResponse } from '../../../utils/http';
import { ColumnProps } from 'antd/lib/table';
import { formatHouseType, formatHouseTime } from '../../../utils/format';
import { Location, History } from 'history';
import houseStatus, { getHouseStatusTypeId } from '../../constants/houseStatus';
import houseOrientation, { getHouseOrientationTypeId, getHouseOrientationTypeName } from '../../constants/houseOrientation';
import houseDoorLookTypeRange, { getHouseDoorLookTypeId, getHouseDoorLookTypeName } from '../../constants/houseDoorLookTypeRange';
import houseDecorationRange, { getHouseDecorationTypeId, getHouseDecorationTypeName } from '../../constants/houseDecorationRange';
import { getHouseFloorTypeName } from '../../constants/houseFloor';
import houseTypeEnum from '../../constants/houseTypeRange';
import houseingTypeRange, { getHouseingTypeId } from '../../constants/houseingTypeRange';

type Prop = {
    location: Location;
    history: History;
}

type State = Readonly<{
    loading: boolean;
    total: number;
    size: number;
    pages: number;
    current: number;
    records: Record[];
    editLoading: number | null;
    query: SearchQuery;
    houseType: number;
}>

class HouseList extends Component<Prop, State> {

    readonly state: State = {
        records: [],
        total: 0,
        size: 10,
        pages: 0,
        current: 1,
        loading: false,
        editLoading: null,
        houseType: 0,
        query: {}
    }

    render() {
        const { records, loading, query } = this.state
        const columns: ColumnProps<Record>[] = [
            {
                title: 'ID',
                width: 150,
                dataIndex: 'id',
            },
            {
                title: '标题',
                align: 'center',
                width: 300,
                dataIndex: 'houseTitle',
            },
            {
                title: '户型',
                width: 120,
                align: 'center',
                dataIndex: 'houseType',
                render: (houseType: string) => formatHouseType(houseType)
            },
            {
                title: '价格/万',
                width: 100,
                align: 'center',
                dataIndex: 'price'
            },
            {
                title: '地址',
                align: 'center',
                render: (record: Record) => {
                    return [record.province, record.city, record.area, record.detailedAddress]
                }
            },
            {
                title: '已上架',
                width: 100,
                align: 'center',
                render: (record: Record) => {
                    return (
                        <Switch
                            loading={this.state.editLoading === record.id}
                            checked={record.auditStatus === '0'}
                            onChange={(e) => {
                                this.setState({
                                    editLoading: record.id
                                })
                                http.post('/housingResources/save', {
                                    id: record.id,
                                    auditStatus: e ? '0' : '3'
                                }).then(({status, data}) => {
                                    const { success } = data
                                    if (success) {
                                        notification.success({
                                            message: '提示',
                                            description: <div>房源ID: <b>{record.id}</b>, {e ? '已上架' : '已下架' }</div>
                                        })
                                        this.getHouseList();
                                    } else {
                                        notification.error({
                                            message: '提示',
                                            description: <div>房源ID: <b>{record.id}</b>,  {e ? '上架' : '下架' }失败，请重试！</div>
                                        })
                                    }
                                    this.setState({
                                        editLoading: null
                                    })
                                }).catch(e => {
                                    this.setState({
                                        editLoading: null
                                    })
                                })
                                
                            }}
                        />
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                align: 'center',
                render: (record: Record) => {
                    return <Button onClick={() => { this.props.history.push(`/admin/house/${record.id}.html`) }} size="small" type="ghost">查看</Button>
                }
            }
        ]
        const col = 6;
        const rowStyle: CSSProperties = {
            margin: '5px 0',
            minWidth: 1000
        }
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>房源管理</Breadcrumb.Item>
                    <Breadcrumb.Item>已上架房源管理</Breadcrumb.Item>
                </Breadcrumb>
                
                <div className="content">
                    <div className="top-bar">
                        <Row style={rowStyle}>
                            <Col span={col}>
                                <Input
                                    type="number"
                                    placeholder="id"
                                    allowClear
                                    style={{ width: 240 }}
                                    onInput={(e) => {
                                        this.changeSearchQuery({
                                            id: Number((e.target as HTMLInputElement).value)
                                        })
                                    }}
                                    onChange={(e) => {
                                        const v = Number((e.target as HTMLInputElement).value)
                                        if (v !== 0) {
                                            this.changeSearchQuery({
                                                id: v
                                            })
                                        } else {
                                            delete this.state.query.id
                                        }
                                        
                                    }}
                                />
                            </Col>                         
                            <Col span={col}>
                                <Input
                                    allowClear
                                    placeholder="搜索地区/小区名"
                                    style={{ width: 240 }}
                                    onInput={(e) => {
                                        this.changeSearchQuery({
                                            search: (e.target as HTMLInputElement).value
                                        })
                                    }}
                                    onChange={(e) => {
                                        this.changeSearchQuery({
                                            search: (e.target as HTMLInputElement).value
                                        })
                                    }}
                                />

                            </Col>                        
                            <Col span={col}>
                                <DatePicker.RangePicker
                                    style={{
                                        width: 240
                                    }}
                                    onChange={(e, d) => {
                                            const startAddTime = d[0]
                                            const endAddTime = d[1]
                                            if (!startAddTime && !endAddTime) {
                                               delete this.state.query.startAddTime
                                               delete this.state.query.endAddTime
                                            } else {
                                                this.changeSearchQuery({
                                                    startAddTime,
                                                    endAddTime
                                                })
                                            }
                                        }
                                    } 
                                />
                            </Col>
                            <Col span={col}>
                                <Input.Group>
                                    <Input
                                        type="number"
                                        placeholder="开始面积"
                                        allowClear
                                        style={{ width: 100 }}
                                        onInput={(e) => {
                                            let v = Number((e.target as HTMLInputElement).value)
                                            if (v < 0) v = 0;
                                            this.changeSearchQuery({
                                                startHouseArea: v
                                            })
                                        }}
                                        onChange={(e) => {
                                            let v = Number((e.target as HTMLInputElement).value)
                                            if (v < 0) v = 0;
                                            this.changeSearchQuery({
                                                startHouseArea: v
                                            })
                                        }}
                                    />
                                    <Input disabled style={{ width: 40, borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff',}} value="至" />
                                    <Input
                                        type="number"
                                        placeholder="结束面积"
                                        allowClear
                                        style={{ width: 100 }}
                                        onInput={(e) => {
                                            let v = Number((e.target as HTMLInputElement).value)
                                            if (v !== 0) {
                                                this.changeSearchQuery({
                                                    endHouseArea: v
                                                })
                                            } else {
                                                delete this.state.query.endHouseArea
                                            }
                                        }}
                                        onChange={(e) => {
                                            let v = Number((e.target as HTMLInputElement).value)
                                            if (v !== 0) {
                                                this.changeSearchQuery({
                                                    endHouseArea: v
                                                })
                                            } else {
                                                delete this.state.query.endHouseArea
                                            }
                                        }}
                                    />
                                </Input.Group>
                            </Col>
                        </Row>

                        <Row style={rowStyle}>
                            <Col span={col}>
                                <Input.Group>
                                    <Input
                                        type="number"
                                        placeholder="开始价格"
                                        style={{ width: 100 }}
                                        value={this.state.query.startPrice}
                                        allowClear
                                        onInput={(e) => {
                                            this.changeSearchQuery({
                                                startPrice: (e.target as HTMLInputElement).value
                                            })
                                        }}
                                        onChange={(e) => {
                                            this.changeSearchQuery({
                                                startPrice: (e.target as HTMLInputElement).value
                                            })
                                        }}
                                    />
                                    <Input disabled style={{ width: 40, borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff',}} value="至" />
                                    <Input
                                        type="number"
                                        placeholder="结束价格"
                                        allowClear
                                        style={{ width: 100 }}
                                        value={this.state.query.endPrice}
                                        onInput={(e) => {
                                            const v = Number((e.target as HTMLInputElement).value)
                                            if (v > 0) {
                                                this.changeSearchQuery({
                                                    endPrice: v
                                                })
                                            } else {
                                                delete this.state.query.endPrice
                                            }
                                        }}
                                        onChange={(e) => {
                                            const v = Number((e.target as HTMLInputElement).value)
                                            if (v > 0) {
                                                this.changeSearchQuery({
                                                    endPrice: v
                                                })
                                            } else {
                                                delete this.state.query.endPrice
                                            }
                                        }}
                                    />
                                </Input.Group>
                            </Col>
                            <Col span={col}>
                                <Cascader
                                    value={query.houseType ? query.houseType.split(',') : undefined}
                                    onChange={(e) => {
                                        this.changeSearchQuery({
                                            houseType: e.join(",")
                                        })
                                        this.setState({
                                            houseType: 0
                                        })
                                    }}
                                    style={{
                                        width: 240
                                    }}
                                    options={
                                        houseTypeEnum[0].map((item, index) => {
                                            return {
                                                value: String(index),
                                                label: item,
                                                children: houseTypeEnum[1].map((iitem, iindex) => {
                                                    return {
                                                        value: String(iindex),
                                                        label: iitem,
                                                        children:  houseTypeEnum[2].map((iiitem, iiindex) => {
                                                            return {
                                                                value: String(iiindex),
                                                                label: iiitem,
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    placeholder='选择户型' 
                                />
                            </Col>
                            <Col span={col}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    value={typeof this.state.query.housingType === 'number' ? this.state.query.housingType : -1}
                                    defaultValue={-1}
                                    onChange={(e) => {
                                        console.log(e)
                                        if (e >= 0) {
                                            this.changeSearchQuery({
                                                housingType: e
                                            })
                                        } else {
                                            delete this.state.query.housingType
                                            this.changeSearchQuery({})
                                        }
                                    }}
                                >
                                    <Select.Option value={-1}>类型不限</Select.Option>
                                    {
                                        houseingTypeRange.map((item, index) => {
                                            return <Select.Option key={index} value={getHouseingTypeId(item)}>{item}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={col}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    value={typeof this.state.query.houseOrientation === 'number' ? this.state.query.houseOrientation : -1}
                                    defaultValue={-1}
                                    onChange={(e) => {
                                        if (e >= 0) {
                                            this.setState({
                                                query: {
                                                    ...this.state.query,
                                                    houseOrientation: e
                                                }
                                            })
                                        } else {
                                            delete this.state.query.houseOrientation
                                            this.changeSearchQuery({})
                                        }
                                    }}
                                >
                                    <Select.Option value={-1}>朝向不限</Select.Option>
                                    {
                                        houseOrientation.map((item, index) => {
                                            return <Select.Option key={index} value={getHouseOrientationTypeId(item)}>{item}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>  
                        </Row>

                        <Row style={rowStyle}>
                            <Col span={col}>
                                <Select
                                    value={typeof this.state.query.houseDoorLookType === 'number' ?  this.state.query.houseDoorLookType : -1}
                                     style={{
                                        width: 240
                                    }}
                                    defaultValue={-1}
                                    onChange={(e) => {
                                        if (e >= 0) {
                                            this.changeSearchQuery({
                                                houseDoorLookType: e
                                            })
                                        } else {
                                            delete this.state.query.houseDoorLookType
                                            this.changeSearchQuery({})
                                        }
                                    }}
                                >
                                    <Select.Option value={-1}>门锁不限</Select.Option>
                                    {
                                        houseDoorLookTypeRange.map((item, index) => {
                                            return <Select.Option key={index} value={getHouseDoorLookTypeId(item)}>{item}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={col}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    defaultValue={-1}
                                    value={typeof this.state.query.houseDecoration === 'number' ? this.state.query.houseDecoration : -1}
                                    onChange={(e) => {
                                        if (e >= 0) {
                                            this.changeSearchQuery({
                                                houseDecoration: e
                                            })
                                        } else {
                                            delete this.state.query.houseDecoration
                                            this.changeSearchQuery({})
                                        }
                                    }}
                                >
                                    <Select.Option value={-1}>装修不限</Select.Option>
                                    {
                                        houseDecorationRange.map((item, index) => {
                                            return <Select.Option key={index} value={getHouseDecorationTypeId(item)}>{item}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={col}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    value={typeof this.state.query.auditStatus  === 'number' ? this.state.query.auditStatus : -1}
                                    defaultValue={-1}
                                    onChange={(e) => {
                                        if (e >= 0) {
                                            this.changeSearchQuery({
                                                auditStatus: e
                                            })
                                        } else {
                                            delete this.state.query.auditStatus
                                            this.changeSearchQuery({})
                                        }
                                    }}
                                >
                                    <Select.Option value={-1}>发布状态不限</Select.Option>
                                    {
                                        houseStatus.map((item, index) => {
                                            return <Select.Option key={index} value={getHouseStatusTypeId(item)}>{item}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={col}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    value={this.state.houseType}
                                    onChange={(e) => {
                                        this.setState({
                                            houseType: e
                                        })
                                        this.changeSearchQuery({
                                            houseType: ""
                                        })
                                    }}
                                >
                                    {
                                        ['户型(模糊查询)不限', '一居室', '二居室', '三居室', '四居室', '五居室', '五居以上'].map((item, index) => {
                                            return <Select.Option key={index} value={index}>{item}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <div className="pager">
                        <div>
                            <Button
                                onClick={() => {
                                    this.setState({
                                        query: {},
                                        houseType: 0
                                    }, () => {
                                        this.getHouseList()
                                    })
                                }}
                                style={{
                                    marginRight: 20
                                }}
                                type="default"
                            >
                                清空
                            </Button>
                            
                            <Button
                                type="primary" 
                                onClick={() => {
                                    this.getHouseList()
                                }}
                            >
                                搜索
                            </Button>
                        </div>
                        <Pagination 
                            onChange={(current) => {
                                this.setState({current}, () => {
                                    this.getHouseList()
                                })
                            }} 
                            size="small"
                            showTotal={(t) => `总共${t}条`}
                            total={this.state.total}
                            current={this.state.current}
                            onShowSizeChange={(current, size) => {
                                this.setState({current, size}, () => {
                                    this.getHouseList()
                                })
                            }}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10']}
                        />
                    </div>
                    <Table
                        bordered
                        className="data"
                        size="small"
                        columns={columns as any}
                        rowKey="id"
                        dataSource={records} 
                        pagination={false}
                        loading={loading}
                        expandedRowRender={(record: Record) => {
                            return (
                                <Row gutter={16}>
                                    <Col span={6} >
                                        发布时间: {formatHouseTime(record.rawAddTime)}
                                    </Col>

                                    <Col span={6} >
                                        更新时间: {formatHouseTime(record.rawUpdateTime)}
                                    </Col>

                                    <Col span={6} >
                                        朝向: {getHouseOrientationTypeName(record.houseOrientation)}
                                    </Col>

                                    <Col span={6} >
                                        电梯: {record.houseElevator === 0 ? '有' : '无'}
                                    </Col>

                                    <Col span={6} >
                                        电梯: {getHouseFloorTypeName(record.houseFloor)}
                                    </Col>

                                    <Col span={6}>
                                        门锁: {getHouseDoorLookTypeName(record.houseDoorLookType)}
                                    </Col>

                                    <Col span={6}>
                                        装修: {getHouseDecorationTypeName(record.houseDecoration)}
                                    </Col>

                                    <Col span={6}>
                                        发布人: <Link to={`/admin/user/${record.user.id}.html`}>{record.user.realName}</Link>
                                    </Col>

                                    <Col span={6}>
                                        发布人ID:  <Link to={`/admin/user/${record.user.id}.html`}>{record.user.id}</Link>
                                    </Col>

                                    <Col span={6}>
                                        发布人手机: {record.user.phone}
                                    </Col>
                                </Row>
                            )
                        }}
                    />
                    <div className="pager">
                        {/* <Button type="primary">批量下架</Button> */}
                        <div></div>
                        <Pagination 
                            onChange={(current) => {
                                this.setState({current}, () => {
                                    this.getHouseList()
                                })
                            }}
                            current={this.state.current}
                            size="small"
                            showTotal={(t) => `总共${t}条`}
                            total={this.state.total}
                            onShowSizeChange={(current, size) => {
                                this.setState({current, size}, () => {
                                    this.getHouseList()
                                })
                            }}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10']}
                        />
                    </div>
                </div>
            </div>
        )
    }

    changeSearchQuery(query: SearchQuery) {
        this.setState({
            query: {
                ...this.state.query,
                ...query
            }
        })
    }

    public getHouseList() {
        let { current, loading, size, query } = this.state
        if (loading) return;
        this.setState({loading: true})
        const { houseType } = this.state
        query = JSON.parse(JSON.stringify(query))
        // 户型区间
        if (houseType) {
            query.houseType = String(houseType - 1)
            query.hType = 0
            if (houseType === 6) {
                query.houseType = String(4)
                query.hType = 2
            }
        }
        http.get('/housingResources/queryPageHouses', {
            params: { 
                current,
                size,
                order: "desc",
                ...query
            }
        }).then(res => {
            const { success, data, message } = res.data as BaseResponse<ResponseHouseList>
            if (success) {
                const { total, size, pages, current, records } = data
                this.setState({
                    total,
                    size,
                    pages,
                    current,
                    records,
                    loading: false
                })
            } else {
                notification.error({
                    message: '提示',
                    description: message
                })
                this.setState({
                    loading: false
                })
            }
        })
    }

    public componentWillMount() {
        this.getHouseList();
    }

}

export default HouseList

export interface ResponseHouseList {
  total: number;
  size: number;
  pages: number;
  current: number;
  records: Record[];
}

export interface QueryPageHouse {
    releaseId?: number;
    size?: number;
    search?: string;
    current?: number;
    auditStatus?: 0 | 1 | 2 | 3;
    startAddTime?: Date | string;
    endAddTime?: Date | string;
    name?: string;
    address?: string;
    price?: string;
    houseElevator?: 0 | 1;
    houseFloor?: string;
    houseOrientation?: number;
    houseType?: string;
    houseArea?: number;
    houseAreaPlus?: number;
    houseTitle?: number;
    houseDecoration?: number;
    houseDoorLookType?: number;
    order?: "desc" | "asc";
}

export interface Record {
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
  city?: any;
  area?: any;
  detailedAddress?: any;
  houseLocation: HouseLocation;
  user: User;
  isCollect?: any;
  releaseId: number;
}

export interface User {
  id: number;
  nickName: string;
  realName: string;
  phone: string;
  sparePhone: string;
  avatarUrl: string;
  gender: number;
}

interface HouseLocation {
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

type RecordCopy = { [K in keyof Record]?: Record[K]}

interface SearchQuery extends RecordCopy{
    phone?: string | number;
    startHouseArea?: string | number;
    endHouseArea?: string | number;
    startPrice?: string | number;
    endPrice?: string | number;
    //0 模糊查询室 1 模糊查询厅
    hType?: string | number;
    search?: string;
    housingType?: string | number;
    startAddTime?: string |  number;
    endAddTime?: string | number;
}