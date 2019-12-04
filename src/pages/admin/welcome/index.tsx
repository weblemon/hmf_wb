import React, { PureComponent } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import ReactEcharts  from 'echarts-for-react';
import http from '../../../utils/http';

class Welcome extends PureComponent<Props, State> {
    public readonly state: State = {
        userRegisterCount: [],
        houseUpList: []
    };
    public componentWillMount() {
        this.getUserCount()
    }
    public render() {
        return (
            <div className="admin-child-page">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to={'/admin/'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>欢迎</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content">
                <ReactEcharts
                    style={{
                        height: '100%'
                    }}
                    option={{
                        title: {
                            text: '一周数据分析'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['用户注册', '用户房源发布数量', '用户房源下架数量']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: ['周一','周二','周三','周四','周五','周六','周日']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name:'用户注册',
                                type:'line',
                                stack: '总量',
                                data: this.state.userRegisterCount
                            },
                            {
                                name:'用户房源发布数量',
                                type:'line',
                                stack: '总量',
                                data: this.state.houseUpList
                            }
                        ]
                    }}
            />
                </div>
            </div>
        )
    }
    private getUserList(params: QueryDatas) {
        return http.get('/users/queryUserPage', {
            params: {
                ...params,
                size: 1
            }
        })
    }
    private getHouseList(params: QueryDatas) {
        return http.get('/housingResources/queryPageHouses', {
            params: {
                ...params,
                size: 1
            }
        })
    }
    private getUserCount() {
        const now = new Date();
        const oneDay = 1000 * 60 * 60 * 24;
        const days = (now.getDay() - 1) * oneDay;
        const startDay = now.getTime() - days;
        const times = [0, 1, 2, 3, 4, 5, 6].map((item) => {
            const d = new Date(startDay + item * oneDay);
            const m = d.getMonth();
            const date = d.getDate();
            return `${d.getFullYear()}-${m < 10 ? `0${m + 1}` : m}-${date < 10 ? `0${date}` : date}`;
        });

        Promise.all(times.map((k) => {
            return this.getUserList({
                startAddTime: k,
                endAddTime: k
            })
        })).then((datas) => {
            const userRegisterCount = datas.map((k) => k.data.data.total);
            this.setState({
                userRegisterCount
            })
        });

        Promise.all(times.map((k) => {
            return this.getHouseList({
                startAddTime: k,
                auditStatus: 0,
                endAddTime: k
            })
        })).then((datas) => {
            const houseUpList = datas.map((k) => k.data.data.total);
            this.setState({
                houseUpList
            })
        })
    }
}
export default Welcome

type Props = OwnProps;
interface OwnProps {}
type State = Readonly<{
    userRegisterCount: number[];
    houseUpList: number[];
}>
export interface QueryDatas {
    startAddTime: string;
    endAddTime?: string;
    auditStatus?: number;
}