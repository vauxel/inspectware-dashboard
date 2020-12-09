<template>
	<div class="expand-content">
		<div id="map">
			<div class="inspection-header">
				<img class="inspection-property-preview" :src="previewImage">
				<div class="inspection-overview">
					<div class="inspection-address">{{ fullPropertyAddress }}</div>
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
				<div class="panel flex-grow">
					<div class="panel-head">
						<div class="panel-title">
							<i class="fas fa-fw fa-home"></i>
							Property Details
						</div>
						<div class="panel-options">
							<Button type="warning" size="small" @click="showEditPropertyDetailsModal">
								<i class="fas fa-fw fa-edit"></i>
								Edit
							</Button>
							<Modal
								v-model="editPropertyDetailsModal"
								title="Edit Property Details"
								:loading="editPropertyDetailsLoading"
								@on-ok="editPropertyDetails">
								<Form ref="editPropertyDetailsForm" :model="editProperty" label-position="top">
									<FormItem label="Street Address 1" prop="address1">
										<Input v-model="editProperty.address1" placeholder="Enter the primary address"></Input>
									</FormItem>
									<FormItem label="Street Address 2" prop="address2">
										<Input v-model="editProperty.address2" placeholder="Optional secondary address"></Input>
									</FormItem>
									<FormItem label="City" prop="city">
										<Input v-model="editProperty.city" placeholder="Enter the city"></Input>
									</FormItem>
									<FormItem label="State" prop="state">
										<masked-input
											type="text"
											class="ivu-input"
											v-model="editProperty.state"
											:mask="[/[A-Za-z]/, /[A-Za-z]/]"
											:guide="false"
											placeholder="Enter the state abbreviation">
										</masked-input>
									</FormItem>
									<FormItem label="ZIP Code" prop="zip">
										<masked-input
											type="text"
											class="ivu-input"
											v-model="editProperty.zip"
											:mask="[/\d/, /\d/, /\d/, /\d/, /\d/]"
											:guide="false"
											placeholder="Enter the digit zip code">
										</masked-input>
									</FormItem>
									<FormItem label="Square Footage" prop="sqft">
										<masked-input
											type="text"
											class="ivu-input"
											v-model="editProperty.sqft"
											:mask="[/\d/, /\d/, /\d/, /\d/, /\d/]"
											:guide="false"
											placeholder="Enter the whole-number square footage">
										</masked-input>
									</FormItem>
									<FormItem label="Year Built" prop="year_built">
										<masked-input
											type="text"
											class="ivu-input"
											v-model="editProperty.year_built"
											:mask="[/\d/, /\d/, /\d/, /\d/]"
											:guide="false"
											placeholder="Enter the year the home was built">
										</masked-input>
									</FormItem>
									<FormItem label="Foundation Type" prop="foundation">
										<Select v-model="editProperty.foundation" placeholder="Choose the foundation type">
											<Option value="slab">Slab</Option>
											<Option value="crawlspace">Crawlspace</Option>
											<Option value="basement">Basement</Option>
										</Select>
									</FormItem>
								</Form>
								<p class="inspection-property-details-edit-message">Any field left blank, except for "Street Address 2", will not be updated.</p>
							</Modal>
						</div>
					</div>
					<div class="panel-body">
						<div class="inspection-property-details">
							<div class="inspection-detail">
								<span class="inspection-detail-key">Street Address <span v-if="property.address2">1</span></span>
								<span class="inspection-detail-value">{{ property.address1 }}</span>
							</div>
							<div class="inspection-detail" v-if="property.address2">
								<span class="inspection-detail-key">Street Address 2</span>
								<span class="inspection-detail-value">{{ property.address2 }}</span>
							</div>
							<div class="inspection-detail">
								<span class="inspection-detail-key">City</span>
								<span class="inspection-detail-value">{{ property.city }}</span>
							</div>
							<div class="inspection-detail">
								<span class="inspection-detail-key">State</span>
								<span class="inspection-detail-value">{{ property.state }}</span>
							</div>
							<div class="inspection-detail">
								<span class="inspection-detail-key">ZIP Code</span>
								<span class="inspection-detail-value">{{ property.zip }}</span>
							</div>
							<div class="inspection-detail">
								<span class="inspection-detail-key">Square Footage</span>
								<span class="inspection-detail-value">{{ property.sqft }}</span>
							</div>
							<div class="inspection-detail">
								<span class="inspection-detail-key">Year Built</span>
								<span class="inspection-detail-value">{{ property.year_built }}</span>
							</div>
							<div class="inspection-detail">
								<span class="inspection-detail-key">Foundation Type</span>
								<span class="inspection-detail-value">{{ property.foundation.toUpperCase() }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							<i class="fas fa-fw fa-toolbox"></i>
							Services Requested
						</div>
					</div>
					<div class="panel-body">
						<div class="inspection-services">
							<div class="inspection-service" v-for="service in services" :key="service" :value="service">{{ service }}</div>
							<div class="inspection-service" v-for="service in services" :key="service" :value="service">{{ service }}</div>
							<div class="inspection-service" v-for="service in services" :key="service" :value="service">{{ service }}</div>
						</div>
					</div>
				</div>
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							<i class="fas fa-fw fa-calendar-day"></i>
							Appointment Details
						</div>
					</div>
					<div class="panel-body">
						<div class="inspection-appointment-details">
							<div class="inspection-detail">
								<span class="inspection-detail-key">Date</span>
								<span class="inspection-detail-value">{{ formatDate(date) }}</span>
							</div>
							<div class="inspection-detail">
								<span class="inspection-detail-key">Time</span>
								<span class="inspection-detail-value">{{ formatTime(time) }}</span>
							</div>
						</div>
					</div>
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
									<div class="inspection-document" data-type="generic">
										<a href="#" class="inspection-document-download"></a>
										<div class="inspection-document-name">Test Report</div>
										<div class="inspection-document-date">1/1/2020</div>
									</div>
									<div class="inspection-document" data-type="invoice">
										<a href="#" class="inspection-document-download"></a>
										<div class="inspection-document-name">Test Report</div>
										<div class="inspection-document-date">1/1/2020</div>
									</div>
									<div class="inspection-document" data-type="contract">
										<a href="#" class="inspection-document-download"></a>
										<div class="inspection-document-name">Test Report</div>
										<div class="inspection-document-date">1/1/2020</div>
									</div>
								</div>
							</div>
						</div>
						<div class="panel">
							<div class="panel-head">
								<div class="panel-title">
									<i class="fas fa-fw fa-money-bill-wave"></i>
									Payment
								</div>
								<div class="panel-options">
									<Button type="primary" size="small" @click="generateSendInvoice">
										<i class="fas fa-fw fa-file-export"></i>
										Generate & Send Invoice
									</Button>
								</div>
							</div>
							<div class="panel-body inspection-payment-container">
								<div class="inspection-payment-text payment-invoiced">Invoiced</div>
								<div class="inspection-payment-value payment-invoiced">$1000</div>
								<div class="inspection-payment-text payment-paid">Paid</div>
								<div class="inspection-payment-value payment-paid">$700</div>
								<div class="inspection-payment-divider"></div>
								<div class="inspection-payment-text payment-due">Due</div>
								<div class="inspection-payment-value payment-due">$300</div>
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
	import MaskedInput from "vue-text-mask";
	import HTTP from "@/classes/http";

	@Component({
		components: {
			MaskedInput
		}
	})
	export default class Inspection extends Vue {
		private accessToken = "pk.eyJ1IjoiaW5zcGVjdHdhcmUiLCJhIjoiY2p5dDBkZjJ1MDByZzNvbWZmMDV4NnI2MiJ9.HYKSg6GlZrG7xz15KxwaIQ";
		private mapStyle = "mapbox://styles/mapbox/streets-v11";
		private mapCenter = { lat: -1, lng: -1 };
		private map: Mapbox.Map | undefined;
		private mapPinContainer: Mapbox.Marker | undefined = undefined;
		private mapPinPulse: Mapbox.Marker | undefined = undefined;

		private property = {
			address1: "",
			address2: "",
			city: "",
			state: "",
			zip: -1,
			sqft: -1,
			year_built: -1,
			foundation: ""
		};
		private services = [];
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
		private date = "";
		private time = -1;
		private scheduled = -1;
		private previewImage = "https://photos.zillowstatic.com/cc_ft_768/ISni89iuad9ntt1000000000.webp";

		private editPropertyDetailsModal = false;
		private editPropertyDetailsLoading = true;
		private editProperty = {
			address1: "",
			address2: "",
			city: "",
			state: "",
			zip: -1,
			sqft: -1,
			year_built: -1,
			foundation: ""
		};

		mounted() {
			this.getInfo();
			Mapbox.accessToken = this.accessToken;
		}

		private async initMap() {
			await this.setMapCenter();

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
			this.mapPinContainer = new Mapbox.Marker(pinContainer).setLngLat(this.mapCenter).addTo(this.map);

			let pinPulse = document.createElement("div");
			pinPulse.className = "map-pulse";
			this.mapPinPulse = new Mapbox.Marker(pinPulse).setLngLat(this.mapCenter).addTo(this.map);
		}

		private destroyMap() {
			if (this.map && this.mapPinContainer && this.mapPinPulse) {
				this.mapPinContainer.remove();
				this.mapPinPulse.remove();
				this.mapPinContainer = undefined;
				this.mapPinPulse = undefined;
				this.map.remove();
				this.map = undefined;
			}
		}

		private async setMapCenter() {
			const result = await HTTP.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.fullPropertyAddress)}.json?access_token=${this.accessToken}`);
			if (result.status == 200) {
				if (result.data.features.length != 0) {
					if (result.data.features[0].relevance < 0.8) {
						this.destroyMap();
					} else {
						this.mapCenter.lng = result.data.features[0].center[0];
						this.mapCenter.lat = result.data.features[0].center[1];
					}
				}
			}
		}

		private updateMap() {
			if (this.mapPinContainer && this.mapPinPulse && this.map) {
				this.mapPinContainer.setLngLat(this.mapCenter);
				this.mapPinPulse.setLngLat(this.mapCenter);
				this.map.panTo(this.mapCenter);
			}
		}

		private get gMapsLink(): string {
			return "//www.google.com/maps/dir//" + this.fullPropertyAddress.replace(/\ /g, "+");
		}

		private get fullPropertyAddress(): string {
			return `${this.property.address1}${this.property.address2 ? " " + this.property.address2 : ""}, ${this.property.city}, ${this.property.state} ${this.property.zip}`;
		}

		private async getInfo() {
			try {
				const result = await HTTP.get("/inspection/info", {
					params: { id: this.$route.params.id }
				});

				this.id = result.data.data.id;
				this.property.address1 = result.data.data.property.address1;
				this.property.address2 = result.data.data.property.address2;
				this.property.city = result.data.data.property.city;
				this.property.state = result.data.data.property.state;
				this.property.zip = result.data.data.property.zip;
				this.property.sqft = result.data.data.property.sqft;
				this.property.year_built = result.data.data.property.year_built;
				this.property.foundation = result.data.data.property.foundation;
				this.services = result.data.data.services;
				this.client1 = result.data.data.client1;
				this.client2 = result.data.data.client2;
				this.realtor = result.data.data.realtor;
				this.date = result.data.data.date;
				this.time = result.data.data.time;
				this.scheduled = result.data.data.scheduled;

				this.initMap();
			} catch (e) {
				// TODO: push "inspection not found" notification
				//this.$router.push("/");
				console.error(e);
			}
		}

		private showEditPropertyDetailsModal() {
			this.editProperty.address1 = this.property.address1;
			this.editProperty.address2 = this.property.address2;
			this.editProperty.city = this.property.city;
			this.editProperty.state = this.property.state;
			this.editProperty.zip = this.property.zip;
			this.editProperty.sqft = this.property.sqft;
			this.editProperty.year_built = this.property.year_built;
			this.editProperty.foundation = this.property.foundation;
			this.editPropertyDetailsModal = true;
		}

		private async editPropertyDetails() {
			try {
				const result = await HTTP.post("/inspection/property_info", {
					id: this.id,
					address1: this.editProperty.address1 ? this.editProperty.address1 : undefined,
					address2: this.editProperty.address2,
					city: this.editProperty.city ? this.editProperty.city : undefined,
					state: this.editProperty.state ? this.editProperty.state.toUpperCase() : undefined,
					zip: this.editProperty.zip ? this.editProperty.zip : undefined,
					sqft: this.editProperty.sqft ? this.editProperty.sqft : undefined,
					year_built: this.editProperty.year_built ? this.editProperty.year_built : undefined,
					foundation: this.editProperty.foundation ? this.editProperty.foundation : undefined
				});

				if (result.data.status == 200) {
					this.property.address1 = !!this.editProperty.address1 ? this.editProperty.address1 : this.property.address1;
					this.property.address2 = this.editProperty.address2;
					this.property.city = !!this.editProperty.city ? this.editProperty.city : this.property.city;
					this.property.state = !!this.editProperty.state ? this.editProperty.state.toUpperCase() : this.property.state;
					this.property.zip = !!this.editProperty.zip ? this.editProperty.zip : this.property.zip;
					this.property.sqft = !!this.editProperty.sqft ? this.editProperty.sqft : this.property.sqft;
					this.property.year_built = !!this.editProperty.year_built ? this.editProperty.year_built : this.property.year_built;
					this.property.foundation = !!this.editProperty.foundation ? this.editProperty.foundation : this.property.foundation;

					if (!this.map) {
						await this.initMap();
					}

					await this.setMapCenter();
					this.updateMap();
				} else {
					this.$store.dispatch("pushNotice", {
						title: "Update Property Details Failed",
						desc: result.data.message,
						level: "error"
					});
				}
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Update Property Details Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}

			this.editPropertyDetailsModal = false;
		}

		private async generateSendInvoice() {
			alert("sent");
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

	.inspection-property-details,
	.inspection-appointment-details {
		line-height: 1.75;

		.inspection-detail {
			&:not(:last-child) {
				border-bottom: 1px dotted $color_grey-5;
			}

			.inspection-detail-key {
				font-size: $font-size_sm;
				font-weight: $font-weight_bold;
				text-transform: uppercase;
			}

			.inspection-detail-value {
				float: right;
			}
		}
	}

	.inspection-property-details-edit-message {
		text-align: center;
		font-style: italic;
	}

	.inspection-services {
		.inspection-service {
			font-size: $font-size_lg;

			&:not(:last-child) {
				margin-bottom: 1rem;
			}

			&::before {
				content: '';
				display: inline-block;
				vertical-align: middle;
				width: 0.5rem;
				height: 0.5rem;
				background-color: $color_primary;
				margin-right: 0.75rem;
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

			&:not(:last-child) {
				margin-bottom: 1rem;
			}

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
				width: 2.5rem;
				height: 2.5rem;
				background-color: $color_grey-3;
				text-align: center;
				border-radius: 25%;

				&::before {
					@include fa-icon("\f06e");
					text-decoration: none;
					line-height: 2.5rem;
					color: $color_grey-6;
				}

				&:hover {
					&::before {
						color: $color_grey-7;
					}
				}
			}
		}
	}

	.inspection-documents {
		.inspection-document {
			position: relative;

			&::after {
				content: '';
				clear: both;
				display: table;
			}

			&:not(:last-child) {
				border-bottom: 1px solid $color_grey-3;
				margin-bottom: 1rem;
				padding-bottom: 1rem;
			}

			&[data-type="generic"] {
				.inspection-document-download {
					&::before {
						@include fa-icon("\f15c");
					}
				}
			}

			&[data-type="invoice"] {
				.inspection-document-download {
					&::before {
						@include fa-icon("\f571");
					}
				}
			}

			&[data-type="contract"] {
				.inspection-document-download {
					&::before {
						@include fa-icon("\f56c");
					}
				}
			}

			.inspection-document-download {
				position: absolute;
				top: 0;
				left: 0;

				&::before {
					font-size: $font-size_4xl;
					color: $color_primary;
				}

				&:hover {
					&::before {
						@include fa-icon("\f56d");
						color: $color_primary-darker;
					}
				}
			}

			.inspection-document-name {
				float: right;
				font-weight: $font-weight_semibold;
			}

			.inspection-document-date {
				clear: right;
				float: right;
				font-size: $font-size_sm;
				color: $color_grey-6;
			}
		}
	}

	.inspection-payment-container {
		&::after {
			content: '';
			clear: both;
			display: table;
		}

		.inspection-payment-divider {
			clear: both;
			float: left;
			width: 100%;
			margin-bottom: 0.5rem;

			&::before {
				content: '';
				display: block;
				border-bottom: 1px solid $color_grey-4;
			}
		}

		.inspection-payment-text {
			clear: both;
			float: left;

			&.payment-invoiced {
				margin-bottom: 0.5rem;
				color: $color-grey-6;
			}

			&.payment-paid {
				margin-bottom: 1rem;
				color: $color-grey-6;
			}

			&.payment-due {
				font-size: $font-size_xl;
				font-weight: $font-weight_semibold;
			}
		}

		.inspection-payment-value {
			float: right;

			&.payment-paid {
				&::before {
					content: '-';
					margin-right: 0.5rem;
				}
			}

			&.payment-due {
				font-size: $font-size_xl;
				font-weight: $font-weight_semibold;
			}
		}
	}
</style>

<style lang="scss">
	@import "@/scss/include.scss";

	.mapboxgl-control-container {
		display: none;
	}

	.map-pin-container {
		position: absolute;
		top: -5px;
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
		transform: rotate(0);

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
		position: absolute;
		top: 20px;

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
