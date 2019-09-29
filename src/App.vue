<template>
	<div id="wrapper">
		<sidebar v-if="isLoggedIn"/>
		<div id="content-wrapper" v-if="isLoggedIn">
			<topbar/>
			<div id="content">
				<router-view/>
			</div>
		</div>
		<login v-if="!isLoggedIn"/>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import { getModule } from "vuex-module-decorators";
	import Login from "./components/Login.vue";
	import Sidebar from "./components/Sidebar.vue";
	import Topbar from "./components/Topbar.vue";

	@Component({
		components: {
			Login,
			Sidebar,
			Topbar
		},
	})
	export default class extends Vue {
		public mounted(): void {
			this.$store.dispatch("readAuthToken");
		}

		private get isLoggedIn(): boolean {
			return this.$store.getters.isLoggedIn;
		}

		private get notifications(): boolean {
			return this.$store.getters.getNotifications;
		}

		private dismissNotification() {
			this.$store.dispatch("removeNotification");
		}
	}
</script>

<style lang="scss">
	@import url("https://use.fontawesome.com/releases/v5.8.1/css/all.css");
	@import "@/scss/include.scss";

	html, body {
		font-size: 14px !important;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
	}

	body {
		background-color: $white-1 !important;
		color: $text !important;
	}

	@import "~tailwindcss/dist/tailwind.css";
	@import "~iview/dist/styles/iview.css";

	#wrapper {
		position: relative;
		display: flex;
		height: 100vh;

		#content-wrapper {
			flex-grow: 1;
			overflow-y: auto;
			overflow-x: hidden;

			#content {
				padding: 20px;
			}
		}
	}

	.ivu-table, .ivu-form, .ivu-form-item-label, .ivu-input, .ivu-btn {
		font-size: 14px !important;
	}
</style>
