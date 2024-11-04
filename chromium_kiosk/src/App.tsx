import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalProvider from './Context/GlobalProvider';
import { ConfigProvider } from 'antd';
import NotFound from './Pages/NotFound';
import Dashboard from './Pages/(protected)/Dashboard';
import Login from './Pages/(public)/Login';
import LogBook from './Pages/(protected)/LogBook';

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logbook/:id" element={<LogBook />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </GlobalProvider>
  );
}

export default App;
