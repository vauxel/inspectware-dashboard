import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Settings from "./views/Settings.vue";
import Inspections from "./views/Inspections.vue";
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
			path: "/settings",
			name: "Settings",
			component: Settings,
		},
		{
			path: "/inspections",
			name: "Inspection Statuses",
			component: Inspections,
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
