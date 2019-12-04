import React, { Component } from 'react'

import { Breadcrumb, Table, notification, Avatar, Switch, Button, DatePicker, Pagination, Row, Col, Input, Select, Card } from 'antd';
import {Link, RouteComponentProps} from 'react-router-dom';
import http from '../../../utils/http';
import { ColumnProps } from 'antd/lib/table';
import { formatHouseType, formatHouseTime } from '../../../utils/format';
import houseOrientation, { getHouseOrientationTypeId, getHouseOrientationTypeName } from '../../constants/houseOrientation';
import houseDoorLookTypeRange, { getHouseDoorLookTypeId, getHouseDoorLookTypeName } from '../../constants/houseDoorLookTypeRange';
import houseDecorationRange, { getHouseDecorationTypeId, getHouseDecorationTypeName } from '../../constants/houseDecorationRange';
import {getHouseFloorTypeName } from '../../constants/houseFloor';
import houseingTypeRange, { getHouseingTypeId } from '../../constants/houseingTypeRange';
import Meta from 'antd/lib/card/Meta';
import Qs from 'qs'
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { HouseInfo, QueryHouseListParams, getHouseList } from '../../../utils/apis/getHouseList';
import { tableConfig } from '../../constants/tableConfig';

interface OwnProps {}
type Props = OwnProps & RouteComponentProps<{id: string}>;
type State = Readonly<{
    loading: boolean;
    total: number;
    size: number;
    pages: number;
    current: number;
    records: HouseInfo[];
    editLoading: number | null;
    query: QueryHouseListParams;
    id: number | null;
    avatarUrl?: string;
    nickName?: string;
    auditStatus?: string | number;
    timeRange?: RangePickerValue;
}>
class UserHouseList extends Component<Props, State> {
    public readonly state: State = {
        records: [],
        total: 0,
        size: 10,
        pages: 0,
        current: 1,
        loading: false,
        editLoading: null,
        query: {},
        id: null
    }
    public componentWillMount() {
        if (this.props.match.params.id) {
            this.setState({
                id: Number(this.props.match.params.id),
                ...Qs.parse(this.props.location.search.replace(/^\?/, ''))
            }, () => {
                this.getHouseList()
            })
        } else {
            this.props.history.goBack()
        }
        this.getHouseList();
    }
    public render() {
        const { records, loading, query, id, auditStatus, avatarUrl, nickName } = this.state
        let name;
        if (auditStatus === '0') {
            name = '已上架'
        } else if(auditStatus === '1') {
            name = '欠费下架'
        } else if (auditStatus === '2') {
            name = '用户下架'
        } else if (auditStatus === '3') {
            name ='欠费下架'
        }
        const columns: ColumnProps<HouseInfo>[] = [
            {
                title: 'ID',
                width: 150,
                dataIndex: 'id',
                fixed: 'left',
                render: (id) => {
                    return <Link to={`/admin/house/${id}.html`} target="_blank">{id}</Link>
                }
            },
            {
                title: '标题',
                align: 'center',
                width: 300,
                dataIndex: 'houseTitle',
            },
            {
                title: '户型',
                width: 200,
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
                title: '朝向',
                width: 100,
                align: 'center',
                render: (record: HouseInfo) => {
                    return getHouseOrientationTypeName(record.houseOrientation)
                }
            },
            {
                title: '电梯',
                width: 50,
                align: 'center',
                render: (record: HouseInfo) => {
                    return record.houseElevator === 0 ? '有' : '无'
                }
            },
            {
                title: '楼层',
                width: 120,
                align: 'center',
                render: (record: HouseInfo) => {
                    return getHouseFloorTypeName(record.houseFloor)
                }
            },
            {
                title: '门锁',
                width: 100,
                align: 'center',
                render: (record: HouseInfo) => {
                    return getHouseDoorLookTypeName(record.houseDoorLookType)
                }
            },
            {
                title: '装修',
                width: 200,
                align: 'center',
                render: (record: HouseInfo) => {
                    return getHouseDecorationTypeName(record.houseDecoration)
                }
            },           
            {
                title: '地址',
                align: 'left',
                render: (record: HouseInfo) => {
                    return [record.province, record.city, record.area, record.detailedAddress]
                }
            },
            {
                title: '发布时间',
                align: 'center',
                width: 200,
                render: (record: HouseInfo) => {
                    return formatHouseTime(record.rawAddTime)
                }
            },
            {
                title: '更新时间',
                align: 'center',
                width: 200,
                render: (record: HouseInfo) => {
                    return formatHouseTime(record.rawUpdateTime)
                }
            },
            {
                title: '发布人',
                width: 100,
                align: 'center',
                fixed: 'right',
                render: (record: HouseInfo) => {
                    return <Link to={`/admin/user/${record.user.id}.html`}>{record.user.realName}</Link>
                }
            },
            {
                title: '已上架',
                width: 100,
                align: 'center',
                fixed: 'right',
                render: (record: HouseInfo) => {
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
                fixed: 'right',
                width: 100,
                align: 'center',
                render: (record: HouseInfo) => {
                    return (
                        <Link to={`/admin/house/${record.id}.html`} target='_blank'>
                            <Button size="small" type="ghost">查看</Button>
                        </Link>
                    )
                }
            }
        ]
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={'/admin/user/list.html'}>用户管理</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/admin/user/${id}.html`}>用户{id}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{name}房源列表</Breadcrumb.Item>
                </Breadcrumb>
                <Card>
                    <Meta
                        avatar={<Avatar src={avatarUrl} icon='user' />}
                        title={nickName}
                        description={'房源列表'}
                    />
                </Card>
                <div className="content">
                <div className="top-bar">
                        <Row
                            style={tableConfig.rowStyle}
                            gutter={tableConfig.gutter}
                        >
                            <Col {...tableConfig.span}>
                                <Input
                                    type="text"
                                    placeholder="id"
                                    allowClear
                                    style={{ width: 240 }}
                                    value={query.id}
                                    onInput={(e) => {
                                        this.changeSearchQuery({
                                            id: (e.target as HTMLInputElement).value as any
                                        })
                                    }}
                                    onChange={(e) => {
                                        const v = (e.target as HTMLInputElement).value as any
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
                            <Col {...tableConfig.span}>
                                <Input
                                    allowClear
                                    placeholder="搜索地区/小区名"
                                    style={{ width: 240 }}
                                    onInput={(e) => {
                                        this.changeSearchQuery({
                                            search: (e.target as HTMLInputElement).value
                                        })
                                    }}
                                    value={query.search}
                                    onChange={(e) => {
                                        this.changeSearchQuery({
                                            search: (e.target as HTMLInputElement).value
                                        })
                                    }}
                                />

                            </Col>                        
                            <Col {...tableConfig.span}>
                                <DatePicker.RangePicker
                                    style={{
                                        width: 240
                                    }}
                                    value={this.state.timeRange}
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
                                                this.setState({
                                                    timeRange: e
                                                })
                                            }
                                        }
                                    } 
                                />
                            </Col>
                            <Col {...tableConfig.span}>
                                <Input.Group>
                                    <Input
                                        type="number"
                                        placeholder="开始面积"
                                        allowClear
                                        style={{ width: 100 }}
                                        value={query.startHouseArea}
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
                                        value={query.endHouseArea}
                                        onInput={(e) => {
                                            let v = Number((e.target as HTMLInputElement).value)
                                            if (!v) return;
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
                                            if (!v) return;
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
                            
                            <Col {...tableConfig.span}>
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
                            {/* <Col {...tableConfig.span}>
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
                            </Col> */}
                            <Col {...tableConfig.span}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    value={typeof this.state.query.housingType === 'number' ? this.state.query.housingType : -1}
                                    defaultValue={-1}
                                    onChange={(housingType: number) => {
                                        if (housingType >= 0) {
                                            this.changeSearchQuery({
                                                housingType
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
                            <Col {...tableConfig.span}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    value={typeof this.state.query.houseOrientation === 'number' ? this.state.query.houseOrientation : -1}
                                    defaultValue={-1}
                                    onChange={(houseOrientation: number) => {
                                        if (houseOrientation >= 0) {
                                            this.setState({
                                                query: {
                                                    ...this.state.query,
                                                    houseOrientation
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
                        
                            <Col {...tableConfig.span}>
                                <Select
                                    value={typeof this.state.query.houseDoorLookType === 'number' ?  this.state.query.houseDoorLookType : -1}
                                     style={{
                                        width: 240
                                    }}
                                    defaultValue={-1}
                                    onChange={(houseDoorLookType: number) => {
                                        if (houseDoorLookType >= 0) {
                                            this.changeSearchQuery({
                                                houseDoorLookType
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
                            <Col {...tableConfig.span}>
                                <Select
                                     style={{
                                        width: 240
                                    }}
                                    defaultValue={-1}
                                    value={typeof this.state.query.houseDecoration === 'number' ? this.state.query.houseDecoration : -1}
                                    onChange={(houseDecoration: number) => {
                                        if (houseDecoration >= 0) {
                                            this.changeSearchQuery({
                                                houseDecoration
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
                            {/* <Col {...tableConfig.span}>
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
                            </Col> */}
                            {/* <Col {...tableConfig.span}>
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
                            </Col> */}
                        </Row>
                    </div><div className="pager">
                        <div>
                             <Button
                                onClick={() => {
                                    this.setState({
                                        query: {},
                                        timeRange: []
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
                                    this.setState({
                                        current: 1
                                    }, () => {
                                        this.getHouseList()
                                    })
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
                            pageSize={this.state.size}
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
                        scroll={{x: 2400, y: 300}}
                    />
                    <div className="pager">
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
                            pageSize={this.state.size}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10']}
                        />
                    </div>
                </div>
            </div>
        )
    }
    private changeSearchQuery(query: QueryHouseListParams) {
        this.setState({
            query: {
                ...this.state.query,
                ...query
            }
        })
    }
    private getHouseList() {
        const { current, loading, size, query, id, avatarUrl, auditStatus } = this.state
        if (loading || !id) return;
        this.setState({loading: true})
        getHouseList({ 
            releaseId: id,
            current,
            size,
            auditStatus,
            order: "desc",
            ...query
        }).then(res => {
            const { success, data, message } = res.data;
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
}
export default UserHouseList;