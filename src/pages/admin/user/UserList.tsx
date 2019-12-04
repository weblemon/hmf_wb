import React, { Component } from 'react'

import './UserList.less';
import {
    Breadcrumb,
    Table,
    notification,
    Avatar,
    Switch,
    Button,
    Row,
    Col,
    Input,
    Radio,
    Pagination,
    Cascader,
    Form, Modal
} from 'antd';
import {Link, RouteComponentProps} from 'react-router-dom';
import http, { qmap } from '../../../utils/http';
import { ColumnProps } from 'antd/lib/table';
import { formatTime } from '../../../utils/format';
import { AxiosResponse } from 'axios';
import { getUserList, QueryUserParams, UserInfo } from '../../../utils/apis/getUserList';
import {deleteUser} from "../../../utils/apis/deleteUser";

interface OwnProps {}
type Props = OwnProps & RouteComponentProps<{type: string}>;
type State = Readonly<{
    total: number;
    size: number;
    pages: number;
    current: number;
    records: UserInfo[];
    loading: boolean;
    elementSize: "small" | "default";
    type?: number | null;
    search?: string | null;
    gender?: number | null | "";
    changeStateLoading: null | number;
    changeIsNeedCheckLoading: null | number;
    district: string[];
    districtOptions: Result[];
}>
class UserList extends Component<Props, State> {
    readonly state: State = {
        records: [],
        total: 0,
        size: 10,
        pages: 0,
        current: 1,
        loading: false,
        elementSize: "default",
        changeStateLoading: null,
        changeIsNeedCheckLoading: null,
        district:[],
        districtOptions: []
    };
    public componentWillMount() {
        this.getUserList();
        this.getDistrictList('', (list) => {
            this.setState({
                districtOptions: list
            })
        });
    }
    public componentDidUpdate(prevProps: Readonly<OwnProps & RouteComponentProps<{ type: string }>>, prevState: Readonly<Readonly<{ total: number; size: number; pages: number; current: number; records: UserInfo[]; loading: boolean; elementSize: "small" | "default"; type?: number | null; search?: string | null; gender?: number | "" | null; changeStateLoading: number | null; changeIsNeedCheckLoading: number | null; district: string[]; districtOptions: Result[] }>>, snapshot?: any): void {
        if (prevProps.match.params.type !== this.props.match.params.type) {
            this.getUserList();
        }
    }

