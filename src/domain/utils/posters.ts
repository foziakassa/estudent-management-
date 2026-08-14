import axiosInstance from "./axios_instanse";

const poster = (url: string, data: object) => axiosInstance.post(url, data).then((res) => res.data);

export default poster;