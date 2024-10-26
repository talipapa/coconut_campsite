
import ToastMessage from '@/components/ToastMessage'
import { BookingType } from '@/types/BookingType'
import axios from '@/utils/axios'
import { getToken } from '@/utils/TokenService'
import { IUser } from './AccountService'



export interface IPassword {
    password: string,
    password_confirmation: string
}

export const getManagers = async () => {
    const response = await axios.get(`/mobile/managers`)
    return response.data;
}

export const getSingleManager = async (id: string) => {
    const response = await axios.get(`/mobile/manager/${id}`)
    return response.data;
}

export const addManager = async (first_name: string, last_name: string, email: string, password: string, password_confirmation: string) => {
    const response = await axios.post(`/mobile/manager`, {
        first_name, last_name, email, password, password_confirmation
    })
    return response.data;
}

export const updateManager = async (id: string , data: IUser) => {
    const response = await axios.patch(`/mobile/manager/${id}`, data)
    return response.data;
}

export const changeAccountPassword = async (id: number|undefined, data: IPassword) => {
    const response = await axios.patch(`/mobile/manager/change-password/${id}`, data)
    return response.data;
}

export const deleteManager = async (id: string) => {
    const response = await axios.delete(`/mobile/manager/${id}`)
    return response.data;
}
