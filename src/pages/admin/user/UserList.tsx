import React, { Component } from 'react'

import './UserList.less';
import { Breadcrumb, Table, notification, Avatar, Switch, Button, DatePicker, Row, Col, Input, Radio, Pagination, Icon } from 'antd';
import { Link } from 'react-router-dom';
import http, { BaseResponse } from '../../../utils/http';
import { ColumnProps } from 'antd/lib/table';
import { Location, History } from 'history';
import Search from 'antd/lib/input/Search';
import { formatTime } from '../../../utils/format';

type Prop = {
    location: Location;
    history: History;
}

type State = Readonly<{
    total: number;
    size: number;
    pages: number;
    current: number;
    records: Record[];
    loading: boolean;
    elementSize: "small" | "default";
    type?: number | null;
    search?: string | null;
    gender?: number | null | "";
    changeStateLoading: null | number;
    changeIsNeedCheckLoading: null | number;
}>

class UserList extends Component<Prop, State> {

    readonly state: State = {
        records: [],
        total: 0,
        size: 10,
        pages: 0,
        current: 1,
        loading: false,
        elementSize: "default",
        changeStateLoading: null,
        changeIsNeedCheckLoading: null
    }

    render() {
        const { records } = this.state
        const columns:ColumnProps<Record>[] = [
            {
                title: 'ID',
                
                dataIndex: 'id',
            },
            {
                title: '头像',
                align: 'center',
                dataIndex: 'avatarUrl',
                render: (avatarUrl: string) => {
                    return <Avatar src={avatarUrl} />
                }
            },
            {
                title: '昵称',
                align: 'center',
                dataIndex: 'nickName',
            },
            {
                title: '手机',
                align: 'center',
                dataIndex: 'phone',
            },
            {
                title: '备用手机',
                align: 'center',
                dataIndex: 'sparePhone'   
            },
            {
                title: '性别',
                align: 'center',
                dataIndex: 'gender',
                render: (gender: number) => {
                    return gender === 0 ? '女' : '男'
                }
            },
            {
                title: '类型',
                align: 'center',
                dataIndex: 'type',
                render: (type: number) => {
                    switch(type) {
                        case 0:
                            return '未知'
                        case 1:
                            return '房东'
                        case 2:
                            return '中介'
                        default: 
                            return '系统出错'
                    }
                }
            },
            {
                title: '注册日期',
                align: 'center',
                dataIndex: 'rawAddTime',
                render: (rawAddTime: string) => {
                    return formatTime(rawAddTime)
                }
            },
            {
                title: '最近修改日期',
                align: 'center',
                dataIndex: 'rawUpdateTime',
                render: (rawUpdateTime: string) => {
                    if (!rawUpdateTime) return '';
                    return formatTime(rawUpdateTime)
                }
            },
            {
                title: '余额',
                align: 'center',
                dataIndex: 'balance',
                render: (balance: number) => {
                    return (balance || 0) + '元'
                }
            },
            {
                title: '状态',
                align: 'center',
                render: (record: Record) => {
                    record.balance
                    return <Switch
                        checked={record.state === 0}
                        loading={this.state.changeStateLoading === record.id}
                        onChange={(e) => {
                            this.setState({
                                changeStateLoading: record.id
                            })
                            http.post('/users/update', {
                                ...record,
                                state: e ? 0 : 1
                            }).then((res) => {
                                this.setState({
                                    changeStateLoading: null
                                })
                                if (res.data.success) {
                                    this.getUserList()
                                }
                            }).catch(e => {
                                this.setState({
                                    changeStateLoading: null
                                })
                            })
                        }}
                    />
                }
            },
            {
                title: '发布需要审核',
                align: 'center',
                render: (record: Record) => {
                    return <Switch
                        loading={this.state.changeIsNeedCheckLoading === record.id}
                        checked={record.isNeedCheck !== 0}
                        onChange={(e) => {
                            this.setState({
                                changeIsNeedCheckLoading: record.id
                            })
                            http.post('/users/update', {
                                ...record,
                                isNeedCheck: e ? 1 : 0
                            }).then((res) => {
                                this.setState({
                                    changeIsNeedCheckLoading: null
                                })
                                if (res.data.success) {
                                    this.getUserList()
                                }
                            }).catch(e => {
                                this.setState({
                                    changeIsNeedCheckLoading: null
                                })
                            })
                        }}
                    />
                }
            },
            {
                title: '操作',
                align: 'center',
                render: (record: Record) => {
                    return (
                        <Button
                            size="small"
                            onClick={() => {
                                this.props.history.push(`/admin/user/${record.id}.html`)
                            }} 
                            type="ghost"
                        >
                            查看
                        </Button>
                    )
                }
            }
        ]
        const { elementSize } = this.state;
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                
                <div className="content">
                    <div className="top-bar">
                        <Row gutter={15} className="item">
                            <Col span={20}>
                                <Radio.Group
                                    onChange={(e) => {
                                        const type = e.target.value
                                        if (type) {
                                            this.setState({
                                                type: e.target.value
                                            }, () => this.getUserList())
                                        } else {
                                            this.setState({
                                                type: null
                                            }, () => this.getUserList())
                                        }
                                    }}
                                    size={elementSize}
                                    defaultValue={0}
                                >
                                    <Radio.Button value={0}>不限</Radio.Button>
                                    <Radio.Button value={1}>房东</Radio.Button>
                                    <Radio.Button value={2}>中介</Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Col span={4}>
                                <Input.Search
                                    onSearch={(e) => {
                                        this.setState({
                                            search: e
                                        }, () => {
                                            this.getUserList()
                                        })
                                    }}
                                    ref="serach"
                                    enterButton
                                    size={elementSize}
                                    allowClear
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            this.setState({
                                                search: ''
                                            }, () => {
                                                this.getUserList()
                                            })
                                        }
                                    }}
                                    placeholder="输入id、昵称、或手机"
                                />
                            </Col>
                            <Col span={20}>
                                <Radio.Group
                                    onChange={(e) => {
                                        this.setState({
                                            gender: e.target.value
                                        }, () => this.getUserList())
                                    }}
                                    size={elementSize}
                                    defaultValue={null}
                                >
                                    <Radio.Button value={""}>不限</Radio.Button>
                                    <Radio.Button value={1}>男</Radio.Button>
                                    <Radio.Button value={0}>女</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                    </div>
                    <div className="pager">
                        <div></div>
                        <Pagination 
                            onChange={(current) => {
                                this.setState({current}, () => {
                                    this.getUserList()
                                })
                            }} 
                            size="small"
                            total={this.state.total}
                            showTotal={t => `总共${t}条`}
                            onShowSizeChange={(current, size) => {
                                this.setState({current, size}, () => {
                                    this.getUserList()
                                })
                            }}
                            current={this.state.current}
                            showSizeChanger
                            pageSize={this.state.size}
                            showQuickJumper
                            pageSizeOptions={['5', '10']}
                        />
                    </div>
                    <Table bordered loading={this.state.loading} pagination={false} size="small" columns={columns as any} rowKey="id" dataSource={records}></Table>
                    <div className="pager">
                        <div></div>
                        <Pagination 
                            onChange={(current) => {
                                this.setState({current}, () => {
                                    this.getUserList()
                                })
                            }} 
                            size="small"
                            current={this.state.current}
                            total={this.state.total}
                            showTotal={t => `总共${t}条`}
                            onShowSizeChange={(current, size) => {
                                this.setState({current, size}, () => {
                                    this.getUserList()
                                })
                            }}
                            showSizeChanger
                            showQuickJumper
                            pageSize={this.state.size}
                            pageSizeOptions={['5', '10']}
                        />
                    </div>
                </div>
            </div>
        )
    }

    public getUserList() {
        if (this.state.loading) return;
        this.setState({
            loading: true
        })
        const { size, search, gender, type, current } = this.state
        const params: any = {
            order: 'asc',
            current,
            size
        }
        if (search) {
            params.search = search
        }
        if (gender !== '') {
            params.gender = gender
        }
        if (type) {
            params.type = type
        }
        http.get('/users/queryUserPage', {
            params
        }).then(res => {
            const { success, data, message } = res.data as BaseResponse<ResponseUserList>
            if (success) {
                const { records, pages, size, current, total } = data
                this.setState({
                    records: records.filter(item => item.userName !== 'admin'),
                    pages,
                    size,
                    current,
                    total,
                    loading: false
                })
            } else {
                this.setState({
                    loading: false
                })
                notification.error({
                    message: '提示',
                    description: message
                })
            }
        })
    }

    public componentWillMount() {
        this.getUserList();
    }

}

export default UserList

export interface ResponseUserList {
  total: number;
  size: number;
  pages: number;
  current: number;
  records: Record[];
}

export interface Record {
  id: number;
  deleted: boolean;
  rawAddTime: string;
  rawUpdateTime?: string;
  userName?: string;
  password?: string;
  openid?: string;
  wechatNumber?: any;
  nickName?: string;
  region?: any;
  phone?: string;
  sparePhone?: string;
  realName?: string;
  gender: number;
  type: number;
  state: number;
  avatarUrl?: string;
  city?: string;
  country?: string;
  language?: string;
  province?: string;
  isNeedCheck: number;
  balance: number;
  code?: any;
  sms?: any;
}