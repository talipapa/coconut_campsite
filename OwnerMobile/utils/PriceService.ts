import axios from "./axios"

export const fetchPrice = async () => {
    const response = await axios.get("/price")
    return response.data
}

