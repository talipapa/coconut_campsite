import axios from '@/utils/auth'
import PageWrapper from './PageWrapper'
import { useGlobalContext } from '@/Context/GlobalProvider'
import { Button } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useGlobalContext()
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const navigate = useNavigate()

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
        .post('/api/kiosk/scan', { input: inputValue })
        .then((res) => {
          setResponse(res.data);
          setTimeout(() => {
            navigate(`/setting-up/${inputValue}`);
          }, 3000);
        })
        .catch((err) => {
          setResponse(err.response.data);
          setInputValue('');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500); // Adjust debounce delay as needed (e.g., 500ms)

    // Clear timeout if inputValue changes before debounce completes
    return () => clearTimeout(debounceTimeout);
  }, [inputValue, navigate]);

  return (
    <PageWrapper>
      <>
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 200 }}
        >
          {isLoading ? (
            <div className='flex flex-col items-center'>
              <span className='text-2xl font-bold text-green-700'>QR Code has been scanned!</span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                className='text-xl font-semibold'
              >
                Processing....
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
  );
};

export default Dashboard;
