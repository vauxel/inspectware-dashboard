import Vue from "vue";
import VueRouter from "vue-router";
import VuexStore from "./store";
import InspectorDashboard from "./views/inspector/Dashboard.vue";
import InspectorHome from "./views/inspector/Home.vue";
import InspectorSettings from "./views/inspector/Settings.vue";
import InspectorInspections from "./views/inspector/Inspections.vue";
import InspectorInspection from "./views/inspector/Inspection.vue";
import InspectorAvailability from "./views/inspector/Availability.vue";
import InspectorMailing from "./views/inspector/Mailing.vue";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	base: "/dash/",
	routes: [
		{
			path: "/",
			name: "Welcome",
		},
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
				},
				{
					path: "mailing",
					name: "Mailing",
					component: InspectorMailing,
				}
			]
		}
	],
});

router.beforeResolve((to, from, next) => {
	//if (to.name) {
	//	VuexStore.dispatch("startLoading");
	//}

	next();
});

router.afterEach((to, from) => {
	//VuexStore.dispatch("stopLoading");
	document.title = "inspectware | " + to.name;
});

export default router;
