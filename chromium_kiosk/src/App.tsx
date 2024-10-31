import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalProvider from './Context/GlobalProvider';
import { ConfigProvider } from 'antd';
import NotFound from './Pages/NotFound';
import ProtectedRoutes from './ProtectedRoutes';
import Dashboard from './Pages/(protected)/Dashboard';
import SettingUp from './Pages/(protected)/SettingUp';
import Login from './Pages/(public)/Login';

function App() {
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
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/setting-up/:id" element={<SettingUp />} />
            </Route>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </GlobalProvider>
  );
}

export default App;
