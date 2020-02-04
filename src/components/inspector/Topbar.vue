<template>
	<nav id="topbar">
		<div class="topbar-title">{{ $route.name }}</div>
		<div class="topbar-items">
			<div class="topbar-items-toggler" @click="toggleDropdown"><i class="fas fa-fw fa-bars"></i></div>
			<ul class="topbar-items-list" v-bind:class="{ toggled: dropdownToggled }">
				<li class="topbar-item">
					<Button to="/inspector/settings">Settings</Button>
				</li>
				<li class="topbar-item">
					<Button @click="logout">Logout</Button>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class Topbar extends Vue {
		private dropdownToggled = false;

		private toggleDropdown() {
			this.dropdownToggled = !this.dropdownToggled;
		}

		private logout() {
			this.$store.dispatch("logout");
		}

		private get userName(): string {
			return this.$store.getters.getUserName;
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	#topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: 0 2rem;
		background-color: $color_white;
		box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

		.topbar-title {
			font-size: $font-size_xl;
			font-weight: $font-weight_semibold;
		}

		.topbar-items {
			.topbar-items-toggler {
				padding: 0.5rem;
				border-radius: 5px;
				display: none;

				&:hover {
					color: $color_blue;
					cursor: pointer;
				}
			}

			.topbar-items-list {
				z-index: 100;

				.topbar-item {
					display: inline-block;
					margin-left: 0.5rem;
				}
			}

			@include respond-below(sm) {
				.topbar-items-toggler {
					display: inline-block;
				}

				.topbar-items-list {
					display: none;
					flex-direction: column;
					align-items: center;
					position: absolute;
					right: 2rem;
					background-color: $color_white;
					padding: 1rem;
					box-shadow: 0 2px 3px rgba(10,10,10,.1),0 0 0 1px rgba(10,10,10,.1);
					border-radius: 5px;

					&.toggled {
						display: flex;
					}

					.topbar-item {
						margin-left: 0;

						&:not(:last-child) {
							margin-bottom: 1rem;
						}
					}
				}
			}
		}
	}
</style>
