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
						<router-link to="/inspector"><i class="fas fa-fw fa-tachometer-alt"></i> Dashboard</router-link>
					</li>
				</ul>
				<div class="sidebar-label">Inspections Management</div>
				<ul class="sidebar-section">
					<li class="sidebar-item">
						<router-link to="/inspector/inspections"><i class="fas fa-fw fa-clipboard-list"></i> Inspections</router-link>
					</li>
					<li class="sidebar-item">
						<router-link to="/inspector/invoices"><i class="fas fa-fw fa-file-invoice-dollar"></i> Invoices</router-link>
					</li>
				</ul>
				<div class="sidebar-label">Clientele & Realtors</div>
				<ul class="sidebar-section">
					<li class="sidebar-item">
						<router-link to="/inspector/clients"><i class="fas fa-fw fa-users"></i> Clients</router-link>
					</li>
					<li class="sidebar-item">
						<router-link to="/inspector/realtors"><i class="fas fa-fw fa-sign"></i> Realtors</router-link>
					</li>
				</ul>
				<div class="sidebar-label">Personal Preferences</div>
				<ul class="sidebar-section">
					<li class="sidebar-item">
						<router-link to="/inspector/availability"><i class="fas fa-fw fa-calendar-alt"></i> Availability</router-link>
					</li>
				</ul>
				<div class="sidebar-label" v-if="isOwnerInspector">Account Preferences</div>
				<ul class="sidebar-section" v-if="isOwnerInspector">
					<li class="sidebar-item">
						<router-link to="/inspector/mailing"><i class="fas fa-fw fa-mail-bulk"></i> Mailing</router-link>
					</li>
				</ul>
			</div>
			<div class="sidebar-footer">
				<div class="sidebar-footer-item">
					<router-link to="/inspector/settings">Settings</router-link>
				</div>
				<div class="sidebar-footer-item">
					<a @click="logout">Logout</a>
				</div>
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

		private get isOwnerInspector(): boolean {
			return this.$store.getters.isOwnerInspector;
		}

		private onResize() {
			this.isSmallScreen = (window.innerWidth <= 768);
		}

		private logout() {
			this.$store.dispatch("logout");
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
				
			.sidebar-panel {
				.sidebar-content {
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

				.sidebar-footer {
					flex-direction: column;
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
			background-color: $color_primary;
			background-image: linear-gradient(180deg, $color_primary 10%, $color_primary-darker 100%);

			.sidebar-branding {
				color: $color_white;
				font-weight: bolder;
				background-color: $color_primary-darker;
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
					background-color: $color_primary;
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
							color: rgba($color_white, 0.8);
							border-radius: 5px;
							outline: none;

							.fas {
								color: rgba($color_white, 0.4);
								margin-right: 0.25em;
							}

							&:hover {
								background-color: $color_primary-lighter;
								color: rgba($color_white, 1);

								.fas {
									color: $color_white;
								}
							}

							&.router-link-exact-active {
								background-color: $color_primary-lighter;
								color: $color_white;
								font-weight: 600;

								.fas {
									color: $color_white;
								}
							}
						}
					}
				}

				.sidebar-label {
					text-transform: uppercase;
					font-weight: $font-weight_bold;
					font-size: 0.75em;
					color: rgba($color_white, 0.5);
					margin: 5px 0px;
					padding: 0px 20px;
				}
			}

			.sidebar-footer {
				display: flex;
				margin: 0.25rem;

				.sidebar-footer-item {
					flex: 1;
					text-align: center;

					a {
						display: block;
						padding: 0.75rem;
						color: rgba($color_white, 0.8);
						outline: none;
						border: 2px solid $color_primary;
						border-radius: 5px;
						margin: 0.25rem;
						text-transform: uppercase;
						font-weight: $font-weight_bold;
						font-size: 0.75em;

						&:hover {
							background-color: $color_primary;
							color: rgba($color_white, 1);
						}
					}
				}
			}
		}

		.sidebar-toggler {
			cursor: w-resize;
			border-left: 3px solid rgba($color_primary-lighter, 0.7);
			transition: opacity 0.25s ease-in-out 0s;
			opacity: 0;
			padding-left: 3px;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 250px;
			transition: left 200ms ease-in-out;
			z-index: 100;

			&:hover {
				opacity: 1;
			}

			&::before {
				position: relative;
				top: calc(50% - 1em);
				font-family: "Font Awesome 5 Free";
				font-weight: 900;
				content: "\f053";
				color: rgba($color_primary-lighter, 0.7);
			}
		}

		@media (max-width: $breakpoint-sm) {
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

			.sidebar-footer {
				flex-direction: column;
			}

			&.toggled {
				flex-basis: 70px;
			}
		}
	}
</style>
