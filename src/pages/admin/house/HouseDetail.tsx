import React, { Component, CSSProperties } from 'react'
import '../common.less'
import './HouseDetail.less'
import { Breadcrumb, Row, Col, Card, Statistic, Carousel, Button, Avatar, Input, Radio, Select, notification, Tooltip, Cascader } from 'antd';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import http from '../../../utils/http';
import { getHouseDecorationTypeId } from '../../constants/houseDecorationRange';
import houseOrientation, { getHouseOrientationTypeId } from '../../constants/houseOrientation';
import houseDoorLookTypeRange, { getHouseDoorLookTypeId } from '../../constants/houseDoorLookTypeRange';
import houseElevatorTypeRange, { getHouseElevatorTypeId } from '../../constants/houseElevatorTypeRange';
import { getHouseFloorTypeName } from '../../constants/houseFloor';
import houseTypeEnum  from '../../constants/houseTypeRange';
import houseingTypeRange, { getHouseingTypeId } from '../../constants/houseingTypeRange';
import statusRange, { getHouseStatusTypeName, getHouseStatusTypeId } from '../../constants/houseStatus';
import { formatTime } from '../../../utils/format';
import houseDecorationRange from '../../constants/houseDecorationRange';
import { HouseInfo } from '../../../utils/apis/getHouseList';
import { getHouseInfo } from '../../../utils/apis/getHouseInfo';
import { getHouseClickCount } from '../../../utils/apis/getHouseClickCount';
import { getHouseCallCount } from '../../../utils/apis/getHouseCallCount';



class HouseDetail extends Component<Props, State> {

    public readonly state: State = {}
    
