import React, { useContext, useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Image, Layout, Menu, theme } from 'antd';
import { GiHamburgerMenu } from "react-icons/gi";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../Context/GlobalProvider';


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '/dashboard', <PieChartOutlined />),
  getItem('Reservations', 'sub1', <UserOutlined />, [
    getItem('Pending', '/pending'),
    getItem('Successful', '/successful'),
    getItem('All reservations', '/all-reservation'),
  ]),
  getItem('Settings', '/settings', <SettingOutlined />),
];

const PageWrapper = ({children, contentClass} : {children: React.ReactElement, contentClass?: string}) => {
  
    const { user } = useGlobalContext();
    const navigate = useNavigate();
    const pathname = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer, borderRadiusLG,  },
    } = theme.useToken();
    const path = pathname.pathname; // Make sure this is correctly set up
    const [selectedKey, setSelectedKey] = useState(path);
    const [openKeys, setOpenKeys] = useState<string[]>(selectedKey === '/pending' || selectedKey === '/successful' || selectedKey === '/all-reservation' ? ['sub1'] : []);

    // const handleClick = (e: any) => {
    //     navigate(e.key);
    // };

    // const logoutFunc = () => {
    //   logout()
    //     .then(() => {
    //       window.location.href = '/'
    //     })
    // }


    return (
        <Layout className='min-h-[100vh]'>
            <Layout>
                <Content className={`bg-[#56342A] overflow-hidden flex flex-col items-center  relative py-4 ${contentClass ? contentClass : 'justify-center'}`}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default PageWrapper