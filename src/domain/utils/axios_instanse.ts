import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.VITE_PUBLIC_APP_API,
    headers: {
        "Content-Type": "application/json",
        // "x-api-key": process.env.X_ORGANIZARION_API_KEY,
    },
});

// Optionally, you can add interceptors to handle requests or responses

export default axiosInstance;