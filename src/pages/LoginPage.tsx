import React, { PureComponent, FormEvent } from 'react';
import {Layout, Form, Input, Button, Spin, notification} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import Background from '../components/Background';
import './LoginPage.less';
import {RouteComponentProps} from "react-router";
import {IStore} from "../store";
import {adminUserLoginAction, AdminUserLoginResponse} from "../store/actions/admin/AdminUserAction";
import {connect} from "react-redux";
import {AxiosResponse} from "axios";

class LoginPage extends PureComponent<Props, State> {
    public readonly state: State = {
        spinning: false,
        loading: false,
        tms: new Date().getTime(),
        username: '',
        token: process.env.NODE_ENV === 'development' ? 'admin' : 'HousingManagement'
    };
    public render() {
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
                                        <img onClick={(e) => this.setState({spinning: true, tms: e.timeStamp})} onLoad={() => this.setState({spinning: false})} style={{height: 32}} src={`/proxyapi/util/validateCode?userName=${this.state.token}&tms=` + this.state.tms} />
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
    public handleSubmit(e: FormEvent) {
        e.persist();
        e.preventDefault();
        if (this.state.loading) return;
        this.props.form.validateFields((errors: any, value: any) => {
            if (!errors) {
                this.setState({
                    loading: true
                });
               const response: Promise<AxiosResponse<AdminUserLoginResponse>> = this.props.login(value) as any;
               response.then(result => {
                   const { success, message } = result.data;
                   if (success) {
                       this.props.history.push('/admin/');
                   } else {
                       notification.error({
                           message: '提示',
                           description: message
                       });
                       this.setState({
                           tms: new Date().getTime()
                       })
                   }
                   this.setState({
                       loading: false
                   })
               })
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
    login: adminUserLoginAction
};
export default connect(mapStateToProps, mapDispatchToProps)(
    Form.create({ name: 'LoginForm'})(
        LoginPage
    )
)

interface OwnProps {}
type Props = OwnProps & FormComponentProps & RouteComponentProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
type State = Readonly<{
    spinning: boolean;
    loading: boolean;
    tms: any;
    username: string;
    token: string;
}>;