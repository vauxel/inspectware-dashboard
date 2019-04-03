<template>
	<div id="wrapper">
		<div :class="`alert alert-${level} alert-dismissible fade show fixed-top m-2`" role="alert" v-for="{message, level} in notifications" :key="message">
			<i class="fas fa-info-circle mr-2"></i>
			{{ message }}
			<button type="button" class="close" v-on:click="dismissNotification">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<sidebar v-if="isLoggedIn"/>
		<div id="content-wrapper" class="d-flex flex-column" v-if="isLoggedIn">
			<div id="content">
				<topbar/>
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
	import $ from "jquery";
	import "bootstrap";

	import globalLoad from "./js/custom.js";

	@Component({
		components: {
			Login,
			Sidebar,
			Topbar,
		},
	})
	export default class extends Vue {
		public mounted(): void {
			globalLoad($);
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
	@import url("https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i");

	@import "~nprogress/nprogress.css";
	@import "@/scss/include.scss";

	html {
		position: relative;
		min-height: 100vh;
	}

	body {
		height: 100vh;
		background-color: $gray-100;
	}

	a {
		&:focus {
			outline: none;
		}
	}

	// Main page wrapper
	#wrapper {
		display: flex;

		#content-wrapper {
			width: 100%;
			overflow-x: hidden;

			#content {
				flex: 1 0 auto;
			}
		}
	}
</style>
