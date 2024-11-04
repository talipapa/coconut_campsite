import { Button, Divider, notification, Space } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../Context/GlobalProvider';
import PageWrapper from '../PageWrapper';
import axios from '../../Utils/auth';
import ProtectedMiddleware from './ProtectedMiddleware';

interface Iresponse {
  message: string
}

const Dashboard = () => {
  const { user, isLoggedIn } = useGlobalContext()
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<Iresponse>();
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (messageType: 'success'|'warning'|'info'|'error', title: string, body: string) => {
    api[messageType]({
      message: title,
      description: body,
      placement: 'top',
    });
  };

  
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key !== 'Enter') {
        setInputValue((prev) => prev + event.key);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  

  useEffect(() => {
    if (!inputValue) return; // Don't send request if input is empty

    const debounceTimeout = setTimeout(() => {
      setIsLoading(true);
      axios
        .post('/kiosk/scan', { 'qr_code': inputValue })
        .then((res) => {
          openNotification('success', 'Success', res.data.message);
          setResponse(res.data);
          // setTimeout(() => {
          //   navigate(`/setting-up/${inputValue}`);
          // }, 5000);
        })
        .catch((err) => {
          if (err.response.status === 404){
            openNotification('error', 'QR code not found', err.response.data.message);
          } else{
            openNotification('error', 'Please try another QR code', "QR code has already been processed");
          }         
          setInputValue('');
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 5000)
        });
    }, 500); // Adjust debounce delay as needed (e.g., 500ms)

    // Clear timeout if inputValue changes before debounce completes
    return () => clearTimeout(debounceTimeout);
  }, [inputValue, navigate]);

  return (
    <ProtectedMiddleware>
      <PageWrapper>
        <>
          {contextHolder}
          <motion.div
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 200 }}
            
          >
            {isLoading ? (
              <div className='flex flex-col items-center'>
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className='text-2xl font-semibold'
                >
                  Processing
                </motion.span>
              </div>
            ) : (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className='text-2xl font-bold'
              >
                Scanning for input...
              </motion.span>
            )}
          </motion.div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type anything..."
            className='w-[60%] hidden'
          />
        </>
      </PageWrapper>
    </ProtectedMiddleware>
  );
};

export default Dashboard;
