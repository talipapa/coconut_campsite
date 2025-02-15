import axios from "./axios";
import { getToken } from "./TokenService";

export interface IUser {
    first_name : string | undefined,
    last_name : string | undefined,
    email : string | undefined
}

export interface IPassword {
    password: string,
    password_confirmation: string
}


export const changeAccountDetail = async (id: number|undefined, data: IUser) => {
    const response = await axios.patch(`/mobile/owner-account/${id}`, data)
    return response.data;
}

export const changeAccountPassword = async (id: number|string|undefined, data: IPassword) => {

    const response = await axios.patch(`/mobile/owner-account/change-password/${id}`, data)
    return response.data;
}
