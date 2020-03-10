<template>
	<div id="wrapper">
		<router-view v-if="isLoggedIn"/>
		<login v-if="!isLoggedIn"/>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import { getModule } from "vuex-module-decorators";
	import Login from "./components/Login.vue";

	@Component({
		components: {
			Login
		},
	})
	export default class extends Vue {
		public mounted(): void {
			this.$store.dispatch("readAuthToken");

			if (this.isLoggedIn) {
				this.$router.push(`/${this.getAffiliation}`);
			}
		}

		private get isLoggedIn(): boolean {
			return this.$store.getters.isLoggedIn;
		}

		private get getAffiliation(): string {
			return this.$store.getters.getAffiliation;
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
	@import "@/scss/include.scss";

	@import "~@fortawesome/fontawesome-free/css/fontawesome.min.css";
	@import "~@fortawesome/fontawesome-free/css/solid.min.css";
	@import "~view-design/dist/styles/iview.css";

	html {
		font-size: 62.5%;
	}

	body {
		font-size: $font-size_base !important;
		color: $font_color_dark !important;
	}
	
	html, body {
		width: 100%;
		height: 100%;
	}

	#wrapper {
		position: relative;
		width: 100%;
		height: 100%;

		.perspective-view {
			width: 100%;
			height: 100%;
			display: flex;
		}

		#content-wrapper {
			flex-grow: 1;
			overflow-y: auto;
			overflow-x: hidden;
			background-color: $color_grey-1;

			#content {
				padding: 2rem;
				position: relative;
			}
		}
	}
</style>
