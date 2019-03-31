import React, { Component, CSSProperties } from 'react'
import '../common.less'
import { Breadcrumb, Row, Col, Avatar, Card, Switch, Input, Radio, Icon, Button, message, notification, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { match } from 'react-router';
import { Location, History } from 'history';
import http from '../../../utils/http';
import Meta from 'antd/lib/card/Meta';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';

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
}>

class UserDetail extends Component<Prop, State> {

    readonly state: State = {
        publishNumber: 0,
        downNumber: 0,
        arrearNumber: 0,
        collectionNumber: 0,
        browseNumber: 0
    }

    renderInfo(userInfo: ResponseUserInfo | undefined) {
        if (userInfo) {
            const gridStyle: CSSProperties = {
                height: 100
            }
            const { changed, publishNumber, downNumber, arrearNumber, collectionNumber, browseNumber } = this.state
            return (
                <Row gutter={14}>
                    <Col span={16}>
                        <Card
                            title={
                                <div className="user">
                                    <Avatar src={userInfo.avatarUrl} />
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
                                <Card.Meta
                                    title="账户余额"
                                    description={userInfo.balance || 0}
                                />
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
                                        >
                                            <RadioButton value={1}>房东</RadioButton>
                                            <RadioButton value={2}>中介</RadioButton>
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
                                            defaultValue={userInfo.gender}
                                        >
                                            <RadioButton value={1}>男</RadioButton>
                                            <RadioButton value={2}>女</RadioButton>
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
                                    description={new Date(userInfo.rawAddTime).toLocaleDateString()}
                                />
                            </Card.Grid>

                            <Card.Grid style={gridStyle}>
                                <Card.Meta
                                    title="更新日期"
                                    description={userInfo.rawUpdateTime ? new Date(userInfo.rawUpdateTime).toLocaleDateString() : '从未更新'}
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
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            title="统计"
                            onClick={() => {
                                if (publishNumber > 0)
                                this.props.history.push(`/admin/house/list/${userInfo.id}.html`)
                            }}
                        >
                            <Card.Grid>
                                <Statistic valueStyle={ publishNumber >  0 ? {color: '#1890ff', cursor: "pointer"} : {}} title="正上架中房源" value={publishNumber} suffix="条" />
                            </Card.Grid>
                            <Card.Grid>
                                <Statistic title="用户下架房源" value={downNumber} suffix="条" />
                            </Card.Grid>
                            <Card.Grid>
                                <Statistic title="欠费下架房源" value={arrearNumber} suffix="条" />
                            </Card.Grid>

                            <Card.Grid>
                                <Statistic title="收藏数量" value={collectionNumber} suffix="条" />
                            </Card.Grid>

                            <Card.Grid>
                                <Statistic title="历史记录" value={browseNumber} suffix="条" />
                            </Card.Grid>
                        </Card>
                    </Col>
                </Row>
            )
        }
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

    getUserInfo() {
        http
            .get(`/users/queryUser?id=${this.props.match.params.id}`)
            .then((res) => {
                const data = res.data.data
                this.setState({
                    userInfo: data,
                    originUserInfo: JSON.parse(JSON.stringify(data))
                }, () => {
                    this.getUserPublishCount()
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
                    downNumber: result[1],
                    arrearNumber: result[2],
                    collectionNumber: result[3],
                    browseNumber: result[4]
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
  code?: any;
  sms?: any;
}