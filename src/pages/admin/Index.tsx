import React, { Component } from 'react'
import './index.less';
import { connect, DispatchProp } from 'react-redux';
import { UserState } from '../../store/reducers/user';
import { Location, History } from 'history';
import  {Route, Switch, Redirect, Link } from 'react-router-dom';
import Welcome from './welcome';
import { Layout, Menu, Icon, Dropdown, Button, Modal, Form, Input, notification } from 'antd';
import UserList from './user/UserList';
import HouseList from './house/HouseList';
import { SetAuthorizationAction, AdminActionTypes } from '../../store/reducers/user/action';
import homeMenu, { HomeMenuItem } from '../constants/homeMenu';
import PriceRule from './setting/PriceRule';
import UserDetail from './user/UserDetail';
import HouseDetail from './house/HouseDetail';
import UserHouseList from './user/UserHouseList';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import http from '../../utils/http';
import UserCashFlow from './user/UserCashFlow';
import NotFound from './NotFound';

interface Prop extends DispatchProp {
    form: WrappedFormUtils;
    user: UserState; 
    location: Location;
    history: History;
    logOut: () => void;
}

type State = Readonly<{
    showChangePasswdModal: boolean;
    changePasswdModalConfirmLoading: boolean;
}>

export class AdminIndex extends Component<Prop, State> {
    readonly state: State = {
        showChangePasswdModal: false,
        changePasswdModalConfirmLoading: false
    }

    componentWillMount() {
        if (!this.props.user.Authorization) {
            return this.props.history.replace('/login.html')
        }
        if (this.props.location.pathname === '/admin') {
            this.props.history.replace('/admin/')
        }

        /**
         * 拦截响应内容
         */
        http.interceptors.response.use((response) => {
            // 处理收到的响应结果
            // response.data
            if (response.data.code === '-1' && localStorage.getItem('authorization')) {
                this.props.history.replace('/login.html')
                this.props.logOut()
                notification.error({
                    message: '登录过期',
                    description: '登录过期，请重新登录。'
                })
            }
            return response
        })

    }

