import React, { Component } from 'react'
import './index.less';
import { connect, DispatchProp } from 'react-redux';
import { UserState } from '../../store/reducers/user';
import { Location, History } from 'history';
import  {Route, Switch, Redirect, Link } from 'react-router-dom';
import Welcome from './welcome';
import { Layout, Menu, Icon, Dropdown, Button } from 'antd';
import UserList from './user/UserList';
import HouseList from './house/HouseList';
import { SetAuthorizationAction, AdminActionTypes } from '../../store/reducers/user/action';
import homeMenu, { HomeMenuItem } from '../constants/homeMenu';
import PriceRule from './setting/PriceRule';
import UserDetail from './user/UserDetail';
import HouseDetail from './house/HouseDetail';

interface Prop extends DispatchProp {
    user: UserState; 
    location: Location;
    history: History;
    logOut: () => void;
}

type State = Readonly<{}>

export class AdminIndex extends Component<Prop, State> {
    readonly state: State = {}

    componentWillMount() {
        if (!this.props.user.Authorization) {
            return this.props.history.replace('/login.html')
        }
        if (this.props.location.pathname === '/admin') {
            this.props.history.replace('/admin/')
        }
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
        return (
            <Layout className='admin'>
                <Layout.Header className='admin-header'>
                    <div className="logo">
                        <Link to="/" >卖房侠后台管理系统</Link>
                    </div>

                    <div className="user">
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="2"><Icon type="lock" />修改密码</Menu.Item>
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
                            <Route exact path={'/admin/setting/price-rule.html'} component={PriceRule} />
                        </Switch>
                    </Layout.Content>
                </Layout>
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
})(AdminIndex);