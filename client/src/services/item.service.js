import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_ITEMS

export const APIgetItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/status/${id}`);

        // console.log("ITEM DEL FRONT :", response.data)
        return response.data;

    } catch (error) {
        console.error('Error fetching item data:', error);
        throw error;
    }
};