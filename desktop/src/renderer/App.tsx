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
import BookingDetails from '@/Pages/(main)/BookingDetails';
import WalkIn from '@/Pages/(main)/WalkIn';
import Scanned from '@/Pages/(main)/Scanned';
import Upcoming from '@/Pages/(main)/Upcoming';
import Noshow from '@/Pages/(main)/Noshow';

export default function App() {
  return (
    <GlobalProvider>
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#559D99',
          colorFillSecondary: "#3E5F5D",
          colorBgContainerDisabled: '#B3CCCA',
        },
        components: {
          Layout: {
            siderBg: '#56342A',
            triggerBg: '#ffffff',
          },
          Menu: {
            colorBgContainer: '#56342A',
            itemSelectedBg: '#559D99',
            itemSelectedColor: '#fbfbff',
            itemColor: '#f9f9f9',
            itemHoverBg: '#BC7B5C',
            itemHoverColor: '#ffffff',
          }
        }
      }}>
        <HashRouter>
          <Routes>
            <Route element={<ProtectedRoutes/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scanned" element={<Scanned />} />
              <Route path="/successful" element={<Successful />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/noshow" element={<Noshow />} />
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
