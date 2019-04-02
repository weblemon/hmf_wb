import React, { Component, CSSProperties } from 'react'
import '../common.less'
import './HouseDetail.less'
import { Breadcrumb, Row, Col, Card, Statistic, Carousel, Button, Avatar, Input, Radio, Select, notification, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { match } from 'react-router';
import { Location, History } from 'history';
import http from '../../../utils/http';
import { getHouseDecorationTypeName } from '../../constants/houseDecorationRange';
import { getHouseOrientationTypeName } from '../../constants/houseOrientation';
import { getHouseDoorLookTypeName } from '../../constants/houseDoorLookTypeRange';
import { getHouseElevatorTypeName } from '../../constants/houseElevatorTypeRange';
import { getHouseFloorTypeName } from '../../constants/houseFloor';
import { getHousetTypeName } from '../../constants/houseTypeRange';
import { getHouseingTypeName } from '../../constants/houseingTypeRange';
import statusRange, { getHouseStatusTypeName, getHouseStatusTypeId } from '../../constants/houseStatus';
import RadioButton from 'antd/lib/radio/radioButton';

type Prop = {
    history: History;
    location: Location;
    match: match<{id: string}>;
}

type State = Readonly<{
    houseInfo?: ResHouseData;
}>

class HouseDetail extends Component<Prop, State> {

    readonly state: State = {}

    renderInfo() {
        const { houseInfo } = this.state
        if (houseInfo) {
            const gridStyle: CSSProperties = {
                height: 100
            }
            return (
                <Row gutter={14}>
                    <Col span={14}>
                        <Card
                            title={
                                <h3>{houseInfo.houseTitle}<small style={{marginLeft: 10}}>编号：{houseInfo.id}</small></h3>
                            }
                            extra={
                                <Tooltip placement="rightTop" title={'查看用户详情'}>
                                    <Link to={`/admin/user/${houseInfo.user.id}.html`}>
                                        <Avatar src={houseInfo.user.avatarUrl} />
                                    </Link>
                                </Tooltip>
                                
                            }
                        >

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Statistic 
                                    style={gridStyle}
                                    title="价格"
                                    value={houseInfo.price || 0}
                                    suffix="万"
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Statistic 
                                    style={gridStyle}
                                    title="面积"
                                    value={houseInfo.houseArea || 0}
                                    suffix="m²"
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Statistic 
                                    style={gridStyle}
                                    title="赠送面积"
                                    value={houseInfo.houseAreaPlus || 0}
                                    suffix="m²"
                                />
                            </Card.Grid>

                            <Card.Grid
                                style={gridStyle}
                            >
                                <Card.Meta
                                    title="发布地区"
                                    description={houseInfo.province + houseInfo.city + houseInfo.area}
                                />
                            </Card.Grid>
                            
                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="装修"
                                    description={getHouseDecorationTypeName(houseInfo.houseDecoration)}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="朝向"
                                    description={getHouseOrientationTypeName(houseInfo.houseOrientation)}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="钥匙"
                                    description={getHouseDoorLookTypeName(houseInfo.houseDoorLookType)}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="电梯"
                                    description={getHouseElevatorTypeName(houseInfo.houseElevator)}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="楼层"
                                    description={getHouseFloorTypeName(houseInfo.houseFloor)}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="户型"
                                    description={getHousetTypeName(houseInfo.houseType)}
                                />
                            </Card.Grid>
                            
                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="类型"
                                    description={houseInfo.housingType ? getHouseingTypeName(houseInfo.housingType) : ''}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="发布时间"
                                    description={new Date(houseInfo.rawAddTime).toLocaleDateString()}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="更新时间"
                                    description={houseInfo.rawUpdateTime ? new Date(houseInfo.rawUpdateTime).toLocaleDateString() : '暂无更新'}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="状态"
                                    description={
                                        <Select 
                                            onChange={(e) => {
                                                http.post('/housingResources/save', {
                                                    id: houseInfo.id,
                                                    auditStatus: e
                                                })
                                                .then((res) => {
                                                    const { data, success, message } = res.data
                                                    if (success) {
                                                        this.setState({
                                                            houseInfo: {
                                                                ...houseInfo,
                                                                auditStatus: e
                                                            }
                                                        })
                                                        notification.success({
                                                            message: '提示',
                                                            description: '状态修改成功'
                                                        })
                                                    } else {
                                                        notification.error({
                                                            message: '错误',
                                                            description: message
                                                        })
                                                    }
                                                })
                                            }}
                                            value={getHouseStatusTypeName(Number(houseInfo.auditStatus))}>
                                            {
                                                statusRange.map((item, index) => {
                                                    return <Select.Option key={index} value={getHouseStatusTypeId(item)}>{item}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="发布人"
                                    description={houseInfo.user.nickName}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="发布人id"
                                    description={houseInfo.releaseId}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="发布人手机"
                                    description={houseInfo.user.phone}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="发布人称呼"
                                    description={houseInfo.user.realName + (houseInfo.user.gender === 1 ? '先生' : '女士')}
                                />
                            </Card.Grid>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card
                            title="图册"
                            style={{
                                height: 458
                            }}
                        >   
                            <Carousel 
                                swipe
                                autoplay
                            >
                                {
                                    houseInfo.housePhotos ?
                                    houseInfo.housePhotos.split(',').map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <img src={item} />
                                            </div>
                                        )
                                    }) : null
                                }
                            </Carousel>
                        </Card>
                        <Card
                            title="描述"
                            style={{
                                height: 200
                            }}
                        >
                           <p>
                               {houseInfo.houseRemarks || '无'}
                           </p>
                        </Card>
                    </Col>
                </Row>
            )
        }
        return '';
    }

    render() {
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={'/admin/house/list.html'}>房源管理</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>房源详情</Breadcrumb.Item>
                </Breadcrumb>
                
                <div className="content" style={{
                    background: '#f1f1f1',
                    padding: 0,
                    overflow: 'hidden'
                }}>
                    <div className="house-info">
                        {this.renderInfo()}
                    </div>
                </div>
            </div>
        )
    }

    componentWillMount() {
       this.getHouseInfo()
    }

    getHouseInfo() {
       http
        .get(`/housingResources/queryHousingResources?id=${this.props.match.params.id}`)
        .then(res => {
            const { success, data } = res.data
            if (success) {
                this.setState({
                    houseInfo: data
                })
            }
        })
    }

}

export default HouseDetail

interface ResHouseData {
  id: number;
  deleted: boolean;
  rawAddTime: string;
  rawUpdateTime?: any;
  houseTitle: string;
  houseArea: number;
  houseAreaPlus: number;
  houseType: string;
  houseOrientation: number;
  price: number;
  houseDoorLookType: number;
  houseDecoration: number;
  houseElevator: number;
  housingType: number;
  houseFloor: string;
  auditStatus: string;
  housePhotos: string;
  houseRemarks?: any;
  province: string;
  city: string;
  area: string;
  detailedAddress: string;
  houseLocation: HouseLocation;
  user: User;
  isCollect?: any;
  releaseId: number;
}

interface User {
  id: number;
  nickName: string;
  realName: string;
  phone: string;
  sparePhone?: any;
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