import axiosInstance from "./axios_instanse";

const deleter = (url: string) => axiosInstance.delete(url).then((res) => res.data);

export default deleter;
