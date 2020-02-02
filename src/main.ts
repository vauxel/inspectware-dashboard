import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import ViewUI from "view-design";
import locale from "view-design/dist/locale/en-US";

Vue.config.productionTip = false;

Vue.use(ViewUI, { locale });

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
