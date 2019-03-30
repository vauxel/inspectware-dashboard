import Axios from "axios";
import NProgress from "nprogress";

const instance = Axios.create({
	baseURL: "http://localhost:4040/api/",
});

instance.interceptors.request.use((config) => {
	NProgress.start();
	return config;
}, (error) => {
	NProgress.done();
	return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
	NProgress.done();
	return response;
}, (error) => {
	NProgress.done();
	return Promise.reject(error);
});

export default instance;
