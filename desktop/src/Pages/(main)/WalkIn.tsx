import React, { useEffect, useState } from 'react'
import PageWrapper from './PageWrapper'
import { Breadcrumb, Button, Divider, Form, FormInstance, Input, InputNumber, Modal, notification, Radio, Spin } from 'antd'
import { HiOutlineMinusCircle } from 'react-icons/hi';
import { BsCashStack, BsMoonFill, BsPlus, BsSunFill } from 'react-icons/bs';
import TypedInputNumber from 'antd/es/input-number';
import axios from '@/utils/auth';
import { AxiosProgressEvent } from 'axios';
import { useNavigate } from 'react-router-dom';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 34, offset: 1 },
      sm: { span: 20, offset: 1 },
    },
  };
  
const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 8 },
    },
};
  

interface SubmitButtonProps {
    form: FormInstance;
}

interface IPrice {
    id: number;
    name: string;
    price: number;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children }) => {
    const [submittable, setSubmittable] = React.useState<boolean>(false);
  
    // Watch all values
    const values = Form.useWatch([], form);
  
    React.useEffect(() => {
      form
        .validateFields({ validateOnly: true })
        .then(() => setSubmittable(true))
        .catch(() => setSubmittable(false));
    }, [form, values]);
  
    return (
      <Button type="primary" htmlType="submit" disabled={!submittable} className='w-[20vw]'>
        {children}
      </Button>
    );
};

