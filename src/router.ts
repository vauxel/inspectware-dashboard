import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Settings from "./views/Settings.vue";
import Inspections from "./views/Inspections.vue";
import Inspection from "./views/Inspection.vue";
import Availability from "./views/Availability.vue";
import NProgress from "nprogress";
import auth from "./modules/auth";

Vue.use(Router);

const router = new Router({
	mode: "history",
	base: "/dash/",
	routes: [
		{
			path: "/",
			name: "Dashboard",
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
		{
			path: "/inspections/:id",
			name: "Inspection Details",
			component: Inspection,
		},
		{
			path: "/availability",
			name: "Availability",
			component: Availability,
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
