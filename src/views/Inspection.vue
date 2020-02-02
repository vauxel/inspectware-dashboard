<template>
	<div class="expand-content">
		<div id="map"></div>
		<div class="inspection-header">
			<div class="inspection-overview">
				<img class="inspection-property-preview" :src="previewImage">
				<div class="inspection-details">
					<div class="inspection-address">{{ address }}</div>
					<div class="inspection-detail">
						<span class="inspection-detail-key">Inspection ID</span>
						<span class="inspection-detail-value">{{ id }}</span>
					</div>
					<div class="inspection-detail">
						<span class="inspection-detail-key">Client Name(s)</span>
						<span class="inspection-detail-value">{{ client1.name }}<span v-if="client2"> & {{ client2.name }}</span></span>
					</div>
					<div class="inspection-detail" v-if="sellRealtor">
						<span class="inspection-detail-key">Selling Realtor Name</span>
						<span class="inspection-detail-value">{{ sellRealtor.name }}</span>
					</div>
					<div class="inspection-detail" v-if="buyRealtor">
						<span class="inspection-detail-key">Buying Realtor Name</span>
						<span class="inspection-detail-value">{{ buyRealtor.name }}</span>
					</div>
				</div>
			</div>
			<div class="inspection-actions">
				<Button type="info" :to="gMapsLink" target="_blank">Get Directions</Button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Mapbox from "mapbox-gl";
	import HTTP from "../classes/http";

	@Component({})
	export default class Inspection extends Vue {
		private accessToken = "pk.eyJ1IjoiaW5zcGVjdHdhcmUiLCJhIjoiY2p5dDBkZjJ1MDByZzNvbWZmMDV4NnI2MiJ9.HYKSg6GlZrG7xz15KxwaIQ";
		private mapStyle = "mapbox://styles/mapbox/streets-v11";
		private mapCenter = {lat: 35.700064, lng: -78.755007 };
		private map: Mapbox.Map;

		private address = "";
		private id = "";
		private client1 = {
			name: ""
		};
		private client2 = {
			name: ""
		};
		private sellRealtor = {
			name: ""
		};
		private buyRealtor = {
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

				this.id = result.data.data.id;
				this.address = result.data.data.address;
				this.client1 = result.data.data.client1;
				this.client2 = result.data.data.client2;
				this.sellRealtor = result.data.data.realtor_selling;
				this.buyRealtor = result.data.data.realtor_buying;
			} catch {
				// TODO: push "inspection not found" notification
				this.$router.push("/");
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	.expand-content {
		margin: -20px;
	}

	#map {
		height: 200px;
		box-shadow: $shadow-1;
	}

	.inspection-header {
		display: flex;
		margin: 0 20px 10px 20px;
		position: relative;
		top: -40px;
	}

	.inspection-overview {
		flex-grow: 1;
		display: flex;
		background-color: $color_white;
		box-shadow: $shadow-1;
		padding: 10px;
		margin-right: 10px;

		.inspection-property-preview {
			max-width: 200px;
			height: 150px;
			border-radius: 5px;
			box-shadow: $shadow-2;
		}

		.inspection-details {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-left: 15px;

			.inspection-address {
				font-size: $font-size_3xl;
				font-weight: 600;
				border-bottom: 2px solid $color_grey-3;
				margin-bottom: 5px;
				padding-bottom: 5px;
			}

			.inspection-detail {
				.inspection-detail-key {
					color: $color_grey-6;
					text-transform: uppercase;
					font-size: $font-size_sm;
					margin-right: 7.5px;
					font-style: italic;
				}

				.inspection-detail-value {
					font-weight: 600;
				}
			}
		}
	}

	.inspection-actions {
		display: flex;
		flex-direction: column;
		background-color: $color_white;
		box-shadow: $shadow-1;
		padding: 10px;
		justify-content: space-around;

		button:not(:last-of-type) {
			margin-bottom: 10px;
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
			content: '\f015';
			font-family: "Font Awesome 5 Free";
			font-weight: 900;
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