const WalkIn = () => {
    const [form] = Form.useForm();
    const [prices, setPrices] = React.useState<IPrice[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (notifType: 'success'|'error'|'warning'|'info', title: string, body: string) => {
        api.open({
          type: notifType,
          message: title,
          description: body,
          showProgress: true,
          pauseOnHover: false,
        });
      };
    const navigate = useNavigate();

    const adultCount = Form.useWatch('adultCount', form);
    const childCount = Form.useWatch('childCount', form);
    const bookingType = Form.useWatch('booking_type', form);

    const calculateSubPrice = () => {
        const adultTotal = prices[0].price * form.getFieldValue('adultCount')
        const childTotal = prices[1].price * form.getFieldValue('childCount')
        const tentPitchTotal = prices[2].price * form.getFieldValue('tent_pitching_count')
        const bonfireKitTotal = prices[3].price * form.getFieldValue('bonfire_kit_count')
        var cabinTotal = 0
        if (form.getFieldValue('is_cabin') === true) {
            cabinTotal = prices[4].price
        }
        return (adultTotal + childTotal + tentPitchTotal + bonfireKitTotal + cabinTotal).toFixed(2)
    }

    const [open, setOpen] = useState(false);

    const showModal = () => {
      setOpen(true);
    };

    // This is where data is being submitted to server
    const handleOk = () => {
        setIsButtonLoading(true);
        const payload = {...form.getFieldsValue(), price: Number(calculateSubPrice())}
        axios.post('/manager/walkin', payload)
            .then((res) => {
                openNotification('success', 'Walk-in Confirmed', 'Walk-in has been confirmed successfully! You will be redirected shortly....');
                setTimeout(() => {
                    navigate(`/booking/${res['data']['booking_id']}`)
                }, 2000);
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsButtonLoading(false);
                setOpen(false);
            })
    };
  
    const handleCancel = () => {
      setOpen(false);
    };

    const onFinish = (values: any) => {
        // console.log('Received values of form:', calculateSubPrice());
        showModal()
    };

    


    const reloadPrices = () => {
        setIsLoading(true);
            axios.get('/price')
            .then(res => {
                setPrices(res.data['data']);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        reloadPrices();
    }, [])

    if (prices.length === 0 || isLoading){
        return (
            <PageWrapper>
                <>
                <Breadcrumb className='bg-slate-200 shadow-lg py-5 px-6 select-none'>
                    <Breadcrumb.Item><span className='font-semibold'>Walk-in</span></Breadcrumb.Item>
                </Breadcrumb>
                <div className='flex flex-col w-full px-6 py-8 space-y-12 max-h-[80vh] overflow-y-scroll mt-12'>
                    <Spin size='large'/>
                </div>
                </>
            </PageWrapper>
        )
    }


    
    return (
        <PageWrapper>
            <>
                {contextHolder}
                <Breadcrumb className='bg-slate-200 shadow-lg py-5 px-6 select-none'>
                    <Breadcrumb.Item><span className='font-semibold'>Walk-in</span></Breadcrumb.Item>
                </Breadcrumb>
                <div className='flex flex-col w-full px-6 py-8 space-y-12 max-h-[80vh] overflow-y-scroll'>
                    <div className='space-y-3'>
                        <h1 className='text-lg font-bold mx-4'>Walk-in data entry</h1>
                        <div className='w-full bg-slate-200 rounded-xl shadow-lg p-6'>
                        {/* <Button onClick={reloadPrices} className='mb-4'>Reload prices</Button> */}
                        <Form
                            form={form}
                            name="dynamic_form_item"      
                            {...formItemLayoutWithOutLabel}
                            onFinish={onFinish}
                            className='w-full space-y-6'
                        >
                            <Form.Item name="tel_number"  label="Phone number" {...formItemLayout} validateFirst rules={
                                [
                                    {required: true, 'message': 'This field is required'},
                                    {pattern: /^9\d{9}$/, message: "Invalid phone number"}
                                ]}>
                                < Input addonBefore="+63" placeholder='ex: 9234857298'/>
                            </Form.Item>
                            <Form.Item name="adultCount" label={`How many adult ( P ${prices[0].price} )`} initialValue={1} {...formItemLayout}  validateFirst rules={
                                [
                                    {required: true, 'message': 'This field is required'}, 
                                    {pattern: /^(?:\d*)$/, message: "Invalid value"}
                                ]}>
                                <InputNumber defaultValue={1}/>
                            </Form.Item>
                            <Form.Item name="childCount" label={`How many child ( P ${prices[1].price} )`} initialValue={0} {...formItemLayout} validateFirst rules={
                                [
                                    {required: true, message: 'This field is required'},
                                    {pattern: /^(?:\d*)$/, message: "Invalid value"},
                                ]}>
                            
                                <InputNumber defaultValue={0}/>
                            </Form.Item>
                            <Form.List
                                name="campers"
                                initialValue={['']}
                                rules={[
                                {
                                    validator: async (_, campers) => {
                                        if (!campers || campers.length !== (adultCount + childCount)) {
                                            return Promise.reject(new Error(`Please input the ${adultCount + childCount} camper's name`));
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
                                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                        label={index === 0 ? 'Camper name' : ''}
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
                                            <Input placeholder="Camper name" style={{ width: '60%' }} />
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
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            disabled={fields.length >= (adultCount + childCount)}
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                            className='bg-blue-400'
                                            icon={<BsPlus />}

                                        >
                                            Add field
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                                )}
                            </Form.List>
                            <Divider variant='solid'/>
                            <Form.Item name="tent_pitching_count" initialValue={0} label={`Tent pitching count ( P ${prices[2].price} )`} {...formItemLayout} validateFirst rules={
                                [
                                    {required: true, message: 'This field is required'},
                                    {pattern: /^(?:\d*)$/, message: "Invalid value"},
                                ]}>
                            
                                <InputNumber defaultValue={0}/>
                            </Form.Item>
                            <Form.Item name="bonfire_kit_count" initialValue={0} label={`Bonfire kit count ( P ${prices[3].price} )`} {...formItemLayout} validateFirst rules={
                                [
                                    {required: true, message: 'This field is required'},
                                    {pattern: /^(?:\d*)$/, message: "Invalid value"},
                                ]}>
                            
                                <InputNumber defaultValue={0}/>
                        
                            </Form.Item>
                            <Form.Item name="is_cabin" initialValue={false} label={`With cabin? ( P ${prices[4].price} )`} {...formItemLayout} validateFirst rules={[{required: true}]}>
                                <Radio.Group defaultValue={false}>
                                    <Radio value={false}>
                                        <div className='flex flex-row items-center space-x-3'>
                                            <span>No</span>
                                        </div>
                                    </Radio>
                                    <Radio value={true}>
                                        <div className='flex flex-col items-start'>
                                            <span>Yes</span>
                                        </div>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="booking_type" initialValue={"daytour"} label="Booking type" {...formItemLayout} validateFirst rules={[{required: true}]}>
                                <Radio.Group defaultValue="daytour">
                                    <Radio value="daytour">
                                        <div className='flex flex-col items-start'>
                                            <span>Day tour</span>
                                        </div>
                                    </Radio>
                                    <Radio value="overnight">
                                        <div className='flex flex-row items-center space-x-3'>
                                            <span>Overnight</span>
                                        </div>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>


                            <Form.Item>
                                <SubmitButton form={form}>
                                    Submit
                                </SubmitButton>
                            </Form.Item>
                        </Form>
                        </div>
                    </div>

                </div>
                <Modal
                    open={open}
                    title="Please confirm these details"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    confirmLoading={isButtonLoading}
                    footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn/>
                    </>
                    )}
                >
                    <div className='flex flex-col space-y-2'>
                        <p>Phone number: <span className='bg-yellow-200 px-2'>0{form.getFieldValue('tel_number')}</span></p>
                        <p>Adult: <span className='bg-yellow-200 px-2'>{form.getFieldValue('adultCount')}</span></p>
                        <p>Child: <span className='bg-yellow-200 px-2'>{form.getFieldValue('childCount')}</span></p>
                        <p>
                            Campers: 
                            <ul className='flex flex-col items-start space-y-1'>
                                {form.getFieldValue('campers') !== undefined && form.getFieldValue('campers').length > 0 && form.getFieldValue('campers').map((camper: string, index: number) => (
                                    <li key={index} className='bg-green-200 px-2'>{camper}</li>
                                ))}
                            </ul>
                        </p>
                        <p>Tent pitching count: <span className='bg-yellow-200 px-2'>{form.getFieldValue('tent_pitching_count')}</span></p>
                        <p>Bonfire kit count: <span className='bg-yellow-200 px-2'>{form.getFieldValue('bonfire_kit_count')}</span></p>
                        <p>With cabin: <span className='bg-yellow-200 px-2'>{form.getFieldValue('is_cabin') ? 'Yes' : 'No'}</span></p>
                        <p>Booking type: <span className='bg-yellow-200 px-2'>{form.getFieldValue('booking_type')}</span></p>
                        <p>Price: <span className='bg-yellow-200 px-2'>P {calculateSubPrice()}</span></p>
              
                        <div className='border-top-2 border-slate-300 flex flex-col items-center font-bold text-xl'>
                            <BsCashStack className='text-3xl'/>
                            <p className='text-red-500 flex flex-row items-center'>Cash to be collected </p>
                            <span className='text-green-700'>P {calculateSubPrice()}</span>
                            <p>Is the cash collected? Press <span className='text-blue-600'>Ok</span></p>
                        </div>

                    </div>

                </Modal>
            </>

        </PageWrapper>
    )
}

export default WalkIn