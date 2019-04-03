import Vue from "vue";
import Vuex, { Store } from "vuex";

import AuthModule from "./modules/auth";
import MiscModule from "./modules/misc";

Vue.use(Vuex);

export default new Store({
	state: {},
	modules: {
		auth: AuthModule,
		misc: MiscModule
	},
});
