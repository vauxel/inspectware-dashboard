<template>
	<div class="expand-content">
		<div id="map">
			<div class="inspection-header">
				<img class="inspection-property-preview" :src="previewImage">
				<div class="inspection-overview">
					<div class="inspection-address">{{ address }}</div>
					<div class="inspection-details">
						<div class="inspection-detail">
							<span class="inspection-detail-key">Inspection ID</span>
							<span class="inspection-detail-value">{{ id }}</span>
						</div>
						<div class="inspection-detail">
							<span class="inspection-detail-key">Client Name(s)</span>
							<span class="inspection-detail-value">{{ client1.name }}<span v-if="client2"> & {{ client2.name }}</span></span>
						</div>
						<div class="inspection-detail" v-if="realtor">
							<span class="inspection-detail-key">Realtor Name</span>
							<span class="inspection-detail-value">{{ realtor.name }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="inspection-actions">
				<Button type="info" :to="gMapsLink" target="_blank">Get Directions</Button>
				<Button type="info" :to="gMapsLink" target="_blank">Get Directions</Button>
				<Button type="info" :to="gMapsLink" target="_blank">Get Directions</Button>
			</div>
		</div>
		<div class="main-content">
			<div class="flex-row">
				<div class="inspection-pulse">
					<div class="inspection-status" data-status-state="complete">Invoice Paid</div>
					<div class="inspection-status" data-status-state="complete">Invoice Paid</div>
					<div class="inspection-status" data-status-state="complete">Invoice Paid</div>
				</div>
			</div>
			<div class="flex-row flex-gutter-2">
				<div class="inspection-leftcol">
					<div class="panel">
						<div class="panel-head">
							<div class="panel-title">
								<i class="fas fa-fw fa-users"></i>
								People
							</div>
						</div>
						<div class="panel-body">
							<div class="inspection-people">
								<div class="inspection-person" data-role="inspector">
									<a href="#">
										<div class="inspection-person-avatar">AV</div>
										<div class="inspection-person-details">
											<div class="inspection-person-name">Austin Villee</div>
											<div class="inspection-person-role">Inspector</div>
										</div>
									</a>
									<div class="inspection-person-contact">
										<a class="inspection-person-email" href="mailto:fakeemail@gmail.com">fakeemail@gmail.com</a>
										<a class="inspection-person-phone" href="tel:(919)999-9999">(919)999-9999</a>
									</div>
								</div>
								<div class="inspection-person" data-role="client">
									<a href="#">
										<div class="inspection-person-avatar">JD</div>
										<div class="inspection-person-details">
											<div class="inspection-person-name">John Doe</div>
											<div class="inspection-person-role">Client</div>
										</div>
									</a>
									<div class="inspection-person-contact">
										<a class="inspection-person-email" href="mailto:fakeemail@gmail.com">fakeemail@gmail.com</a>
										<a class="inspection-person-phone" href="tel:(919)999-9999">(919)999-9999</a>
									</div>
								</div>
								<div class="inspection-person" data-role="realtor">
									<a href="#">
										<div class="inspection-person-avatar">JS</div>
										<div class="inspection-person-details">
											<div class="inspection-person-name">Jane Smith</div>
											<div class="inspection-person-role">Realtor</div>
										</div>
									</a>
									<div class="inspection-person-contact">
										<a class="inspection-person-email" href="mailto:fakeemail@gmail.com">fakeemail@gmail.com</a>
										<a class="inspection-person-phone" href="tel:919-999-9999">(919)999-9999</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="inspection-rightcol flex-grow">
					<div class="flex-row flex-gutter-2">
						<div class="panel flex-grow">
							<div class="panel-head">
								<div class="panel-title">
									<i class="fas fa-fw fa-paste"></i>
									Reports
								</div>
							</div>
							<div class="panel-body">
								<div class="inspection-reports">
									<div class="inspection-report">
										<div class="inspection-report-title">Final Report</div>
										<div class="inspection-report-author">Austin Villee</div>
										<div class="inspection-report-date">02/21/2020</div>
										<a href="#" class="inspection-report-view"></a>
									</div>
								</div>
							</div>
						</div>
						<div class="panel flex-grow">
							<div class="panel-head">
								<div class="panel-title">
									<i class="fas fa-fw fa-file-signature"></i>
									Documents
								</div>
							</div>
							<div class="panel-body">
								<div class="inspection-documents">
									<div class="inspection-document">
										
									</div>
								</div>
							</div>
						</div>
						<div class="panel flex-grow">
							<div class="panel-head">
								<div class="panel-title">
									<i class="fas fa-fw fa-money-bill-wave"></i>
									Payment
								</div>
							</div>
							<div class="panel-body">
								
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Mapbox from "mapbox-gl";
	import HTTP from "@/classes/http";

	@Component({})
	export default class Inspection extends Vue {
		private accessToken = "pk.eyJ1IjoiaW5zcGVjdHdhcmUiLCJhIjoiY2p5dDBkZjJ1MDByZzNvbWZmMDV4NnI2MiJ9.HYKSg6GlZrG7xz15KxwaIQ";
		private mapStyle = "mapbox://styles/mapbox/streets-v11";
		private mapCenter = {lat: 35.700064, lng: -78.755007 };
		private map: Mapbox.Map | undefined;

		private address = "";
		private id = "";
		private client1 = {
			name: ""
		};
		private client2 = {
			name: ""
		};
		private realtor = {
			name: ""
		};
		private previewImage = "https://photos.zillowstatic.com/cc_ft_768/ISni89iuad9ntt1000000000.webp";

		mounted() {
			this.getGeneralInfo();

			Mapbox.accessToken = this.accessToken;

			this.map = new Mapbox.Map({
				container: "map",
				style: this.mapStyle,
				center: this.mapCenter,
				zoom: 15
			});

			let pin = document.createElement("div");
			pin.className = "map-pin";
			let pinContainer = document.createElement("div");
			pinContainer.className = "map-pin-container";
			pinContainer.appendChild(pin);
			new Mapbox.Marker(pinContainer).setLngLat(this.mapCenter).addTo(this.map);

			let pinPulse = document.createElement("div");
			pinPulse.className = "map-pulse";
			new Mapbox.Marker(pinPulse).setLngLat(this.mapCenter).addTo(this.map);
		}

		private get gMapsLink(): string {
			return "//www.google.com/maps/dir//" + this.address.replace(/\ /g, "+");
		}

		private async getGeneralInfo() {
			try {
				const result = await HTTP.get("/inspection/general_info", {
					params: { id: this.$route.params.id }
				});

				console.log(result);

				this.id = result.data.data.id;
				this.address = result.data.data.address;
				this.client1 = result.data.data.client1;
				this.client2 = result.data.data.client2;
				this.realtor = result.data.data.realtor;
			} catch (e) {
				// TODO: push "inspection not found" notification
				//this.$router.push("/");
				console.error(e);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	$inspection-person-avatar-size: 48px;

	.expand-content {
		margin: -2rem;
	}

	.main-content {
		margin: 2rem;
	}

	#map {
		height: 250px;
		position: relative;
		box-shadow: $shadow-1;

		&:hover {
			.inspection-header:not(:hover),
			.inspection-actions:not(:hover) {
				opacity: 0.25;
			}
		}
	}

	.inspection-header {
		display: flex;
		justify-content: space-between;
		position: absolute;
		top: 2rem;
		left: 2rem;
		z-index: 2;
	}

	.inspection-property-preview {
		width: auto;
		max-height: 125px;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		box-shadow: $shadow-2;
	}

	.inspection-overview {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: $color_white;
		box-shadow: $shadow-1;
		padding: 1rem;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;

		.inspection-address {
			font-size: $font-size_3xl;
			font-weight: $font-weight_bold;
		}

		.inspection-detail {
			.inspection-detail-key {
				color: $color_grey-6;
				text-transform: uppercase;
				font-size: $font-size_sm;
				margin-right: 0.75rem;
				font-style: italic;
			}

			.inspection-detail-value {
				font-weight: $font-weight_bold;
			}
		}
	}

	.inspection-actions {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		position: absolute;
		border-radius: 5px;
		top: 2rem;
		right: 2rem;
		bottom: 2rem;
		z-index: 2;

		> a, button {
			box-shadow: $shadow-2;

			&:not(:last-of-type) {
				margin-bottom: 1.5rem;
			}
		}
	}

	.inspection-header,
	.inspection-actions {
		transition: $transition-length_normal opacity;

		&:hover {
			opacity: 1;
		}
	}

	.inspection-pulse {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
		padding: 1rem;
		background-color: $color_primary;
		box-shadow: $shadow-1;
		border-radius: 5px;

		.inspection-status {
			position: relative;
			min-width: 180px;
			margin: 0 0.5rem;
			padding: 0.5rem 0.5rem 0.5rem 1rem;
			background-color: $color_primary-darker;
			border-radius: 5px;
			color: $color_white;
			line-height: 3rem;
			font-weight: $font-weight_semibold;

			&::after {
				content: '';
				display: block;
				float: right;
				width: 3rem;
				height: 3rem;
				font-family: "Font Awesome 5 Free";
				font-weight: 900;
				font-size: 1.5rem;
				color: $color_white;
				border-radius: 5px;
				text-align: center;
				line-height: 3rem;
				opacity: 0.8;
			}

			&[data-status-state="incomplete"] {
				&::after {
					content: '\f00d';
					background-color: $color_red;
				}
			}

			&[data-status-state="complete"] {
				&::after {
					content: '\f00c';
					background-color: $color_green;
				}
			}
		}
	}

	.inspection-people {
		display: flex;
		flex-direction: column;

		.inspection-person {
			position: relative;

			&:not(:last-of-type) {
				margin-bottom: 3rem;
			}

			&::before {
				position: absolute;
				top: -0.75rem;
				left: -0.75rem;
				width: 2.5rem;
				height: 2.5rem;
				line-height: 2.5rem;
				text-align: center;
				background-color: $color_primary-lighter;
				color: $color_white;
				box-shadow: $shadow-1;
				border-radius: 50%;
				transition: background-color $transition-length_normal;
			}

			&[data-role="inspector"]::before {
				@include fa-icon("\f807");
			}

			&[data-role="client"]::before {
				@include fa-icon("\f007");
			}

			&[data-role="realtor"]::before {
				@include fa-icon("\f4d9");
			}

			a {
				color: inherit;
			}

			> a:hover {
				.inspection-person-avatar {
					background-color: $color_primary-darker;
					margin-right: 1.25rem;
				}
			}

			.inspection-person-avatar {
				width: $inspection-person-avatar-size;
				height: $inspection-person-avatar-size;
				background-color: $color_primary;
				line-height: $inspection-person-avatar-size;
				text-align: center;
				color: $color_white;
				font-weight: $font-weight_bold;
				display: inline-block;
				border-radius: 25%;
				margin-right: 1rem;
				vertical-align: middle;
				transition: margin-right $transition-length_normal, background-color $transition-length_normal;
			}

			.inspection-person-details {
				display: inline-block;
				vertical-align: middle;
			}

			.inspection-person-name {
				font-size: $font-size_lg;
				font-weight: $font-weight_semibold;
				transition: color $transition-length_normal;
			}

			.inspection-person-role {
				font-size: $font-size_sm;
				color: $color_grey-6;
			}

			.inspection-person-contact {
				margin-top: 1rem;
				background-color: $color_white-3;
				border-radius: 5px;
				font-size: $font-size_sm;
				padding: 1rem;
			}

			.inspection-person-email,
			.inspection-person-phone {
				display: block;

				&::before {
					display: inline-block;
					margin-right: 0.75rem;
				}

				&:hover {
					text-decoration: underline;
				}
			}

			.inspection-person-email {
				margin-bottom: 0.25rem;

				&::before {
					@include fa-icon("\f199");
				}
			}

			.inspection-person-phone {
				&::before {
					@include fa-icon("\f87b");
				}
			}
		}
	}

	.inspection-reports {
		.inspection-report {
			background-color: $color_white-2;
			border-radius: 5px;
			padding: 1rem;
			position: relative;

			.inspection-report-title {
				font-size: $font-size_lg;
				font-weight: $font-weight_semibold;
			}

			.inspection-report-author,
			.inspection-report-date {
				font-size: $font-size_sm;
				color: $color_grey-6;
			}

			.inspection-report-view {
				position: absolute;
				top: 1rem;
				right: 1rem;

				&::before {
					@include fa-icon("\f06e");
					text-decoration: none;
				}
			}
		}
	}
</style>

<style lang="scss">
	@import "@/scss/include.scss";

	.map-pin-container {
		position: relative;
		bottom: 10px;
		width: 40px;
		height: 40px;
		z-index: 1;
	}

	.map-pin {
		width: 40px;
		height: 40px;
		border-radius: 50% 50% 10% 50%;
		background-color: $color_primary;
		rotate: 45deg;
		transform: rotate(45deg);

		&:after {
			@include fa-icon('\f015');
			width: 24px;
			height: 24px;
			color: $color_grey-1;	
			text-align: center;
			line-height: 24px;
			position: absolute;
			margin: 8px 0 0 8px;
			background-color: $color_primary-darker;
			border-radius: 50%;
			transform: rotate(-45deg);
		}
	}

	.map-pulse {
		background: rgba(0,0,0,0.2);
		border-radius: 50%;
		height: 14px;
		width: 14px;
		position: relative;
		top: -20px;

		&:after {
			content: "";
			border-radius: 50%;
			height: 40px;
			width: 40px;
			position: absolute;
			margin: -13px 0 0 -13px;
			animation: pulsate 1s ease-out;
			animation-iteration-count: infinite;
			opacity: 0.0;
			box-shadow: 0 0 1px 2px #89849b;
			animation-delay: 1.1s;
		}
	}

	@keyframes pulsate {
		0% {
			transform: scale(0.1, 0.1);
			opacity: 0.0;
		}

		50% {
			opacity: 1.0;
		}

		100% {
			transform: scale(1.2, 1.2);
			opacity: 0;
		}
	}
</style>
