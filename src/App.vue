<template>
	<div id="wrapper">
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
	import Login from "@/components/Login.vue";
	import Sidebar from "@/components/Sidebar.vue";
	import Topbar from "@/components/Topbar.vue";
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
		}

		private get isLoggedIn(): boolean {
			return this.$store.getters.isLoggedIn;
		}
	}
</script>

<style lang="scss">
	@import url("https://use.fontawesome.com/releases/v5.8.1/css/all.css");
	@import url("https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i");

	@import "@/scss/include.scss";

	html {
		position: relative;
		min-height: 100vh;
	}

	body {
		height: 100vh;
		display: flex;
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
		flex-grow: 1;

		#content-wrapper {
			width: 100%;
			overflow-x: hidden;

			#content {
				flex: 1 0 auto;
			}
		}
	}
</style>
