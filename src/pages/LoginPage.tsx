import React, { Component, FormEvent } from 'react';
import { Layout, Form, Input, Button, notification, Spin } from 'antd';
import { Location, History } from 'history';
import { connect } from 'react-redux';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import { UserState, UserInfo } from '../store/reducers/user';
import { SetUserAction, SetAuthorizationAction, AdminActionTypes } from '../store/reducers/user/action';

import Background from '../components/Background';

import './LoginPage.less';
import http, { BaseResponse } from '../utils/http';
interface IProps  {
    form: WrappedFormUtils;
    location: Location;
    history: History;
    setUser: (userInfo: UserInfo) => void;
    setAuthorization: (authorization: string) => void;
    loading: boolean;
}

class LoginPage extends Component<IProps, any> {

    readonly state = {
        spinning: false,
        loading: false,
        tms: new Date().getTime()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout className='page login'>
                <Layout.Content>
                    <Background />
                </Layout.Content>
                <Layout.Sider 
                    width={350}
                    className='sider'>
                    <div className='login-box'>
                        <Form
                            className='form'
                            onSubmit={this.handleSubmit.bind(this)}
                        >
                            <Form.Item
                                label="账号"
                            >
                                {
                                    getFieldDecorator('userName', {
                                        rules: [
                                            {
                                                required: true, message: '请输入账号!',
                                            },
                                            {
                                                max: 30,
                                                min: 3,
                                                message: '账号长度不正确'
                                            }
                                        ]
                                    })(
                                        <Input
                                            allowClear
                                        />
                                    )
                                }
                            </Form.Item>

                            <Form.Item
                                label="密码"
                            >
                                {
                                    getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true, message: '请输入密码!',
                                            },
                                            {
                                                max: 30,
                                                min: 5,
                                                message: '密码长度不正确'
                                            }
                                        ]
                                    })(
                                        <Input
                                            allowClear
                                            type='password'
                                        />
                                    )
                                }
                                
                            </Form.Item>

                            <Form.Item
                                label="验证码"
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: "space-between"
                                }}>
                                    {
                                        getFieldDecorator('sms', {
                                            rules: [
                                                {
                                                    required: true, message: '请输入验证码!',
                                                },
                                                {
                                                    len: 5,
                                                    message: '验证码长度不正确'
                                                }
                                            ]
                                        })(
                                            <Input
                                                style={{width: 120, marginRight: 20}}
                                                allowClear
                                                maxLength={6}
                                            />
                                        )
                                    }
                                    <Spin spinning={this.state.spinning}>
                                        <img onClick={(e) => this.setState({spinning: true, tms: e.timeStamp})} onLoad={() => this.setState({spinning: false})} style={{height: 32}} src={'/proxyapi/util/validateCode?userName=HousingManagement&tms=' + this.state.tms} />
                                    </Spin>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                >
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Layout.Sider>
            </Layout>
        )
    }

    handleSubmit(e: FormEvent) {
        e.persist()
        e.preventDefault()
        if (this.state.loading) return;
        this.props.form.validateFields((errors, value) => {
            if (!errors) {
                this.state.loading = true;
                http.post('/login', value).then(res => {
                    const { code, success, data, message } = res.data as BaseResponse<{ Authorization: string; userIfo: UserInfo }>
                    if (success) {
                        this.props.setUser(data.userIfo);
                        this.props.setAuthorization(data.Authorization);
                        this.props.history.replace('admin');
                    } else {
                        notification.error({
                            message: '登陆失败',
                            description: message
                        })
                        this.setState({
                            tms: Math.random()
                        })
                    }
                    this.state.loading = false
                }).catch(err => {
                    notification.error({
                        message: '错误',
                        description: '登陆失败，请重试。'
                    })
                    this.setState({
                        tms: Math.random()
                    })
                    this.state.loading = false
                })
            }
        })
    }
}

export default Form.create({name: 'login'})(
    connect(
        (state: UserState) => ({
            user: state.user
        }),
        (dispatch) => ({
            setUser(user: UserInfo) {
                const action: SetUserAction  = {
                    type: AdminActionTypes.SET_ADMIN_USER,
                    user
                }
                dispatch(action)
            },
            setAuthorization(Authorization: string) {
                const action: SetAuthorizationAction = {
                    type: AdminActionTypes.SET_AUTHORIZATION,
                    Authorization
                }
                localStorage.setItem('authorization', Authorization);
                dispatch(action)
            }
        })
    )(LoginPage)
);