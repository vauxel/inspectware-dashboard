<template>
	<!-- Sidebar -->
	<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
		<!-- Sidebar - Brand -->
		<a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
			<div class="sidebar-brand-icon rotate-n-15">
				<i class="fas fa-laugh-wink"></i>
			</div>
			<div class="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
		</a>
		<!-- Divider -->
		<hr class="sidebar-divider my-0">
		<!-- Nav Item - Dashboard -->
		<li class="nav-item active">
			<router-link class="nav-link" to="/">
				<i class="fas fa-fw fa-tachometer-alt"></i>
				<span>Dashboard</span>
			</router-link>
		</li>
		<!-- Divider -->
		<hr class="sidebar-divider">
		<!-- Heading -->
		<div class="sidebar-heading">
			Interface
		</div>
		<!-- Nav Item - Pages Collapse Menu -->
		<li class="nav-item">
			<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
				<i class="fas fa-fw fa-cog"></i>
				<span>Components</span>
			</a>
			<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
				<div class="bg-white py-2 collapse-inner rounded">
					<h6 class="collapse-header">Custom Components:</h6>
					<a class="collapse-item" href="buttons.html">Buttons</a>
					<a class="collapse-item" href="cards.html">Cards</a>
				</div>
			</div>
		</li>
		<!-- Nav Item - Utilities Collapse Menu -->
		<li class="nav-item">
			<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
				<i class="fas fa-fw fa-wrench"></i>
				<span>Utilities</span>
			</a>
			<div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
				<div class="bg-white py-2 collapse-inner rounded">
					<h6 class="collapse-header">Custom Utilities:</h6>
					<a class="collapse-item" href="utilities-color.html">Colors</a>
					<a class="collapse-item" href="utilities-border.html">Borders</a>
					<a class="collapse-item" href="utilities-animation.html">Animations</a>
					<a class="collapse-item" href="utilities-other.html">Other</a>
				</div>
			</div>
		</li>
		<!-- Divider -->
		<hr class="sidebar-divider">
		<!-- Heading -->
		<div class="sidebar-heading">
			Addons
		</div>
		<!-- Nav Item - Pages Collapse Menu -->
		<li class="nav-item">
			<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages">
				<i class="fas fa-fw fa-folder"></i>
				<span>Pages</span>
			</a>
			<div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
				<div class="bg-white py-2 collapse-inner rounded">
					<h6 class="collapse-header">Login Screens:</h6>
					<a class="collapse-item" href="login.html">Login</a>
					<a class="collapse-item" href="register.html">Register</a>
					<a class="collapse-item" href="forgot-password.html">Forgot Password</a>
					<div class="collapse-divider"></div>
					<h6 class="collapse-header">Other Pages:</h6>
					<a class="collapse-item" href="404.html">404 Page</a>
					<a class="collapse-item" href="blank.html">Blank Page</a>
				</div>
			</div>
		</li>
		<!-- Nav Item - Charts -->
		<li class="nav-item">
			<a class="nav-link" href="charts.html">
				<i class="fas fa-fw fa-chart-area"></i>
				<span>Charts</span></a>
		</li>
		<!-- Nav Item - Tables -->
		<li class="nav-item">
			<a class="nav-link" href="tables.html">
				<i class="fas fa-fw fa-table"></i>
				<span>Tables</span></a>
		</li>
		<!-- Divider -->
		<hr class="sidebar-divider d-none d-md-block">
		<!-- Sidebar Toggler (Sidebar) -->
		<div class="text-center d-none d-md-inline">
			<button class="rounded-circle border-0" id="sidebarToggle"></button>
		</div>
	</ul>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import "bootstrap";

	@Component
	export default class Sidebar extends Vue {}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	.sidebar,
	.topbar {
		.nav-item {
			&.dropdown {
				.dropdown-toggle {
					&::after {
						width: 1rem;
						text-align: center;
						float: right;
						vertical-align: 0;
						border: 0;
						font-weight: 900;
						content: '\f105';
						font-family: 'Font Awesome 5 Free';
					}
				}

				&.show {
					.dropdown-toggle::after {
						content: '\f107';
					}
				}
			}

			.nav-link {
				position: relative;
				
				.badge-counter {
					position: absolute;
					transform: scale(0.7);
					transform-origin: top right;
					right: .25rem;
					margin-top: -.25rem;
				}

				.img-profile {
					height: 2rem;
					width: 2rem;
				}
			}
		}
	}

	// Sidebar
	.sidebar {
		width: $sidebar-collapsed-width;
		min-height: 100vh;
		.nav-item {
			position: relative;
			&:last-child {
				margin-bottom: 1rem;
			}
			.nav-link {
				text-align: center;
				padding: 0.75rem 1rem;
				width: $sidebar-collapsed-width;
				span {
					font-size: 0.65rem;
					display: block;
				}
			}
			&.active {
				.nav-link {
					font-weight: 700;
				}
			}
			// Accordion
			.collapse {
				position: absolute;
				left: calc(#{$sidebar-collapsed-width} + #{$grid-gutter-width} / 2);
				z-index: 1;
				top: 2px;
				// Grow In Animation
				@extend .animated--grow-in;
				.collapse-inner {
					border-radius: $border-radius;
					box-shadow: $box-shadow;
				}
			}
			.collapsing {
				display: none;
				transition: none;
			}
			.collapse,
			.collapsing {
				.collapse-inner {
					padding: .5rem 0;
					min-width: 10rem;
					font-size: $dropdown-font-size;
					margin: 0 0 1rem 0;
					.collapse-header {
						margin: 0;
						white-space: nowrap;
						padding: .5rem 1.5rem;
						text-transform: uppercase;
						font-weight: 800;
						font-size: 0.65rem;
						color: $gray-500;
					}
					.collapse-item {
						padding: 0.5rem 1rem;
						margin: 0 0.5rem;
						display: block;
						color: $gray-900;
						text-decoration: none;
						border-radius: $border-radius;
						white-space: nowrap;
						&:hover {
							background-color: $gray-200;
						}
						&:active {
							background-color: $gray-300;
						}
						&.active {
							color: $primary;
							font-weight: 700;
						}
					}
				}
			}
		}
		#sidebarToggle {
			width: 2.5rem;
			height: 2.5rem;
			text-align: center;
			margin-bottom: 1rem;
			cursor: pointer;
			&::after {
				font-weight: 900;
				content: '\f104';
				font-family: 'Font Awesome 5 Free';
				margin-right: 0.1rem;
			}
			&:hover {
				text-decoration: none;
			}
			&:focus {
				outline: none;
			}
		}
		&.toggled {
			width: 0 !important;
			overflow: hidden;
			#sidebarToggle::after {
				content: '\f105';
				font-family: 'Font Awesome 5 Free';
				margin-left: 0.25rem;
			}
		}
		.sidebar-brand {
			height: $topbar-base-height;
			text-decoration: none;
			font-size: 1rem;
			font-weight: 800;
			padding: 1.5rem 1rem;
			text-align: center;
			text-transform: uppercase;
			letter-spacing: 0.05rem;
			z-index: 1;

			.sidebar-brand-icon i {
				font-size: 2rem;
			}
			.sidebar-brand-text {
				display: none;
			}
		}
		hr.sidebar-divider {
			margin: 0 1rem 1rem;
		}
		.sidebar-heading {
			text-align: center;
			padding: 0 1rem;
			font-weight: 800;
			font-size: 0.65rem;
			@extend .text-uppercase;
		}
	}

	@include media-breakpoint-up(md) {
		.sidebar {
			width: $sidebar-base-width !important;
			.nav-item {
				// Accordion
				.collapse {
					position: relative;
					left: 0;
					z-index: 1;
					top: 0;
					animation: none;
					.collapse-inner {
						border-radius: 0;
						box-shadow: none;
					}
				}
				.collapsing {
					display: block;
					transition: $transition-collapse;
				}
				.collapse,
				.collapsing {
					margin: 0 1rem;
				}
				.nav-link {
					display: block;
					width: 100%;
					text-align: left;
					padding: 1rem;
					width: $sidebar-base-width;
					i {
						font-size: 0.85rem;
						margin-right: 0.25rem;
					}
					span {
						font-size: 0.85rem;
						display: inline;
					}
					// Accordion Arrow Icon
					&[data-toggle="collapse"] {
						&::after {
							width: 1rem;
							text-align: center;
							float: right;
							vertical-align: 0;
							border: 0;
							font-weight: 900;
							content: '\f107';
							font-family: 'Font Awesome 5 Free';
						}
						&.collapsed::after {
							content: '\f105';
						}
					}
				}
			}
			.sidebar-brand {
				.sidebar-brand-icon i {
					font-size: 2rem;
				}
				.sidebar-brand-text {
					display: inline;
				}
			}
			.sidebar-heading {
				text-align: left;
			}
			&.toggled {
				overflow: visible;
				width: $sidebar-collapsed-width !important;
				.nav-item {
					// Accordion
					.collapse {
						position: absolute;
						left: calc(#{$sidebar-collapsed-width} + #{$grid-gutter-width} / 2);
						z-index: 1;
						top: 2px;
						// Grow In Animation for Toggled State
						animation-name: growIn;
						animation-duration: 200ms;
						animation-timing-function: transform cubic-bezier(.18,1.25,.4,1), opacity cubic-bezier(0,1,.4,1);
						.collapse-inner {
							box-shadow: $box-shadow;
							border-radius: $border-radius;
						}
					}
					.collapsing {
						display: none;
						transition: none;
					}
					.collapse,
					.collapsing {
						margin: 0;
					}
					&:last-child {
						margin-bottom: 1rem;
					}
					.nav-link {
						text-align: center;
						padding: 0.75rem 1rem;
						width: $sidebar-collapsed-width;
						span {
							font-size: 0.65rem;
							display: block;
						}
						i {
							margin-right: 0;
						}
						&[data-toggle="collapse"]::after {
							display: none;
						}
					}
				}
				.sidebar-brand {
					.sidebar-brand-icon i {
						font-size: 2rem;
					}
					.sidebar-brand-text {
						display: none;
					}
				}
				.sidebar-heading {
					text-align: center;
				}
			}
		}
	}

	// Sidebar Color Variants

	// Sidebar Light
	.sidebar-light {
		.sidebar-brand {
			color: $gray-700;
		}
		hr.sidebar-divider {
			border-top: 1px solid $gray-200;
		}
		.sidebar-heading {
			color: $gray-500;
		}
		.nav-item {
			.nav-link {
				color: $gray-600;
				i {
					color: $gray-400;
				}
				&:active,
				&:focus,
				&:hover {
					color: $gray-700;
					i {
						color: $gray-700;
					}
				}
				// Accordion
				&[data-toggle="collapse"]::after {
					color: $gray-500;
				}
			}
			&.active {
				.nav-link {
					color: $gray-700;
					i {
						color: $gray-700;
					}
				}
			}
		}
		// Color the sidebar toggler
		#sidebarToggle {
			background-color: $gray-200;
			&::after {
				color: $gray-500;
			}
			&:hover {
				background-color: $gray-300;
			}
		}
	}

	// Sidebar Dark
	.sidebar-dark {
		.sidebar-brand {
			color: $white;
		}
		hr.sidebar-divider {
			border-top: 1px solid fade-out($white, 0.85);
		}
		.sidebar-heading {
			color: fade-out($white, 0.6);
		}
		.nav-item {
			.nav-link {
				color: fade-out($white, 0.2);
				i {
					color: fade-out($white, 0.7);
				}
				&:active,
				&:focus,
				&:hover {
					color: $white;
					i {
						color: $white;
					}
				}
				// Accordion
				&[data-toggle="collapse"]::after {
					color: fade-out($white, 0.5);
				}
			}
			&.active {
				.nav-link {
					color: $white;
					i {
						color: $white;
					}
				}
			}
		}
		// Color the sidebar toggler
		#sidebarToggle {
			background-color: fade-out($white, 0.8);
			&::after {
				color: fade-out($white, 0.5);
			}
			&:hover {
				background-color: fade-out($white, 0.75);
			}
		}
		&.toggled {
			#sidebarToggle::after {
				color: fade-out($white, 0.5);
			}
		}
	}
</style>