    public render() {
        const { records } = this.state;
        const columns:ColumnProps<UserInfo>[] = [
            {
                title: 'ID',
                dataIndex: 'id',
                fixed: 'left',
                width: 200,
                render:(id) => {
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
                width: 100,
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
                width: 100,
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
                            return '未知'
                        case 1:
                            return '房东'
                        case 2:
                            return '中介'
                        case 3:
                            return '推广'
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
                // fixed: 'right',
                render: (record: UserInfo) => {
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
                title: '操作',
                align: 'center',
                width: 200,
                // fixed: 'right',
                render: (record: UserInfo) => {
                    return (
                        <div>
                            <Link
                                to={`/admin/user/${record.id}.html`}
                                target="_brank"
                            >
                                <Button
                                    size="small"
                                    type="ghost"
                                >
                                    查看
                                </Button>
                            </Link>
                            <Button onClick={() => {
                                Modal.confirm({
                                    title: "警告",
                                    content: `正在删除用户${record.realName || record.nickName || record.id},是否继续？`,
                                    onOk: async () => {
                                       const res = await deleteUser(record.id);
                                       if (res.data.success) {
                                           this.getUserList();
                                       }
                                    }
                                })
                            }} style={{marginLeft: 10}} size="small" type="danger">删除</Button>
                        </div>
                    )
                }
            }
        ];
        const { elementSize } = this.state;
        const { type = 1 } = this.props.match.params;
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{type === "1" ? "房东管理": (type === "2" ? "中介管理" : "推广管理")}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content">
                    <div className="top-bar">
                        <Form layout="inline">
                            <Form.Item>
                                <Cascader
                                    placeholder={'搜索地区'}
                                    style={{width: 250}}
                                    loadData={(selectedOptions: any) => {
                                        const targetOption = selectedOptions[selectedOptions.length - 1];
                                        targetOption.loading = true;
                                        this.getDistrictList(targetOption.id, (list) => {
                                            if (list.length === 0) {
                                                targetOption.isLeaf = true
                                            } else {
                                                targetOption.children = list;
                                            }
                                            targetOption.loading = false;

                                            this.setState({
                                                districtOptions: [...this.state.districtOptions]
                                            });
                                        })
                                    }}
                                    options={this.state.districtOptions}
                                    fieldNames={{label: 'fullname', value: 'fullname', children: 'children' }}
                                    onChange={this.handleDistrictChange.bind(this)}
                                    changeOnSelect
                                />
                            </Form.Item>
                            <Form.Item>
                                <Radio.Group
                                    onChange={(e) => {
                                        this.setState({
                                            gender: e.target.value
                                        }, () => this.getUserList())
                                    }}
                                    size={elementSize}
                                    defaultValue={""}
                                >
                                    <Radio.Button value={""}>不限</Radio.Button>
                                    <Radio.Button value={1}>男</Radio.Button>
                                    <Radio.Button value={0}>女</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
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
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="pager">
                        <div/>
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
                        scroll={{x: 2060}}
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
    /**
     * 获取用户列表
     */
    public getUserList() {
        if (this.state.loading) return;
        this.setState({
            loading: true
        });
        const { size, search, gender, type, current, district } = this.state;
        const params: QueryUserParams = {
            order: 'asc',
            current,
            size
        };
        if (search) {
            params.search = search;
            params.current = 1
        }

        if (Array.isArray(district)) {
            const [ province, city, region ] = district;
            if (province) {
                params.province = province
            }

            if (city) {
                params.city = city
            }

            if (region) {
                params.region = region
            }
        }
        if (gender !== '') {
            params.gender = gender
        }
        params.type = this.props.match.params.type;
        getUserList(params).then(res => {
            const { success, data, message } = res.data;
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
                });
                notification.error({
                    message: '提示',
                    description: message
                })
            }
        })
    }
    /**
     * 处理地区变化
     * @param e
     * @param selectedOptions
     */
    private handleDistrictChange(e: string[], selectedOptions: any) {
      if (Array.isArray(e) && e[0]) {
        const start = e[0];
        if (/北京|上海|重庆|天津|香港|澳门/.test(start)) {
            this.setState({
                district: [start, ...e]
            }, () => {
                this.getUserList()
            })
        } else {
            this.setState({
                district: [start, ...e]
            }, () => {
                this.getUserList()
            })
        }
      } else {
          this.setState({
              district: [],
          }, () => this.getUserList());
      }
    }
    /**
     * 获取行政地区
     */
    public getDistrictList(id: string = '', callback?: (results: Result[]) => void) {
        const params: any = {
            key: '7TCBZ-GIF6U-7OZVB-4QDKC-MHPZO-RZFJ7',
            output: 'json'
        }
        if (id) {
            params.id = id
        }
        qmap.get('/ws/district/v1/getchildren', {
            params
        }).then((res: AxiosResponse<DistrictList>) => {
            if (res.data.status === 0) {
                if (typeof callback === 'function') {
                    const data = res.data.result[0]
                    callback(data.map(item => {
                        item.isLeaf = item.name ? false : true
                        return item;
                    }))
                }
            }
        })
    }

}
export default UserList

interface DistrictList {
  status: number;
  message: string;
  data_version: string;
  result: Result[][];
}
interface Result {
  id: string;
  name: string;
  fullname: string;
  pinyin: string[];
  location: LocationPoistion;
  children: Result[];
  isLeaf: boolean;
}
interface LocationPoistion {
  lat: number;
  lng: number;
}