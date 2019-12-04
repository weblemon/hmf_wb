import React, { PureComponent } from 'react'
import './index.less';
import { connect } from 'react-redux';
import {Route, Switch, Redirect, Link, RouteComponentProps} from 'react-router-dom';
import { Layout, Menu, Icon, Dropdown, Button, Modal, Form, Input, notification } from 'antd';
import homeMenu, { HomeMenuItem } from '../constants/homeMenu';
import {FormComponentProps} from 'antd/lib/form/Form';
import http from '../../utils/http';
import {IStore} from "../../store";
import { adminUserLogoutAction} from "../../store/actions/admin/AdminUserAction";
import {routes} from "../constants/routes";

export class AdminIndex extends PureComponent<Prop, State> {
    public readonly state: State = {
        showChangePasswordModal: false,
        changePasswordModalConfirmLoading: false,
        collapsed: false,
    };
    public componentWillMount() {
        if (!this.props.token) {
            return this.props.history.replace('/login.html')
        }
        if (this.props.location.pathname === '/admin/') {
            this.props.history.replace('/admin/welcome.html')
        }

        let isLogOut = false;
        /**
         * 拦截响应内容
         */
        http.interceptors.response.use((response) => {
            // 处理收到的响应结果
            // response.data
            if (response.data.code === '-2' || !localStorage.getItem('authorization')) {
                if (isLogOut) return response;
                this.props.history.replace('/login.html');
                this.props.logout();
                notification.error({
                    message: '提示',
                    description: '登录过期，请重新登录。'
                });
                isLogOut = true;
            }
            return response
        })
    }
    public render() {
        const { showChangePasswordModal, changePasswordModalConfirmLoading } = this.state;
        const { getFieldDecorator } = this.props.form;
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
                                            showChangePasswordModal: true
                                        })
                                    }} key="2"><Icon type="lock" />修改密码</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item onClick={() => {
                                    this.props.logout();
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
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={(e) => {
                            this.setState({
                                collapsed: e
                            })
                        }}
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
                            {
                                routes.map(item => {
                                   return (
                                       <Route exact path={item.path} component={item.component} key={item.path} />
                                   )
                                })
                            }
                            <Redirect to={'/404.html'} />
                        </Switch>
                    </Layout.Content>
                </Layout>
                <Modal
                    title="修改密码"
                    visible={showChangePasswordModal}
                    confirmLoading={changePasswordModalConfirmLoading}
                    onCancel={() => {
                        this.setState({
                            showChangePasswordModal: false
                        });
                        this.props.form.resetFields()
                    }}
                    onOk={() => {
                        this.props.form.validateFields((e, v: any) => {
                            if (!e) {
                                this.setState({
                                    changePasswordModalConfirmLoading: true
                                });
                                http.post('/users/update', {
                                    password: v.password
                                }).then((res) => {
                                    const { success, message } = res.data;
                                    if (success) {
                                        Modal.info({
                                            title: '密码已修改',
                                            content: '修改密码后需要重新登录！',
                                            onOk: () => {
                                                this.props.logout();
                                                this.props.history.replace('/login.html')
                                            }
                                        });

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
                                        changePasswordModalConfirmLoading: false
                                    })
                                }).catch(() => {
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
                                            validator: (v, value, c: any) => {
                                                const pwd = this.props.form.getFieldValue('repassword');
                                                const repasswordError = this.props.form.getFieldError('repassword');
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
                                            validator: (v, value, c: any) => {
                                                const pwd = this.props.form.getFieldValue('password');
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
    private renderMenu(menu: HomeMenuItem[] | undefined) {
        if (!Array.isArray(menu)) return;
        return menu.map((item) => {
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
                        <Link to={item.url as string} style={{overflow: "hidden"}}>
                            {item.icon.length > 0 ? <Icon type={item.icon} /> : ''}
                            {item.name}
                        </Link>
                    </Menu.Item>
                )
            }
        })
    }
}

const mapStateToProps = (state: IStore) => {
    return {
        user: state.admin.user,
        token: state.admin.Authorization,
    };
};
const mapDispatchToProps = {
    logout: adminUserLogoutAction
};
export default connect(mapStateToProps, mapDispatchToProps)(
    Form.create({ name: 'ChangePassword' })(AdminIndex)
);

type Prop = OwnProps & RouteComponentProps & FormComponentProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
interface OwnProps {}
type State = Readonly<{
    showChangePasswordModal: boolean;
    changePasswordModalConfirmLoading: boolean;
    collapsed: boolean;
}>