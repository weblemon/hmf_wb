import React, { Component } from 'react'

import { Breadcrumb, Table, notification, Avatar, Switch, Button, DatePicker, Pagination, Row, Col, Modal, Input, Radio, Select, Cascader } from 'antd';
import { Link } from 'react-router-dom';
import http, { BaseResponse } from '../../../utils/http';
import Search from 'antd/lib/input/Search';
import { ColumnProps } from 'antd/lib/table';
import { formatHouseType, formatHouseTime, formatHouseOrientation, formatHouseFloor, formatHouseDoorLookType, formatHouseDecoration } from '../../../utils/format';
import { Location, History } from 'history';
import houseStatus, { getHouseStatusTypeId, getHouseStatusTypeName } from '../../constants/houseStatus';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import houseOrientation, { getHouseOrientationTypeId } from '../../constants/houseOrientation';
import houseDoorLookTypeRange, { getHouseDoorLookTypeId } from '../../constants/houseDoorLookTypeRange';
import houseDecorationRange, { getHouseDecorationTypeId } from '../../constants/houseDecorationRange';
import houseFloor, { getCountFloorRange, getFloorRange } from '../../constants/houseFloor';
import houseTypeEnum from '../../constants/houseTypeRange';
import houseingTypeRange, { getHouseingTypeId } from '../../constants/houseingTypeRange';
import houstTypeRange from '../../../utils/houstTypeRange';

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
        query: {}
    }

    render() {
        const { records, loading } = this.state
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
                width: 200,
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
                width: 200,
                align: 'center',
                render: (record: Record) => {
                    return <Button onClick={() => { this.props.history.push(`/admin/house/${record.id}.html`) }} size="small" type="ghost">查看</Button>
                }
            }
        ]
        const col = 4; 
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
                        <Row>
                            <Col span={col}>
                                <Search
                                    type="number"
                                    placeholder="id"
                                    style={{ width: 240 }}
                                    onSearch={(id) => {
                                        this.changeSearchQuery({
                                            id: id as any
                                        })
                                    }}
                                />
                            </Col>                         
                            <Col span={col}>
                                <Search
                                    placeholder="搜索地区/小区名"
                                    style={{ width: 240 }}
                                    onSearch={(search) => {
                                        this.changeSearchQuery({
                                            search
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
                                            this.changeSearchQuery({
                                                startAddTime: d[0],
                                                endAddTime: d[1]
                                            })
                                        }
                                    } 
                                />
                            </Col>
                            <Col span={col}>
                                <Input.Group>
                                    <Input
                                        type="number"
                                        placeholder="开始面积"
                                        style={{ width: 100 }}
                                        onChange={(e) => {
                                            let v = Number(e.target.value)
                                            if (v < 0) v = 0;
                                            this.changeSearchQuery({
                                                endHouseArea: e.target.value
                                            })
                                        }}
                                    />
                                    <Input disabled style={{ width: 40, borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff',}} value="至" />
                                    <Search
                                        type="number"
                                        placeholder="结束面积"
                                        style={{ width: 100 }}
                                        onSearch={(endHouseArea) => {
                                            this.changeSearchQuery({
                                                endHouseArea
                                            })
                                        }}
                                    />
                                </Input.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={col}>
                                <Input.Group>
                                    <Input
                                        type="number"
                                        placeholder="开始价格"
                                        style={{ width: 100 }}
                                        onChange={(e) => {
                                            this.changeSearchQuery({
                                                startPrice: e.target.value
                                            })
                                        }}
                                    />
                                    <Input disabled style={{ width: 40, borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff',}} value="至" />
                                    <Search
                                        type="number"
                                        placeholder="结束价格"
                                        style={{ width: 100 }}
                                        onSearch={(startPrice) => {
                                            this.changeSearchQuery({
                                                startPrice
                                            })
                                        }}
                                    />
                                </Input.Group>
                            </Col>
                            <Col span={col}>
                                <Cascader
                                    onChange={(e) => {
                                        this.changeSearchQuery({
                                            houseType: e.join(",")
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
                                    defaultValue={-1}
                                    onChange={(e) => {
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

                        <Row>
                            <Col span={col}>
                                <Select
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
                        </Row>
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
                                        朝向: {formatHouseOrientation(record.houseOrientation)}
                                    </Col>

                                    <Col span={6} >
                                        电梯: {record.houseElevator === 0 ? '有' : '无'}
                                    </Col>

                                    <Col span={6} >
                                        电梯: {formatHouseFloor(record.houseFloor)}
                                    </Col>

                                    <Col span={6}>
                                        门锁: {formatHouseDoorLookType(record.houseDoorLookType)}
                                    </Col>

                                    <Col span={6}>
                                        装修: {formatHouseDecoration(record.houseDecoration)}
                                    </Col>

                                    <Col span={6}>
                                        发布人: {record.user.realName}
                                    </Col>

                                    <Col span={6}>
                                        发布人ID: {record.user.id}
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
                            size="small"
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
        console.log(query)
        this.setState({
            query: {
                ...this.state.query,
                ...query
            }
        }, () => {
            this.getHouseList()
        })
    }

    public getHouseList() {
        const { current, loading, size, query } = this.state
        if (loading) return;
        this.setState({loading: true})
        http.get('/housingResources/queryPageHouses', {
            params: { 
                current, size, order: "desc",
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
  auditStatus: string;
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