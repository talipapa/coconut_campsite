import { MemoryRouter as Router, Routes, Route, useNavigate, HashRouter } from 'react-router-dom';
import "tailwindcss/tailwind.css";
import ProtectedRoutes from './ProtectedRoutes';
import Dashboard from '../Pages/(main)/Dashboard';
import GlobalProvider from '../Context/GlobalProvider';
import Login from '../Pages/(auth)/Login';
import { ConfigProvider } from 'antd';
import Successful from '@/Pages/(main)/Successful';
import AllReservation from '@/Pages/(main)/AllReservation';
import Settings from '@/Pages/(main)/Settings';
import Confirmation from '@/Pages/(main)/Pending';
import BookingDetails from '@/Pages/(main)/BookingDetails';
import WalkIn from '@/Pages/(main)/WalkIn';

export default function App() {
  return (
    <GlobalProvider>
      <ConfigProvider theme={{
        components: {
          Layout: {
            siderBg: '#001d3d',
            triggerBg: '#ffffff',
          },
          Menu: {
            colorBgContainer: '#001d3d',
            itemSelectedBg: '#BC7B5C',
            itemSelectedColor: '#fbfbff',
            itemColor: '#9db4c0',
            itemHoverBg: '#BC7B5C',
            itemHoverColor: '#ffffff',
          }
        }
      }}>
        <HashRouter>
          <Routes>
            <Route element={<ProtectedRoutes/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pending" element={<Confirmation />} />
              <Route path="/successful" element={<Successful />} />
              <Route path="/all-reservation" element={<AllReservation />} />
              <Route path="/booking/:id" element={<BookingDetails />} />
              <Route path="/walkin" element={<WalkIn />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/" element={<Login />} />
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </GlobalProvider>
  );
}
