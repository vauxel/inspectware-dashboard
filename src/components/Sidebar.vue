<template>
	<!-- Sidebar -->
	<div id="sidebar" v-bind:class="{ toggled: shouldCollapse }">
		<div class="sidebar-panel">
			<div class="sidebar-branding">
				<div class="sidebar-branding-text">inspectware</div>
				<div class="sidebar-branding-text-alt">i</div>
			</div>
			<div class="sidebar-content">
				<ul class="sidebar-section">
					<li class="sidebar-item">
						<router-link to="/"><i class="fas fa-fw fa-tachometer-alt"></i> Dashboard</router-link>
					</li>
				</ul>
				<div class="sidebar-label">Inspections Management</div>
				<ul class="sidebar-section">
					<li class="sidebar-item">
						<router-link to="/inspections"><i class="fas fa-fw fa-clipboard-list"></i> Inspections</router-link>
					</li>
					<li class="sidebar-item">
						<router-link to="/invoices"><i class="fas fa-fw fa-file-invoice-dollar"></i> Invoices</router-link>
					</li>
				</ul>
				<div class="sidebar-label">Clientele & Realtors</div>
				<ul class="sidebar-section">
					<li class="sidebar-item">
						<router-link to="/clients"><i class="fas fa-fw fa-users"></i> Clients</router-link>
					</li>
					<li class="sidebar-item">
						<router-link to="/realtors"><i class="fas fa-fw fa-sign"></i> Realtors</router-link>
					</li>
				</ul>
			</div>
		</div>
		<div class="sidebar-toggler" @click="toggleSidebar"></div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class Sidebar extends Vue {
		private isToggled = false;
		private isSmallScreen = false;

		private toggleSidebar() {
			this.isToggled = !this.isToggled;
		}

		private get shouldCollapse(): boolean {
			return this.isToggled || this.isSmallScreen;
		}

		private onResize() {
			this.isSmallScreen = (window.innerWidth <= 768);
		}

		created() {
			window.addEventListener('resize', this.onResize);

			if (window.innerWidth <= 768) {
				this.isSmallScreen = true;
			}
		}

		beforeDestroy() {
			window.removeEventListener('resize', this.onResize);
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	#sidebar {
		flex: 0 0 250px;
		display: flex;
		transition: flex-basis 200ms ease-in-out;

		&.toggled {
			flex-basis: 125px;
				
			.sidebar-panel .sidebar-content {
				.sidebar-label {
					text-align: center;
				}

				.sidebar-section .sidebar-item a {
					display: flex;
					flex-direction: column;
					align-items: center;

					.fas {
						display: block;
						padding-bottom: 3px;
					}
				}
			}

			.sidebar-toggler {
				left: 125px;
				cursor: e-resize;

				&::before {
					content: "\f054";
				}
			}
		}

		.sidebar-panel {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			background-color: $primary;
			background-image: linear-gradient(180deg, $primary 10%, $primary-darker 100%);

			.sidebar-branding {
				color: $white;
				font-weight: bolder;
				background-color: $primary-darker;
				padding: 10px 0px;
				flex: 0 0 50px;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;

				.sidebar-branding-text {
					font-size: 1.25em;
				}

				.sidebar-branding-text-alt {
					font-size: 2em;
					display: none;
					background-color: $primary;
					border-radius: 5px;
					width: 50%;
				}
			}

			.sidebar-content {
				overflow-y: auto;
				flex-grow: 1;

				.sidebar-section {
					.sidebar-item {
						padding: 0px 10px;
						margin: 15px 0px;

						a {
							display: block;
							padding: 10px;
							color: rgba($white, 0.8);
							border-radius: 5px;
							outline: none;

							.fas {
								color: rgba($white, 0.4);
								margin-right: 0.25em;
							}

							&:hover {
								background-color: $primary-lighter;
								color: rgba($white, 1);

								.fas {
									color: $white;
								}
							}

							&.router-link-exact-active {
								background-color: $primary-lighter;
								color: $white;
								font-weight: 600;

								.fas {
									color: $white;
								}
							}
						}
					}
				}

				.sidebar-label {
					text-transform: uppercase;
					font-weight: 600;
					font-size: 0.75em;
					color: rgba($white, 0.5);
					margin: 5px 0px;
					padding: 0px 20px;
				}
			}
		}

		.sidebar-toggler {
			cursor: w-resize;
			border-left: 3px solid rgba($primary-lighter, 0.7);
			transition: opacity 0.25s ease-in-out 0s;
			opacity: 0;
			padding-left: 3px;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 250px;
			transition: left 200ms ease-in-out;

			&:hover {
				opacity: 1;
			}

			&::before {
				position: relative;
				top: calc(50% - 1em);
				font-family: "Font Awesome 5 Free";
				font-weight: 900;
				content: "\f053";
				color: rgba($primary-lighter, 0.7);
			}
		}

		@include respond-below(sm) {
			font-size: 0.75em;

			.fas {
				font-size: 1.5em;
			}

			.sidebar-toggler {
				display: none;
			}

			.sidebar-branding-text {
				display: none;
			}

			.sidebar-branding-text-alt {
				display: block !important;
			}

			.sidebar-label {
				padding: 0px 10px !important;
			}

			.sidebar-item {
				padding: 0px 5px !important;

				a {
					padding: 10px 0px !important;
				}
			}

			&.toggled {
				flex-basis: 70px;
			}
		}
	}
</style>
