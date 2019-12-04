import React, { PureComponent } from 'react'
import { Breadcrumb, Card, Avatar, Table, Pagination } from 'antd';
import {Link, RouteComponentProps} from 'react-router-dom';
import Meta from 'antd/lib/card/Meta';
import Qs from 'qs'
import http from '../../../utils/http';
import { ColumnProps } from 'antd/lib/table';
import { formatTime } from '../../../utils/format';

class UserCashFlow extends PureComponent<Props, State> {
    public readonly state: State = {
        size: 10,
        current: 1
    };
    public render() {
        const { avatarUrl, nickName, id, total, current, records, loading } = this.state;
        const columns: ColumnProps<Record>[] = [
            {
                title: 'ID',
                align: 'center',
                dataIndex: 'id',
            },
            {
                title: '金额',
                align: 'center',
                dataIndex: 'money',
            },
            {
                title: '说明',
                align: 'center',
                dataIndex: 'comment',
            },
            {
                title: '充值时间',
                align: 'center',
                dataIndex: 'rawAddTime',
                render: (rawAddTime: string) => formatTime(rawAddTime)
            }
        ];
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
                        <Link to={`/admin/user/${id}.html`}>用户：{id}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        查看流水
                    </Breadcrumb.Item>
                </Breadcrumb>
                
                <div className="content" style={{background: '#f1f1f1', padding: 0}}>
                    <div className="user-info">
                        <Card>
                            <Meta
                                avatar={<Avatar src={avatarUrl} icon="user"/>}
                                title={nickName}
                                description={'流水详情'}
                            />
                        </Card>
                    </div>
                    <div className="pager" style={{background:'#fff'}}>
                        <div/>
                        <Pagination 
                            onChange={(current) => {
                                this.setState({ 
                                    current
                                }, () => this.getCashFlow())
                            }} 
                            size="small"
                            showTotal={(t) => `总共${t}条`}
                            total={total}
                            current={current}
                            onShowSizeChange={(current, size) => {
                                this.setState({ 
                                    current,
                                    size
                                }, () => this.getCashFlow())
                            }}
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10']}
                        />
                    </div>
                    <Table
                        pagination={false}
                        loading={loading}
                        style={{background: '#fff'}}
                        size="small"
                        columns={columns}
                        bordered
                        rowKey="id"
                        dataSource={records}>
                    </Table>
                    <div className="pager" style={{background:'#fff'}}>
                        <div/>
                        <Pagination 
                            onChange={(current) => {
                                this.setState({ 
                                    current
                                }, () => this.getCashFlow())
                            }} 
                            size="small"
                            showTotal={(t) => `总共${t}条`}
                            total={total}
                            current={current}
                            onShowSizeChange={(current, size) => {
                                this.setState({ 
                                    current,
                                    size
                                }, () => this.getCashFlow())
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
    public componentWillMount() {
        if (this.props.match.params.id) {
            this.setState({
                id: Number(this.props.match.params.id),
                ...Qs.parse(this.props.location.search.replace(/^\?/, ''))
            }, () => {
                this.getCashFlow()
            })
        } else {
            this.props.history.goBack()
        }
    }
    private getCashFlow() {
        const { id, current, size } = this.state;
        this.setState({
            loading: true
        });
        http.get('/cashflow/queryPageCashFlowVo', {
            params: {
                userId: id,
                size,
                current
            }
        }).then(res => {
            const { success, data } = res.data as ResponseCashFlow
            if (success) {
                this.setState({
                    records: data.records,
                    current: data.current,
                    total: data.total,
                    size: data.size
                })
            }

            this.setState({
                loading: false
            })
        }).catch(e => {
            this.setState({
                loading: false
            })
        })
    }
}

export default UserCashFlow

interface OwnProps {}
type Props = OwnProps & RouteComponentProps<{id: string}>;
type State = Readonly<{
    avatarUrl?: string;
    nickName?: string;
    auditStatus?: string | number;
    id?: string | number;
    current?: number;
    total?: number;
    size?: number;
    records?: Record[];
    loading?: boolean;
}>
interface ResponseCashFlow {
  success: boolean;
  code: string;
  message?: any;
  draw: number;
  data: Data;
}
interface Data {
  total: number;
  size: number;
  pages: number;
  current: number;
  records: Record[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
interface Record {
  id: number;
  deleted: boolean;
  rawAddTime: string;
  rawUpdateTime?: any;
  userId: number;
  money: number;
  type: number;
  comment: string;
  bizId: string;
  nickName: string;
  realName: string;
  flowType: string;
}