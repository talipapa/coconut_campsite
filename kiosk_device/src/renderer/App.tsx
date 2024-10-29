import { MemoryRouter as Router, Routes, Route, useNavigate, HashRouter } from 'react-router-dom';
import "tailwindcss/tailwind.css";
import ProtectedRoutes from './ProtectedRoutes';
import Dashboard from '../Pages/(main)/Dashboard';
import GlobalProvider from '../Context/GlobalProvider';
import Login from '../Pages/(auth)/Login';
import { ConfigProvider } from 'antd';
import SettingUp from '@/Pages/(main)/SettingUp';
import Notfound from '@/Pages/Notfound';

export default function App() {
  return (
    <GlobalProvider>
      <ConfigProvider theme={{
        components: {
          Layout: {
            siderBg: '#5CBCB6',
            triggerBg: '#000000',
          },
          Menu: {
            colorBgContainer: '#5CBCB6',
            itemSelectedBg: '#BC7B5C',
            itemSelectedColor: '#ffffff',
            itemHoverBg: '#BC7B5C',
            itemHoverColor: '#ffffff',
          }
        }
      }}>
        <HashRouter>
          <Routes>
            <Route path='*' element={<Notfound/>} />
            <Route element={<ProtectedRoutes/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/setting-up/:id" element={<SettingUp />} />
            </Route>
            <Route path="/" element={<Login />} />
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </GlobalProvider>
  );
}
