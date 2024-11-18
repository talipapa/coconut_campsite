'use client'


import axios from '@/lib/axios';
import { Button, Drawer, Form, Input, notification, Space } from 'antd';
import React, { useState } from 'react'
import { BsPlus } from 'react-icons/bs';
import { HiOutlineMinusCircle, HiUserAdd } from 'react-icons/hi'

const DrawerComponent = ({campersCount, reservationHolderName, bookingId, remainingLogNamesToBeSubmitted}) => {

    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification()

    const openErrorExistingNotification = () => {
        api['error']({
          message: 'Something went wrong!',
          placement: 'bottomRight',
        })
    }
      
    const openSuccessNotification = () => {
        api['success']({
          message: 'Successfully submitted!',
          placement: 'bottomRight',
          description: 'Your page will be reloaded in a few seconds',
        })
    }

    const SubmitButton= ({ form, children }) => {
      const [submittable, setSubmittable] = React.useState(false);
    
      // Watch all values
      const values = Form.useWatch([], form);
    
      React.useEffect(() => {
        form
          .validateFields({ validateOnly: true })
          .then(() => setSubmittable(true))
          .catch(() => setSubmittable(false));
      }, [form, values, campersCount, reservationHolderName]);
    
      return (
        <Button type="primary" htmlType="submit" disabled={!submittable || isButtonLoading} className='w-full h-16'>
          {children}
        </Button>
      );
    };
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
  
    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
      setOpen(false);
    };
    const onFinish = (values) => {
      axios.post(`api/v1/booking/logbook/${bookingId}`, values)
      .then((res) => {
          openSuccessNotification();
          setTimeout(() => {
            window.location.reload();
          }, 2000);      
      })
      .catch((err) => {
          openErrorExistingNotification();
      })
      .finally(() => {
          setIsButtonLoading(false);
          setOpen(false);
      })

    };

    const handleOk = () => {
      setIsButtonLoading(true);
      const payload = {...form.getFieldsValue(), price: Number(calculateSubPrice())}

    };

  return (
    <>
      {contextHolder}
      <div onClick={showDrawer} className="bg-[#256560] shadow-gray-600 shadow-lg hover:bg-[#2c7872] active:bg-[#5DBCB6] cursor-pointer select-none transition duration-100 ease-in-out  p-7 rounded-2xl">
          <div className="flex flex-row items-center space-x-3">
              <HiUserAdd className="text-2xl text-white"/>
              <h1 className="uppercase font-bold text-white">Ilagay ang pangalan ng mga kasama mo dito</h1>
          </div>
          <p className="mt-4 text-[#ecd3cc]">
              Please submit your fellow campers here
          </p>
      </div>
      <Drawer
        title="Campers name"
        placement='right'
        closable={false}
        onClose={onClose}
      
        open={open}
        key="right"
        size='large'
        className='bg-[#5DBCB6] text-black'
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Form
            form={form}
            name="dynamic_form_item"      
            onFinish={onFinish}
            className='w-full space-y-6'
            initialValues={{ campers: [reservationHolderName] }}
        >
            <Form.List
                name="campers"
                initialValue={[reservationHolderName]}
                rules={[
                {
                    validator: async (_, campers) => {
                        if (!campers || campers.length !== (campersCount)) {
                            return Promise.reject(new Error(`Please input the ${campersCount} camper's name`));
                        }
                    },
                },                        
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                <>
                    {fields.map((field, index) => (
                    <Form.Item
                        validateFirst
                        className='w-full'
                        required={true}
                        key={field.key}
                    >
                        <div className='flex flex-row items-center space-x-3'>
                            <Form.Item
                            {...field}
                            validateFirst
                            rules={[
                                {
                                required: true,
                                whitespace: true,
                                message: "Please input camper's name or delete this field.",
                                },
                            ]}
                            noStyle
                            >
                            <Input placeholder="Camper name" style={{ width: '100%' }} />
                            </Form.Item>
                            {fields.length > 1 ? (
                            <HiOutlineMinusCircle
                                className="text-2xl text-red-500 cursor-pointer hover:scale-125 transition-all ease-in-out duration-200 active:scale-105"
                                onClick={() => remove(field.name)}
                            />
                            ) : null}
                        </div>
                    </Form.Item>
                    ))}
                    <Form.Item className='w-full'>
                        <Button
                            type="dashed"
                            disabled={fields.length >= campersCount}
                            onClick={() => add()}
                            style={{ width: '60%' }}
                            className='bg-blue-400 h-12'
                            icon={<BsPlus />}
                        >
                            Add field
                        </Button>
                        <Form.ErrorList errors={errors} />
                    </Form.Item>
                </>
                )}
            </Form.List>

            <Form.Item>
                <SubmitButton form={form}>
                    Submit
                </SubmitButton>
            </Form.Item>
        </Form>
      </Drawer>


    </>
  )
}

export default DrawerComponent