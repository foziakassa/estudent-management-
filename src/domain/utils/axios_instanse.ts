// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_PUBLIC_APP_API,
//     headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.X_ORGANIZARION_API_KEY,
//     },
// });

// // Optionally, you can add interceptors to handle requests or responses

// export default axiosInstance;
import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_PUBLIC_APP_API || "http://localhost:8080/api/v1";
const baseURL = typeof rawBaseUrl === "string" ? rawBaseUrl.trim() : "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Automatically attach the JWT Access Token from localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token.trim()}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;