    renderMenu(menu: HomeMenuItem[] | undefined) {
        if (!Array.isArray(menu)) return;
        return menu.map((item, index) => {
            if (item.type === 0) {
                return (
                    <Menu.SubMenu
                        key={item.id}
                        title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}
                    >
                        {this.renderMenu(item.children)}
                    </Menu.SubMenu>
                )
            } else {
                return (
                    <Menu.Item
                        key={item.id}
                    >
                        <Link to={item.url as string}>
                            {item.icon.length > 0 ? <Icon type={item.icon} /> : ''}
                            {item.name}                        
                        </Link>
                    </Menu.Item>
                )
            }
        })
    }

    render() {
        const { showChangePasswdModal, changePasswdModalConfirmLoading } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <Layout className='admin'>
                <Layout.Header className='admin-header'>
                    <div className="logo">
                        <Link to="/" >卖房侠后台管理系统</Link>
                    </div>

                    <div className="user">
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item 
                                onClick={() => {
                                    this.setState({
                                        showChangePasswdModal: true
                                    })
                                }} key="2"><Icon type="lock" />修改密码</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item onClick={() => { 
                                    this.props.logOut();
                                    this.props.history.replace('/login.html')
                                }} key="1"><Icon type="logout" />安全退出</Menu.Item>
                          </Menu>
                        }>
                            <Button style={{ marginLeft: 8 }}>
                                管理员 <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </div>
                </Layout.Header>
                <Layout>
                    <Layout.Sider
                        width={200}
                    >
                        <Menu
                            mode='inline'
                            theme="dark"
                        >
                            {this.renderMenu(homeMenu)}
                        </Menu>
                    </Layout.Sider>
                    <Layout.Content className={'admin-content'}>
                        <Switch>
                            <Redirect exact path={'/admin/'} to={'/admin/welcome.html'} />
                            <Route exact path={'/admin/welcome.html'} component={Welcome} />
                            <Route exact path={'/admin/user/list.html'} component={UserList} />
                            <Route exact path={'/admin/user/:id.html'} component={UserDetail} />
                            <Route exact path={'/admin/house/list.html'} component={HouseList} />
                            <Route exact path={'/admin/house/:id.html'} component={HouseDetail} />
                            <Route exact path={'/admin/user/:id/houses.html'} component={UserHouseList} />
                            <Route exact path={'/admin/user/:id/cashflow.html'} component={UserCashFlow} />
                            <Route exact path={'/admin/setting/price-rule.html'} component={PriceRule} />
                            <Route exact path={'/admin/404.html'} component={NotFound}></Route>
                            <Redirect to={'/admin/404.html'}></Redirect>
                        </Switch>
                    </Layout.Content>
                </Layout>
                <Modal
                    title="修改密码"
                    visible={showChangePasswdModal}
                    confirmLoading={changePasswdModalConfirmLoading}
                    onCancel={() => {
                        this.setState({
                            showChangePasswdModal: false
                        })
                        this.props.form.resetFields()
                    }}
                    onOk={() => {
                        this.props.form.validateFields((e, v) => {
                            if (!e) {
                                this.setState({
                                    changePasswdModalConfirmLoading: true
                                })
                                http.post('/users/update', {
                                    password: v.password
                                }).then((res) => {
                                    const { success, message } = res.data
                                    if (success) {
                                        Modal.info({
                                            title: '密码已修改',
                                            content: '修改密码后需要重新登录！',
                                            onOk: () => {
                                                this.props.logOut()
                                                this.props.history.replace('/login.html')
                                            }
                                        })
                                        
                                        notification.success({
                                            message: '提示',
                                            description : '密码修改成功'
                                        })
                                    } else  {
                                        notification.error({
                                            message: '提示',
                                            description : message
                                        })
                                    }
                                    this.setState({
                                        changePasswdModalConfirmLoading: false
                                    })
                                }).catch(e => {
                                    notification.error({
                                        message: '提示',
                                        description : '修改失败，请重试。'
                                    })
                                })
                            }
                        })
                    }}
                >
                    <Form ref="changepwd">
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '密码必须'
                                        },
                                        {
                                            min: 6,
                                            message: '密码不能小于6位'
                                        },
                                        {
                                            max: 16,
                                            message: '密码不能大于16位'
                                        },
                                        {
                                            validator: (v, value, c) => {
                                                const pwd = this.props.form.getFieldValue('repassword')
                                                const repasswordError = this.props.form.getFieldError('repassword')
                                                if (pwd === value) {
                                                    if (repasswordError) {
                                                            this.props.form.validateFields(['repassword'])
                                                    }
                                                    c()
                                                } else {
                                                    c(true)
                                                }
                                                
                                            },
                                            message: '两次密码输入不一致'
                                        }
                                    ]
                                })(
                                    <Input allowClear type="password" addonBefore="输入密码" />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                             getFieldDecorator('repassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '确认密码密码必须'
                                    },
                                    {
                                        min: 6,
                                        message: '密码不能小于6位'
                                    },
                                    {
                                        max: 16,
                                        message: '密码不能大于16位'
                                    },
                                    {
                                        validator: (v, value, c) => {
                                           const pwd = this.props.form.getFieldValue('password')
                                           const repasswordError = this.props.form.getFieldError('password')
                                           if (pwd === value) {
                                               if (repasswordError) {
                                                    this.props.form.validateFields(['password'])
                                               }
                                                c()
                                           } else {
                                               c(true)
                                           }
                                            
                                        },
                                        message: '两次密码输入不一致'
                                    }
                                ]
                            })(
                                <Input allowClear type="password" addonBefore="确认密码" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        )
    }
}

export default connect((state: { user: UserState }) => {
    return {
        user: state.user
    }
},(dispatch) => {
    return {
        logOut() {
            const action: SetAuthorizationAction = {
                type: AdminActionTypes.SET_AUTHORIZATION,
                Authorization: null
            };
            dispatch(action)
            localStorage.removeItem('authorization');
        }
    }
})(Form.create({name: 'changepwd'})(AdminIndex as any));