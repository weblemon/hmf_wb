export interface HomeMenuItem {
    name: string;
    icon: string;
    // 0 submenu 1 menuitem
    type: 0 | 1;
    url?: string;
    id: number;
    children?: HomeMenuItem[];
}

export const homeMenu: HomeMenuItem[] = [
    {
        name: '首页',
        icon: 'home',
        url: '/admin',
        type: 1,
        id: 0
    },
    {
        id: 1,
        name: '房源管理',
        icon: 'bank',
        type: 1,
        url: '/admin/house/list.html'
    },
    {
        id: 6,
        name: '用户管理',
        icon: 'user',
        type: 1,
        url: '/admin/user/list.html'
    },
    {
        id: 7,
        name: '系统管理',
        icon: 'slack',
        type: 0,
        url: '/admin',
        children: [
            {
                id: 8,
                name: '收费规则设置',
                icon: '',
                type: 1,
                url: '/admin/setting/price-rule.html'
            }
        ]
    }
]

export default homeMenu