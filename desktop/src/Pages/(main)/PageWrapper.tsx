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
import { useGlobalContext } from '@/Context/GlobalProvider';
import { logout } from '@/utils/AuthService';

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
    getItem('Upcoming', '/upcoming'),
    getItem('Successful', '/successful'),
    getItem('All reservations', '/all-reservation'),
  ]),
  getItem('Settings', '/settings', <SettingOutlined />),
];

const PageWrapper = ({children} : {children: React.ReactElement}) => {
  
    const { user } = useGlobalContext();
    const navigate = useNavigate();
    const pathname = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer, borderRadiusLG,  },
    } = theme.useToken();
    const path = pathname.pathname; // Make sure this is correctly set up
    const [selectedKey, setSelectedKey] = useState(path);
    const [openKeys, setOpenKeys] = useState<string[]>(selectedKey === '/upcoming' || selectedKey === '/successful' || selectedKey === '/all-reservation' ? ['sub1'] : []);

    const handleClick = (e: any) => {
        navigate(e.key);
    };

    const logoutFunc = () => {
      logout()
        .then(() => {
          window.location.href = '/'
        })
    }


    return (
        <Layout className='min-h-[100vh]'>
            <Sider trigger={null} className='select-none' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                {collapsed ? null : (
                    <div className='flex flex-row items-center px-5 justify-evenly space-x-2 py-4 bg-[#001615]'>
                        <>
                            <Image src={require('./../../../assets/logo.jpg')} className='rounded-full' width={40} preview={false}  />
                            <div className='flex flex-col items-start text-[#BC7B5C] tracking-wide'>
                                <span className='uppercase text-lg font-black'>Coconut</span>
                                <span className='uppercase text-lg font-black'>Campsite</span>
                            </div>    
                        </>
                    </div>
                )}
                {/* MENU */}
                <Menu className='px-2 font-semibold' onClick={handleClick} defaultOpenKeys={openKeys} defaultSelectedKeys={[selectedKey]} mode="inline" items={items} rootClassName='pt-6'/> 
                <div className='absolute bottom-0 w-full flex flex-col items-center py-5 px-5'>
                  {!collapsed ? (
                    <div onClick={logoutFunc} className='flex flex-row items-center justify-center space-x-3 bg-[#ff0000b0] w-full py-2 rounded-xl transition-all ease-in-out  hover:scale-105 hover:bg-[#b83737]'>
                      <LogoutOutlined className='text-white text-xl'/>
                      <span className='text-md font-bold text-white'>Logout</span>
                    </div>

                  ) : (
                    <LogoutOutlined onClick={logoutFunc} className='text-2xl text-[#ff0000b0] transition-all ease-in-out hover:scale-125 hover:bg-[#fd414134] rounded-xl p-2'/>
                  )}
                </div>     
            </Sider>
            <Layout>
                <Header className='bg-white px-6 py-6 flex flex-row items-center justify-between border-slate-200 border-b-2'>
                    <GiHamburgerMenu onClick={() => setCollapsed(!collapsed)} className={`text-2xl transition-all ease-in-out hover:scale-125 ${collapsed ? 'rotate-90' : 'rotate-0'}`}/>           
                    
                    <div className='flex flex-row items-center space-x-3 select-none'>
                        <UserOutlined className='text-xl text-white bg-slate-600 rounded-full p-2'/>
                        <span className='text-lg'>{`${user?.first_name} ${user?.last_name}`}</span>
                    </div>
                </Header>

                <Content className='bg-[#dfdede] overflow-hidden'>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default PageWrapper