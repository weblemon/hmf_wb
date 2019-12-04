import React, { Component } from 'react'
import './UserList.less';
import { Breadcrumb, Table, notification, Avatar, Switch, Button, Row, Col, Input, Radio, Pagination } from 'antd';
import {Link, RouteComponentProps} from 'react-router-dom';
import http, { BaseResponse } from '../../../utils/http';
import { ColumnProps } from 'antd/lib/table';
import { formatTime } from '../../../utils/format';
import { UserInfo } from '../../../utils/apis/getUserList';

class UserCommendList extends Component<Props, State> {

    public readonly state: State = {
        records: [],
        total: 0,
        size: 10,
        pages: 0,
        current: 1,
        loading: false,
        elementSize: "default",
        changeStateLoading: null,
        changeIsNeedCheckLoading: null,
    };
    public render() {
        const { records } = this.state;
        const columns:ColumnProps<UserInfo>[] = [
            {
                title: 'ID',
                dataIndex: 'id',
                fixed: 'left',
                width: 200,
                render:(id: string) => {
                    return <Link to={`/admin/user/${id}.html`} target="_blank">{id}</Link>
                }
            },
            {
                title: '称呼',
                fixed: 'left',
                align: 'center',
                width: 150,
                dataIndex: 'realName',
            },
            {
                title: '头像',
                align: 'center',
                width: 60,
                dataIndex: 'avatarUrl',
                render: (avatarUrl: string) => {
                    return <Avatar src={avatarUrl} icon="user" />
                }
            },   
            {
                title: '手机',
                align: 'center',
                width: 150,
                dataIndex: 'phone',
            },
            {
                title: '备用手机',
                width: 150,
                align: 'center',
                dataIndex: 'sparePhone'   
            },
            {
                title: '性别',
                align: 'center',
                dataIndex: 'gender',
                width: 50,
                render: (gender: number) => {
                    return gender === 0 ? '女' : '男'
                }
            },
            {
                title: '类型',
                align: 'center',
                width: 100,
                dataIndex: 'type',
                render: (type: number) => {
                    switch(type) {
                        case 0:
                            return '未知';
                        case 1:
                            return '房东';
                        case 2:
                            return '中介';
                        case 3:
                            return '推广';
                        default: 
                            return '系统出错'
                    }
                }
            },
            {
                title: '注册日期',
                align: 'center',
                width: 200,
                dataIndex: 'rawAddTime',
                render: (rawAddTime: string) => {
                    return formatTime(rawAddTime)
                }
            },
            {
                title: '最近修改日期',
                align: 'center',
                width: 200,
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
                width: 200,
                render: (balance: number) => {
                    return (balance || 0) + '元'
                }
            },
            {
                title: '地区',
                width: 300,
                render: (data: UserInfo) => {
                    if (data.province && data.city + data.region) {
                        return (
                            <span>
                                {data.province + data.city + data.region}
                            </span>
                        )
                    } else {
                        return <span>暂无</span>
                    }
                    
                }
            },
            {
                title: '状态',
                align: 'center',
                width: 100,
                fixed: 'right',
                render: (record: UserInfo) => {
                    return <Switch
                        checked={record.state === 0}
                        loading={this.state.changeStateLoading === record.id}
                        onChange={(e) => {
                            this.setState({
                                changeStateLoading: record.id
                            });
                            http.post('/users/update', {
                                ...record,
                                state: e ? 0 : 1
                            }).then((res) => {
                                this.setState({
                                    changeStateLoading: null
                                });
                                if (res.data.success) {
                                    this.getUserList()
                                }
                            }).catch(() => {
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
                width: 100,
                fixed: 'right',
                render: (record: UserInfo) => {
                    return <Switch
                        loading={this.state.changeIsNeedCheckLoading === record.id}
                        checked={record.isNeedCheck !== 0}
                        onChange={(e) => {
                            this.setState({
                                changeIsNeedCheckLoading: record.id
                            });
                            http.post('/users/update', {
                                ...record,
                                isNeedCheck: e ? 1 : 0
                            }).then((res) => {
                                this.setState({
                                    changeIsNeedCheckLoading: null
                                });
                                if (res.data.success) {
                                    this.getUserList()
                                }
                            }).catch(() => {
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
                width: 100,
                fixed: 'right',
                render: (record: UserInfo) => {
                    return (
                        <Link
                            to={`/admin/user/${record.id}.html`}
                            target="_brank"
                        >
                            <Button
                                htmlType="button"
                                size="small"
                                type="ghost"
                            >
                                查看
                            </Button>
                        </Link>
                    )
                }
            }
        ];
        const { elementSize } = this.state;
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/admin/user/list.html`}>用户管理</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/admin/user/${this.props.match.params.id}.html`}>用户{this.props.match.params.id}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>推荐列表</Breadcrumb.Item>
                </Breadcrumb>
                
                <div className="content">
                    <div className="top-bar">
                        <Row gutter={15} className="item">
                            <Col span={20}>
                                <Radio.Group
                                    onChange={(e: any) => {
                                        const type = e.target.value;
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
                                    <Radio.Button value={3}>推广</Radio.Button>
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
                                    ref="search"
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
                                            gender: (e.target as any).value
                                        }, () => this.getUserList())
                                    }}
                                    size={elementSize}
                                    defaultValue={""}
                                >
                                    <Radio.Button value={""}>不限</Radio.Button>
                                    <Radio.Button value={1}>男</Radio.Button>
                                    <Radio.Button value={0}>女</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                    </div>
                    <div className="pager">
                        <div />
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
                    <Table
                        bordered
                        loading={this.state.loading}
                        pagination={false}
                        size="small"
                        columns={columns as any}
                        rowKey="id"
                        dataSource={records}
                        scroll={{x: 2060, y: 300}}
                    />
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
    public componentWillMount() {
        this.getUserList();
    }
    private getUserList() {
        if (this.state.loading) return;
        this.setState({
            loading: true
        });
        const { size, search, gender, type, current } = this.state
        const params: any = {
            order: 'asc',
            current,
            recommendId: this.props.match.params.id,
            size
        };
        if (search) {
            params.search = search;
            params.current = 1
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
            const { success, data, message } = res.data as BaseResponse<ResponseUserList>;
            if (success) {
                const { records, pages, size, current, total } = data;
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
                });
                notification.error({
                    message: '提示',
                    description: message
                })
            }
        })
    }
}

interface OwnProps {}
type Props = OwnProps & RouteComponentProps<{id: string}>;
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
export default UserCommendList
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