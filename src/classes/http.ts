import axios from "axios";
import NProgress from "nprogress";

const instance = axios.create({
	baseURL: "/api",
});

instance.interceptors.request.use((config) => {
	NProgress.start();
	return config;
});

instance.interceptors.response.use((response) => {
	NProgress.done();
	return response;
});

export default instance;
