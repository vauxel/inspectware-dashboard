import Axios from "axios";
import VuexStore from "../store";
import Router from "../router";

const instance = Axios.create({
	baseURL: "http://" + window.location.hostname + ":4040/api/",
});

instance.interceptors.request.use((config) => {
	VuexStore.dispatch("startLoading");

	if (localStorage.getItem("auth_token")) {
		config.headers.Authorization = "Bearer " + localStorage.getItem("auth_token");
	}

	return config;
}, (error) => {
	VuexStore.dispatch("errorLoading");
	return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
	VuexStore.dispatch("stopLoading");
	return response;
}, (error) => {
	VuexStore.dispatch("errorLoading");

	if (error.response.status == 401 && Router.currentRoute.path != "/") {
		VuexStore.dispatch("restrictedRedirect", {
			message: "You are unauthorized to make that request without sufficient authentication.",
			compulsory: true
		});
	}

	return Promise.reject(error);
});

export default instance;
