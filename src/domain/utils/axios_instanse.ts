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

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_APP_API,
    headers: {
        "Content-Type": "application/json",
        // Fix: Vite uses import.meta.env, not process.env
        // "x-api-key": import.meta.env.VITE_ORGANIZATION_API_KEY,
    },
});

// Request Interceptor: Automatically attach the JWT Access Token
axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem("token"); // Ensure your login saves access_token here
        // if (token) {
        config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImFkbWluQHNjaG9vbC5jb20iLCJpc3MiOiJTY2hvb2wgTWFuYWdlbWVudCBTeXN0ZW0iLCJleHAiOjE3ODk4OTA5ODMsIm5iZiI6MTc4OTgwNDU4MywiaWF0IjoxNzg5ODA0NTgzfQ.Gc7-CgXFSUQWCrm5XTs3pQEemOZ-ibBdZ6_98r4dkwU`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;