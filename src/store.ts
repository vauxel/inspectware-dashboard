import Vue from "vue";
import Vuex, { Store } from "vuex";

import AuthModule from "./modules/auth";

Vue.use(Vuex);

export default new Store({
	state: {},
	modules: {
		auth: AuthModule,
	},
});
