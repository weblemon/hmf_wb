import React from 'react';
import Welcome from "../admin/welcome";
import UserList from "../admin/user/UserList";
import ServiceList from "../admin/service/List";
import UserDetail from "../admin/user/UserDetail";
import HouseList from "../admin/house/HouseList";
import HouseDetail from "../admin/house/HouseDetail";
import UserCommendList from "../admin/user/UserCommendList";
import UserCustomerList from "../admin/user/UserCustomerList";
import UserHouseList from "../admin/user/UserHouseList";
import UserCashFlow from "../admin/user/UserCashFlow";
import PriceRule from "../admin/setting/PriceRule";
import NotFound from "../admin/NotFound";
import LocaleSetting from "../admin/setting/LocaleRule";
import UserRuleList from "../admin/user/UserRuleList";
export const routes = [
    {
        path: '/admin/',
        component: Welcome
    },
    {
        path: '/admin/welcome.html',
        component: Welcome
    },
    {
        path: '/admin/user/:type/list.html',
        component: UserList
    },
    {
        path: '/admin/service/list.html',
        component: ServiceList
    },
    {
        path: '/admin/user/:id.html',
        component: UserDetail
    },
    {
        path: '/admin/house/list.html',
        component: HouseList
    },
    {
        path: '/admin/house/:id.html',
        component: HouseDetail
    },
    {
        path: '/admin/user/:id/commend-list.html',
        component: UserCommendList
    },
    {
        path: '/admin/user/:id/customer-list.html',
        component: UserCustomerList
    },
    {
        path: '/admin/user/:id/houses.html',
        component: UserHouseList
    },
    {
        path: '/admin/user/:id/cashflow.html',
        component: UserCashFlow
    },
    {
        path: '/admin/setting/price-rule.html',
        component: PriceRule
    },
    {
        path: '/admin/404.html',
        component: NotFound
    },
    {
        path: '/admin/setting/locale.html',
        component: LocaleSetting
    },
    {
        path: '/admin/user/:id/rule-list.html',
        component: UserRuleList
    }
];