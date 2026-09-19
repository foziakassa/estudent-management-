import axiosInstance from "./axios_instanse";

const putter = (url: string, data: object) => axiosInstance.put(url, data).then((res) => res.data);

export default putter;
