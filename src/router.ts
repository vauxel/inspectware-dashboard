import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Settings from "./views/Settings.vue";
import Metrics from "./views/Metrics.vue";
import NProgress from "nprogress";

Vue.use(Router);

const router = new Router({
	mode: "history",
	base: "/dash/",
	routes: [
		{
			path: "/",
			name: "Home",
			component: Home,
		},
		{
			path: "/",
			name: "Metrics",
			component: Metrics,
		},
		{
			path: "/settings",
			name: "Settings",
			component: Settings,
		},
	],
});

router.beforeResolve((to, from, next) => {
	if (to.name) {
		NProgress.start();
	}

	next();
});

router.afterEach((to, from) => {
	NProgress.done();
	document.title = "inspectware | " + to.name;
});

export default router;
