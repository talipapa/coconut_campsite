'use client'

import React from 'react'
import { Button, QRCode, Space, Alert } from 'antd';

function doDownload(url, fileName) {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const QrCard = ({id}) => {
    // console.log(id)

    const downloadCanvasQRCode = () => {
        const canvas = document.getElementById('bookingqr')?.querySelector('canvas');
        if (canvas) {
          const url = canvas.toDataURL();
          doDownload(url, 'QRCode.png');
        }
    };

    
  return (
    <div className="w-full flex flex-col space-y-5 bg-white shadow-lg p-7 rounded-2xl divide-y-2 items-center">
      <Space id="bookingqr" direction="vertical" className="w-full">
        <div className="w-full flex flex-col items-center space-y-4">
          <QRCode
            value={id}
          />
          <Alert
            message="Important note!"
            description="Download the QR code and scan it at the entrance of the campsite. Ask for assistance if you have trouble scanning the QR code."
            type="info"
            showIcon
          />
          <Button className="w-full" type="primary" onClick={downloadCanvasQRCode}>Download QR</Button>
        </div>
      </Space>
    </div>
  )
}

export default QrCard