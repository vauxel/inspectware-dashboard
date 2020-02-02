import Axios from "axios";
import NProgress from "nprogress";
import VuexStore from "../store";

const instance = Axios.create({
	baseURL: "http://" + window.location.hostname + ":4040/api/",
});

instance.interceptors.request.use((config) => {
	NProgress.start();

	if (localStorage.getItem("auth_token")) {
		config.headers.Authorization = "Bearer " + localStorage.getItem("auth_token");
	}

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
	console.error(error);

	if (error.response.status == 401) {
		VuexStore.dispatch("logout", {
			message: "You are unauthorized to make that request without sufficient authentication.",
			compulsory: true
		});
	}

	return Promise.reject(error);
});

export default instance;
