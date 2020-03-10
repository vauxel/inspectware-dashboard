import Vue from "vue";
import VueRouter from "vue-router";
import InspectorDashboard from "./views/inspector/Dashboard.vue";
import InspectorHome from "./views/inspector/Home.vue";
import InspectorSettings from "./views/inspector/Settings.vue";
import InspectorInspections from "./views/inspector/Inspections.vue";
import InspectorInspection from "./views/inspector/Inspection.vue";
import InspectorAvailability from "./views/inspector/Availability.vue";
import NProgress from "nprogress";
import auth from "./modules/auth";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	base: "/dash/",
	routes: [
		{
			path: "/inspector",
			name: "Inspector Dashboard",
			component: InspectorDashboard,
			children: [
				{
					path: "",
					name: "Inspector Dashboard Home",
					component: InspectorHome,
				},
				{
					path: "settings",
					name: "Settings",
					component: InspectorSettings,
				},
				{
					path: "inspections",
					name: "Inspection List",
					component: InspectorInspections,
				},
				{
					path: "inspections/:id",
					name: "Inspection Details",
					component: InspectorInspection,
				},
				{
					path: "availability",
					name: "Availability",
					component: InspectorAvailability,
				}
			]
		}
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