    public render() {
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
                    overflow: 'hidden',
                    overflowY: 'auto'
                }}>
                    <div className="house-info">
                        {this.renderInfo()}
                    </div>
                </div>
            </div>
        )
    }

    public componentWillMount() {
       this.getHouseInfo()
    }

    private renderInfo() {
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
                                        <Avatar src={houseInfo.user.avatarUrl} icon="user" />
                                    </Link>
                                </Tooltip>
                            }
                            actions={[
                                <Button disabled={JSON.stringify(houseInfo) === JSON.stringify(this.state.originData)} onClick={() => this.setState({houseInfo: this.state.originData})} type="default">还原数据</Button>,
                                <Button disabled={JSON.stringify(houseInfo) === JSON.stringify(this.state.originData)} type="primary" onClick={() => this.update()}>保存修改</Button>
                            ]}
                        >

                            <Card.Grid
                                style={gridStyle}
                            >
                                <Statistic 
                                    title="点击量"
                                    value={houseInfo.clickSum ? houseInfo.clickSum : 0}
                                    suffix="次"
                                />
                            </Card.Grid>

                            <Card.Grid
                                style={gridStyle}
                            >
                                <Statistic 
                                    title="电话拨打数量"
                                    value={houseInfo.callSum ? houseInfo.callSum : 0}
                                    suffix="次"
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="价格"
                                    style={gridStyle}
                                    description={
                                        <Input
                                            value={houseInfo.price || 0}
                                            suffix="万"
                                            onChange={(e) => {
                                                this.updateHouse({
                                                    price: Number(e.target.value)
                                                })
                                            }}
                                        />
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                {/* <Statistic 
                                    style={gridStyle}
                                    title="面积"
                                    value={houseInfo.houseArea || 0}
                                    suffix="m²"
                                /> */}
                                <Card.Meta
                                    title="面积"
                                    style={gridStyle}
                                    description={
                                        <Input
                                            value={houseInfo.houseArea || 0}
                                            suffix="m²"
                                            onChange={(e) => {
                                                this.updateHouse({
                                                    houseArea: Number(e.target.value)
                                                })
                                            }}
                                        />
                                    }
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                {/* <Statistic 
                                    style={gridStyle}
                                    title="赠送面积"
                                    value={houseInfo.houseAreaPlus || 0}
                                    suffix="m²"
                                /> */}
                                <Card.Meta
                                    title="赠送面积"
                                    style={gridStyle}
                                    description={
                                        <Input
                                            value={houseInfo.houseAreaPlus || 0}
                                            suffix="m²"
                                            onChange={(e) => {
                                                this.updateHouse({
                                                    houseAreaPlus: Number(e.target.value)
                                                })
                                            }}
                                        />
                                    }
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
                                    description={
                                        <Select
                                            style={{
                                                width: '100%'
                                            }}
                                            value={houseInfo.houseDecoration}
                                            onChange={(value: number) => {
                                                this.updateHouse({
                                                    houseDecoration: value
                                                })
                                            }}
                                        >
                                            {
                                                houseDecorationRange.map((item, index) => {
                                                    return <Select.Option key={index} value={getHouseDecorationTypeId(item)}>{item}</Select.Option>
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
                                    title="朝向"
                                    description={
                                        <Select
                                            style={{
                                                width: '100%'
                                            }}
                                            value={houseInfo.houseOrientation}
                                            onChange={(value: number) => {
                                                this.updateHouse({
                                                    houseOrientation: value
                                                })
                                            }}
                                        >
                                            {
                                                houseOrientation.map((item, index) => {
                                                    return <Select.Option key={index} value={getHouseOrientationTypeId(item)}>{item}</Select.Option>
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
                                    title="钥匙"
                                    description={
                                        <Select
                                            style={{
                                                width: '100%'
                                            }}
                                            value={houseInfo.houseDoorLookType}
                                            onChange={(value: number) => {
                                                this.updateHouse({
                                                    houseDoorLookType: value
                                                })
                                            }}
                                        >
                                            {
                                                houseDoorLookTypeRange.map((item, index) => {
                                                    return <Select.Option key={index} value={getHouseDoorLookTypeId(item)}>{item}</Select.Option>
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
                                    title="电梯"
                                    description={
                                        <Select
                                            style={{
                                                width: '100%'
                                            }}
                                            value={houseInfo.houseElevator}
                                            onChange={(value: number) => {
                                                this.updateHouse({
                                                    houseElevator: value
                                                })
                                            }}
                                        >
                                            {
                                                houseElevatorTypeRange.map((item, index) => {
                                                    return <Select.Option key={index} value={getHouseElevatorTypeId(item)}>{item}</Select.Option>
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
                                    title="楼层"
                                    description={getHouseFloorTypeName(houseInfo.houseFloor)}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="户型"
                                    description={
                                        <Cascader
                                            value={typeof houseInfo.houseType === 'string' ? houseInfo.houseType.split(',') : houseInfo.houseType}
                                            onChange={(e) => {
                                                this.updateHouse({
                                                    houseType: e as any
                                                })
                                            }}
                                            style={{
                                                width: '100%'
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
                                    }
                                />
                            </Card.Grid>
                            
                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="类型"
                                    description={
                                        <Select
                                        style={{
                                            width: '100%'
                                        }}
                                        value={houseInfo.housingType}
                                        onChange={(value: number) => {
                                            this.updateHouse({
                                                housingType: value
                                            })
                                        }}
                                        >
                                           {
                                                houseingTypeRange.map((item, index) => {
                                                    return <Select.Option key={index} value={getHouseingTypeId(item)}>{item}</Select.Option>
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
                                    title="发布时间"
                                    description={formatTime(houseInfo.rawAddTime)}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="更新时间"
                                    description={houseInfo.rawUpdateTime ? formatTime(houseInfo.rawUpdateTime) : '暂无更新'}
                                />
                            </Card.Grid>

                            <Card.Grid
                                 style={gridStyle}
                            >
                                <Card.Meta
                                    title="状态"
                                    description={
                                        <Select
                                            style={{width: '100%'}}
                                            onChange={(value: string) => {
                                                this.updateHouse({
                                                    auditStatus: value
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

    private update() {
        const houseInfo = this.state.houseInfo;
        if (!houseInfo) return;
        http.post('/housingResources/save', {
            id: houseInfo.id,
            ...this.state.changeData
        })
        .then((res) => {
            const { data, success, message } = res.data
            if (success) {
                this.setState({
                    originData: JSON.parse(JSON.stringify(this.state.houseInfo)),
                    changeData: {}
                })
                notification.success({
                    message: '提示',
                    description: '修改成功'
                })
            } else {
                notification.error({
                    message: '提示',
                    description: message
                })
            }
        })
    }

    private updateHouse(house: { [K in keyof HouseInfo]?: HouseInfo[K] }) {
        const houseInfo = this.state.houseInfo;
        if (!houseInfo) return;
        const data = {
            ...houseInfo,
            ...house
        }
        this.setState({
            houseInfo: data,
            changeData: {
                ...this.state.changeData,
                ...house
            }
        })
    }

    private getHouseInfo() {
        getHouseInfo(this.props.match.params.id).then(res => {
            const { success, data } = res.data
            if (success) {
                this.setState({
                    houseInfo: data,
                    originData: JSON.parse(JSON.stringify(data))
                }, () => {
                    this.getHouseCallCount()
                    this.getHouseClickCount()
                })
            }
        })
    }

    private getHouseClickCount() {
        getHouseClickCount(this.props.match.params.id).then(res => {
            if (this.state.houseInfo) {
                this.setState({
                    houseInfo: {
                        ...this.state.houseInfo,
                        clickSum: res.data.data
                    }
                })
            }
        })
    }

    private getHouseCallCount() {
        getHouseCallCount(this.props.match.params.id).then(res => {
            if (this.state.houseInfo) {
                this.setState({
                    houseInfo: {
                        ...this.state.houseInfo,
                        callSum: res.data.data
                    }
                })
            }
        })
    }

}

export default HouseDetail;


interface OwnProps {}
type Props = OwnProps & RouteComponentProps<{id: string}>;
type State = Readonly<{
    houseInfo?: HouseInfo & { clickSum?: number, callSum?: number };
    originData?: HouseInfo;
    changeData?: { [K in keyof HouseInfo]?: HouseInfo[K] };
}>