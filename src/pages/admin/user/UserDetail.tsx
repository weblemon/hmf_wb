import React, { Component, CSSProperties } from 'react'
import '../common.less'
import { Breadcrumb, Row, Col, Avatar, Card, Switch, Input, Radio, Icon, Button, message, notification, Statistic, Select, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { match } from 'react-router';
import { Location, History } from 'history';
import http, { BaseResponse } from '../../../utils/http';
import Meta from 'antd/lib/card/Meta';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import { formatTime } from '../../../utils/format';
import { AxiosResponse } from 'axios';
import { userInfo } from 'os';

type Prop = {
    history: History;
    location: Location;
    match: match<{id: string}>;
}

type State = Readonly<{
    userInfo?: ResponseUserInfo;
    changed?: boolean;
    originUserInfo?: ResponseUserInfo;
    publishNumber: number;
    downNumber: number;
    arrearNumber: number;
    collectionNumber: number;
    browseNumber: number;
    sysCloseNumber: number;
    searchLoading: boolean;
    search: string;
    searchList: ResponseUserInfo[];
}>

class UserDetail extends Component<Prop, State> {

    readonly state: State = {
        publishNumber: 0,
        downNumber: 0,
        arrearNumber: 0,
        collectionNumber: 0,
        browseNumber: 0,
        sysCloseNumber: 0,
        searchLoading: false,
        search: '',
        searchList: []
    }

    renderInfo(userInfo: ResponseUserInfo | undefined) {
        if (userInfo) {
            const gridStyle: CSSProperties = {
                height: 100
            }
            const { changed, publishNumber, downNumber, arrearNumber, collectionNumber, browseNumber, sysCloseNumber } = this.state
            return (
                <Row gutter={14}>
                    <Col span={16}>
                        <Card
                            title={
                                <div className="user">
                                    <Avatar src={userInfo.avatarUrl} icon="user" />
                                    <span style={{marginLeft: 10}}>{userInfo.realName + (userInfo.gender === 1 ? '先生' : '女士')}</span>
                                </div>
                            }
                            actions={[
                                <Button disabled={!changed} onClick={() => this.backOriginUserInfo()} type="default">还原数据</Button>,
                                <Button disabled={!changed} onClick={() => this.saveUserInfo()} type="primary">保存修改</Button>
                            ]}
                        >
                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="昵称"
                                    description={userInfo.nickName}
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Statistic title="账户余额" value={userInfo.balance || 0} suffix="元" />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="是否启用"
                                    description={
                                        <Switch 
                                            onChange={(e) => {
                                                this.changeUserInfo({
                                                    state: e ? 0 : 1
                                                })
                                            }}
                                            checked={userInfo.state === 0}
                                            // defaultChecked={userInfo.state === 0}
                                        />
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="角色"
                                    description={ 
                                        <RadioGroup
                                            onChange={(e) => { 
                                                this.changeUserInfo({
                                                    type: e.target.value
                                                })
                                            }}
                                            defaultValue={userInfo.type}
                                            value={userInfo.type}
                                        >
                                            <RadioButton value={1}>房东</RadioButton>
                                            <RadioButton value={2}>中介</RadioButton>
                                            <RadioButton value={3}>推广</RadioButton>
                                        </RadioGroup>
                                    }
                                />
                            </Card.Grid>
                            
                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="性别"
                                    description={
                                        <RadioGroup 
                                            onChange={(e) => { 
                                                this.changeUserInfo({
                                                    gender: e.target.value
                                                })
                                            }}
                                            value={userInfo.gender}
                                            defaultValue={userInfo.gender}
                                        >
                                            <RadioButton value={1}>男</RadioButton>
                                            <RadioButton value={0}>女</RadioButton>
                                        </RadioGroup>
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="发布需要审核"
                                    description={
                                        <Switch
                                            checked={userInfo.isNeedCheck !== 0}
                                            onChange={(e) => {
                                                this.changeUserInfo({
                                                    isNeedCheck: e ? 1 : 0
                                                })
                                            }}
                                        />
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="所在地区"
                                    description={userInfo.country + userInfo.province}
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="注册日期"
                                    description={formatTime(userInfo.rawAddTime)}
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="更新日期"
                                    description={userInfo.rawUpdateTime ? formatTime(userInfo.rawUpdateTime) : '从未更新'}
                                />
                            </Card.Grid>
                    
                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="手机"
                                    description={
                                        <Input
                                            type="number"
                                            placeholder="手机号码"
                                            onInput={(e) => {
                                                const phone = (e.target as HTMLInputElement).value
                                                this.changeUserInfo({
                                                    phone
                                                })
                                            }}
                                            value={userInfo.phone}
                                        />
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="备用手机"
                                    description={
                                        <Input
                                            minLength={11}
                                            maxLength={11}
                                            type="number"
                                            value={userInfo.sparePhone}
                                            placeholder="备用手机号码"
                                            onInput={(e) => {
                                                this.changeUserInfo({
                                                    sparePhone: (e.target as HTMLInputElement).value
                                                })
                                            }}
                                            // defaultValue={userInfo.sparePhone}
                                        />
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="账目流水"
                                    description={
                                        <Link to={`/admin/user/${userInfo.id}/cashflow.html?avatarUrl=${userInfo.avatarUrl}&nickName=${userInfo.realName + (userInfo.gender === 1 ? "先生" : "女士")}&auditStatus=${0}`}>查看流水</Link>
                                    }
                                />
                            </Card.Grid>

                            {
                                userInfo.type === 3 ?
                                (
                                    <Card.Grid style={gridStyle}>
                                        <Card.Meta
                                            title="客户列表"
                                            description={
                                                <Link to={`/admin/user/${userInfo.id}/customer-list.html`}>查看客户</Link>
                                            }
                                        />
                                    </Card.Grid>
                                ) :
                                (
                                    <Card.Grid style={gridStyle}>
                                        <Card.Meta
                                            title={
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between"
                                                }}>
                                                    <span>所属推广人</span>
                                                    <Button size="small" onClick={() => {
                                                        if (userInfo.parentId) {
                                                            this.props.history.push(`/admin/user/${userInfo.parentId}.html`)
                                                        } else {
                                                            Modal.warn({
                                                                title: '提示',
                                                                content: '该用户，未绑定推广人！'
                                                            })
                                                        }
                                                    }}>查看</Button>
                                                </div>
                                            }
                                            description={
                                                <Select
                                                    showSearch
                                                    value={this.state.search || userInfo.parentId}
                                                    placeholder={'搜索推广专员'}
                                                    loading={this.state.searchLoading}
                                                    style={{width: '100%'}}
                                                    filterOption={false}
                                                    onSearch={(e) => {
                                                        const params: any = {};
                                                        if (e) {
                                                            params.search = e
                                                        }
                                                        this.searchParentList(params);
                                                    }}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            search: e as string
                                                        })
                                                        this.changeUserInfo({
                                                            parentId: e as number
                                                        })
                                                    }}
                                                >
                                                    {
                                                        this.state.searchList.map((k) => {
                                                            return (
                                                                <Select.Option key={k.id} value={k.id}>{k.realName}</Select.Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            }
                                        />
                                    </Card.Grid>
                                )
                            }

                            
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            title="统计"
                        >
                            <Card.Grid>
                                <Link to={`/admin/user/${userInfo.id}/houses.html?avatarUrl=${userInfo.avatarUrl}&nickName=${userInfo.realName + (userInfo.gender === 1 ? "先生" : "女士")}&auditStatus=${0}`}>
                                    <Statistic valueStyle={ publishNumber >  0 ? {color: '#1890ff', cursor: "pointer"} : {}} title="正上架中房源" value={publishNumber} suffix="条" />
                                </Link>
                            </Card.Grid>
                            
                            <Card.Grid>
                                <Link to={`/admin/user/${userInfo.id}/houses.html?avatarUrl=${userInfo.avatarUrl}&nickName=${userInfo.realName + (userInfo.gender === 1 ? "先生" : "女士")}&auditStatus=${2}`}>
                                    <Statistic valueStyle={ downNumber >  0 ? {color: '#1890ff', cursor: "pointer"} : {}} title="用户下架房源" value={downNumber} suffix="条" />
                                </Link>
                            </Card.Grid>

                            <Card.Grid>
                                <Link to={`/admin/user/${userInfo.id}/houses.html?avatarUrl=${userInfo.avatarUrl}&nickName=${userInfo.realName + (userInfo.gender === 1 ? "先生" : "女士")}&auditStatus=${1}`}>
                                    <Statistic valueStyle={ arrearNumber >  0 ? {color: '#1890ff', cursor: "pointer"} : {}} title="欠费下架房源" value={arrearNumber} suffix="条" />
                                </Link>
                            </Card.Grid>

                            <Card.Grid>
                                <Link to={`/admin/user/${userInfo.id}/houses.html?avatarUrl=${userInfo.avatarUrl}&nickName=${userInfo.realName + (userInfo.gender === 1 ? "先生" : "女士")}&auditStatus=${3}`}>
                                    <Statistic valueStyle={ sysCloseNumber >  0 ? {color: '#1890ff', cursor: "pointer"} : {}} title="后台关闭房源" value={sysCloseNumber} suffix="条" />
                                </Link>
                            </Card.Grid>

                            <Card.Grid>
                                <Statistic title="已收藏" value={collectionNumber} suffix="条" />
                            </Card.Grid>

                            <Card.Grid>
                                <Statistic title="已浏览" value={browseNumber} suffix="条" />
                            </Card.Grid>
                        </Card>
                    </Col>
                </Row>
            )
        }
    }

    searchParentList(params: any = {}) {
        this.setState({
            searchLoading: true
        })
        http.get('/users/queryUserPage', {
            params
        }).then((res: AxiosResponse<UserList>) => {
            const { success, data } = res.data
            if (success) {
                const { records } = data
                this.setState({
                    searchLoading: false,
                    searchList: records.filter(item => item.type === 3)
                })
            } else {
                this.setState({
                    searchLoading: false
                })
            }
        })
    }

    diffUserInfo() {
        let changed = false
        const { userInfo, originUserInfo } = this.state
        if (userInfo && originUserInfo) {
            for(const item in userInfo) {
                if (userInfo[item as keyof ResponseUserInfo] !== originUserInfo[item as keyof ResponseUserInfo]) {
                    changed = true
                    break;
                }
            }
        }
        this.setState({changed})
    }

    changeUserInfo(userInfo: { [K in keyof ResponseUserInfo]?: ResponseUserInfo[K] }) {
        if (userInfo.phone) {
            if (userInfo.phone.length > 11) {
                userInfo.phone = (this.state.userInfo as any).phone
            }
        }

        if (userInfo.sparePhone) {
            if (userInfo.sparePhone.length > 11) {
                userInfo.sparePhone = (this.state.userInfo as any).sparePhone
            }
        }

        this.setState({
            userInfo: {
                ...this.state.userInfo,
                ...userInfo as ResponseUserInfo
            }
        }, () => {
            this.diffUserInfo()
        })
    }

    backOriginUserInfo() {
        this.setState({
            userInfo: Object.assign({}, this.state.originUserInfo),
            changed: false
        })
    }

    saveUserInfo() {
        const { userInfo } = this.state
        if (userInfo && userInfo.phone && userInfo.phone.length !== 11) {
            return notification.error({
                message: '错误',
                description: '手机长度不正确'
            })
        }
        if (userInfo && userInfo.sparePhone && userInfo.sparePhone.length !== 11) {
            return notification.error({
                message: '错误',
                description: '备用手机长度不正确'
            })
        }
        http
            .post('/users/update', userInfo)
            .then((res) => {
                const { success, message } = res.data
                if (success) {
                    notification.success({
                        message: '提示',
                        description: '用户已修改'
                    })
                    this.setState({
                        originUserInfo: Object.assign({}, this.state.userInfo),
                        changed: false 
                    })
                } else {
                    notification.error({
                        message: '提示',
                        description: message
                    })
                }
            })
            
    }
    
    render() {
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={'/admin/user/list.html'}>用户管理</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>查看详情</Breadcrumb.Item>
                </Breadcrumb>
                
                <div className="content" style={{background: '#f1f1f1', padding: 0}}>
                    <div className="user-info">
                        {this.renderInfo(this.state.userInfo)}
                    </div>
                </div>
            </div>
        )
    }

    componentWillMount() {
        this.getUserInfo()
    }

    componentDidUpdate(nextProp: Prop) {
        if (this.props.match.params.id !== nextProp.match.params.id) {
            this.getUserInfo();
        }
    }

    getUserInfo() {
        http
            .get(`/users/queryUser?id=${this.props.match.params.id}`)
            .then((res) => {
                const data: ResponseUserInfo = res.data.data
                this.setState({
                    userInfo: data,
                    originUserInfo: JSON.parse(JSON.stringify(data))
                }, () => {
                    this.getUserPublishCount()
                    if (data.parentId) {
                        this.searchParentList({
                            type: 3,
                            id: data.parentId
                        })
                    }
                })
            })
    }

    getUserPublishCount() {
        const { userInfo } = this.state
        if (userInfo) {
            Promise.all([
                http.get(`/housingResources/queryPageHouses`, {
                    params: {
                        releaseId: userInfo.id,
                        size: 0,
                        auditStatus: 0
                    }
                }),
                http.get(`/housingResources/queryPageHouses`, {
                    params: {
                        releaseId: userInfo.id,
                        size: 0,
                        auditStatus: 1
                    }
                }),
                http.get(`/housingResources/queryPageHouses`, {
                    params: {
                        releaseId: userInfo.id,
                        size: 0,
                        auditStatus: 2
                    }
                }),
                http.get(`/housingResources/queryPageHouses`, {
                    params: {
                        releaseId: userInfo.id,
                        size: 0,
                        auditStatus: 3
                    }
                }),
                http.get(`/collection/queryPageCollectionVo`, {
                    params: {
                        userId: userInfo.id,
                        size: 1
                    }
                }),
                http.get(`/browse/queryPageBrowseVo`, {
                    params: {
                        userId: userInfo.id,
                        size: 1
                    }
                }),
            ]).then((results) => {
                const result = results.map((item, index) => {
                    const { success, data } = item.data
                    if (success) return data.total
                })
                this.setState({
                    publishNumber: result[0],
                    arrearNumber: result[1],
                    downNumber: result[2],
                    sysCloseNumber: result[3],
                    collectionNumber: result[4],
                    browseNumber: result[5]
                })
            })
        }
    }

}

export default UserDetail

interface ResponseUserInfo {
  id: number;
  deleted: boolean;
  rawAddTime: string;
  rawUpdateTime: string;
  userName?: any;
  password?: any;
  openid: string;
  wechatNumber?: any;
  nickName: string;
  region?: any;
  phone: string;
  sparePhone?: any;
  realName: string;
  gender: number;
  type: number;
  state: number;
  avatarUrl: string;
  city: string;
  country: string;
  language: string;
  province: string;
  balance: number;
  isNeedCheck: number;
  parentId?: number;
  code?: any;
  sms?: any;
}

type UserList = BaseResponse<{
    current: number;
    pages: number;
    records: ResponseUserInfo[];
    size: number;
    total: number;
}>