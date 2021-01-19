<template>
	<div id="page-inspection" class="expand-content">
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
				<Button type="info" :to="gMapsLink" target="_blank"><i class="fas fa-map-marked-alt"></i> Get Directions</Button>
			</div>
		</div>
		<div class="main-content">
			<div class="row">
				<div class="col-xs-12">
					<div class="inspection-pulse">
						<div class="inspection-status" data-status-state="incomplete" v-if="!payment.invoice_sent">Invoice Not Sent</div>
						<div class="inspection-status" data-status-state="complete" v-if="payment.invoice_sent">Invoice Sent</div>
						<div class="inspection-status" data-status-state="incomplete" v-if="payment.invoice_sent && payment.balance !== 0">Invoice Unpaid</div>
						<div class="inspection-status" data-status-state="complete" v-if="payment.invoice_sent && payment.balance === 0">Invoice Paid</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-6">
					<div class="panel panel-grow">
						<div class="panel-head">
							<div class="panel-title">
								<i class="fas fa-fw fa-home"></i>
								Property Details
							</div>
							<div class="panel-options" v-if="!detailsLocked">
								<Button type="warning" size="small" @click="showEditPropertyDetailsModal">
									<i class="fas fa-fw fa-edit"></i>
									Edit
								</Button>
								<Modal
									v-model="editPropertyDetailsModal"
									title="Edit Property Details"
									:loading="editPropertyDetailsLoading"
									@on-ok="doEditPropertyDetails">
									<Form ref="editPropertyDetailsForm" :model="editPropertyDetails" label-position="top">
										<FormItem label="Street Address 1" prop="address1">
											<Input v-model="editPropertyDetails.address1" placeholder="Enter the primary address"></Input>
										</FormItem>
										<FormItem label="Street Address 2" prop="address2">
											<Input v-model="editPropertyDetails.address2" placeholder="Optional secondary address"></Input>
										</FormItem>
										<FormItem label="City" prop="city">
											<Input v-model="editPropertyDetails.city" placeholder="Enter the city"></Input>
										</FormItem>
										<FormItem label="State" prop="state">
											<masked-input
												type="text"
												class="ivu-input"
												v-model="editPropertyDetails.state"
												:mask="[/[A-Za-z]/, /[A-Za-z]/]"
												:guide="false"
												placeholder="Enter the state abbreviation">
											</masked-input>
										</FormItem>
										<FormItem label="ZIP Code" prop="zip">
											<masked-input
												type="text"
												class="ivu-input"
												v-model="editPropertyDetails.zip"
												:mask="[/\d/, /\d/, /\d/, /\d/, /\d/]"
												:guide="false"
												placeholder="Enter the digit zip code">
											</masked-input>
										</FormItem>
										<FormItem label="Square Footage" prop="sqft">
											<masked-input
												type="text"
												class="ivu-input"
												v-model="editPropertyDetails.sqft"
												:mask="[/\d/, /\d/, /\d/, /\d/, /\d/]"
												:guide="false"
												placeholder="Enter the whole-number square footage">
											</masked-input>
										</FormItem>
										<FormItem label="Year Built" prop="year_built">
											<masked-input
												type="text"
												class="ivu-input"
												v-model="editPropertyDetails.year_built"
												:mask="[/\d/, /\d/, /\d/, /\d/]"
												:guide="false"
												placeholder="Enter the year the home was built">
											</masked-input>
										</FormItem>
										<FormItem label="Foundation Type" prop="foundation">
											<Select v-model="editPropertyDetails.foundation" placeholder="Choose the foundation type">
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
				</div>
				<div class="col-xs-3">
					<div class="panel panel-grow">
						<div class="panel-head">
							<div class="panel-title">
								<i class="fas fa-fw fa-toolbox"></i>
								Services Requested
							</div>
							<div class="panel-options" v-if="!detailsLocked">
								<Button type="warning" size="small" @click="showEditServicesModal">
									<i class="fas fa-fw fa-edit"></i>
									Edit
								</Button>
							</div>
						</div>
						<div class="panel-body">
							<div class="inspection-services">
								<div class="inspection-service" v-for="service in services" :key="service" :value="service">{{ service }}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-3">
					<div class="panel panel-grow">
						<div class="panel-head">
							<div class="panel-title">
								<i class="fas fa-fw fa-calendar-day"></i>
								Appointment Details
							</div>
							<div class="panel-options" v-if="!detailsLocked">
								<Button type="warning" size="small" @click="showEditAppointmentModal">
									<i class="fas fa-fw fa-edit"></i>
									Edit
								</Button>
								<Modal
									v-model="editAppointmentModal"
									title="Edit Appointment Date/Time"
									:loading="editAppointmentLoading"
									@on-ok="doEditAppointment">
									<Form ref="editAppointmentForm" :model="editAppointment" label-position="top">
										<FormItem label="Appointment Date" prop="date">
											<DatePicker
												type="date"
												format="M/d/yyyy"
												:options="editAppointmentDateOptions"
												v-model="editAppointment.date"
												style="width: 100%"
												placeholder="Select new appointment date">
											</DatePicker>
										</FormItem>
										<FormItem label="Appointment Time" prop="time">
											<Row :gutter="5">
												<Col span="8">
													<Select v-model="editAppointment.time.hour" placeholder="Hour">
														<Option v-for="hour in 12" :key="hour" :value="hour">{{ hour }}</Option>
													</Select>
												</Col>
												<Col span="8">
													<Select v-model="editAppointment.time.minute" placeholder="Minute">
														<Option v-for="minute in minutes" :key="minute" :value="minute">{{ ('' + minute).padStart(2, '0') }}</Option>
													</Select>
												</Col>
												<Col span="8">
													<Select v-model="editAppointment.time.period" placeholder="Half">
														<Option value="AM">AM</Option>
														<Option value="PM">PM</Option>
													</Select>
												</Col>
											</Row>
										</FormItem>
									</Form>
								</Modal>
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
			</div>
			<div class="row">
				<div class="col-xs-2">
					<div class="panel panel-grow">
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
										<div class="inspection-person-avatar">{{ getInitials(inspector.name) }}</div>
										<div class="inspection-person-details">
											<div class="inspection-person-name">{{ inspector.name }}</div>
											<div class="inspection-person-role">Inspector</div>
										</div>
									</a>
									<div class="inspection-person-contact">
										<a class="inspection-person-email" :href="'mailto:' + inspector.email" v-if="inspector.email">{{ inspector.email }}</a>
										<a class="inspection-person-phone" :href="'tel:' + formatPhoneNumber(inspector.phone)" v-if="inspector.email">{{ formatPhoneNumber(inspector.phone) }}</a>
									</div>
								</div>
								<div class="inspection-person" data-role="client" v-if="client1">
									<a href="#">
										<div class="inspection-person-avatar">{{ getInitials(client1.name) }}</div>
										<div class="inspection-person-details">
											<div class="inspection-person-name">{{ client1.name }}</div>
											<div class="inspection-person-role">Client {{ client2 ? "1" : "" }}</div>
										</div>
									</a>
									<div class="inspection-person-contact">
										<a class="inspection-person-email" :href="'mailto:' + client1.email" v-if="client1.email">{{ client1.email }}</a>
										<a class="inspection-person-phone" :href="'tel:' + formatPhoneNumber(client1.phone)" v-if="client1.email">{{ formatPhoneNumber(client1.phone) }}</a>
									</div>
								</div>
								<div class="inspection-person" data-role="client" v-if="client2">
									<a href="#">
										<div class="inspection-person-avatar">{{ getInitials(client2.name) }}</div>
										<div class="inspection-person-details">
											<div class="inspection-person-name">{{ client2.name }}</div>
											<div class="inspection-person-role">Client 2</div>
										</div>
									</a>
									<div class="inspection-person-contact">
										<a class="inspection-person-email" :href="'mailto:' + client2.email" v-if="client2.email">{{ client2.email }}</a>
										<a class="inspection-person-phone" :href="'tel:' + formatPhoneNumber(client2.phone)" v-if="client2.email">{{ formatPhoneNumber(client2.phone) }}</a>
									</div>
								</div>
								<div class="inspection-person" data-role="realtor" v-if="realtor">
									<a href="#">
										<div class="inspection-person-avatar">{{ getInitials(realtor.name) }}</div>
										<div class="inspection-person-details">
											<div class="inspection-person-name">{{ realtor.name }}</div>
											<div class="inspection-person-role">Realtor</div>
										</div>
									</a>
									<div class="inspection-person-contact">
										<a class="inspection-person-email" :href="'mailto:' + realtor.email" v-if="realtor.email">{{ realtor.email }}</a>
										<a class="inspection-person-phone" :href="'tel:' + formatPhoneNumber(realtor.phone)" v-if="realtor.phone">{{ formatPhoneNumber(realtor.phone) }}</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-3">
					<div class="panel">
						<div class="panel-head">
							<div class="panel-title">
								<i class="fas fa-fw fa-paste"></i>
								Reports
							</div>
						</div>
						<div class="panel-body">
							<div class="inspection-reports">
								<!--<div class="inspection-report">
									<div class="inspection-report-title">Final Report</div>
									<div class="inspection-report-author">Austin Villee</div>
									<div class="inspection-report-date">02/21/2020</div>
									<a href="#" class="inspection-report-view"></a>
								</div>-->
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-3">
					<div class="panel">
						<div class="panel-head">
							<div class="panel-title">
								<i class="fas fa-fw fa-file-signature"></i>
								Documents
							</div>
						</div>
						<div class="panel-body">
							<div class="inspection-documents">
								<div class="inspection-document" :data-type="doc.doctype" v-for="doc in documents" :key="doc">
									<a :href="'/doc/' + doc.doctype.toLowerCase() + '/' + id + '?token=' + doc.token" class="inspection-document-download"></a>
									<div class="inspection-document-name">{{ doc.name }}</div>
									<div class="inspection-document-date">{{ timestampToDate(doc.created) }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-4">
					<div class="panel">
						<div class="panel-head">
							<div class="panel-title">
								<i class="fas fa-fw fa-money-bill-wave"></i>
								Payment
							</div>
							<div class="panel-options" v-if="!payment.invoice_sent">
								<Button type="primary" size="small" @click="generateSendInvoice">
									<i class="fas fa-fw fa-file-export"></i>
									Generate & Send Invoice
								</Button>
							</div>
						</div>
						<div class="panel-body inspection-payment-container">
							<div class="inspection-payment-item payment-subsidiary" v-for="item in payment.details.items" :key="item">
								<div class="inspection-payment-text">{{ item.name }}</div>
								<div class="inspection-payment-value">${{ item.price }}</div>
							</div>
							<div class="inspection-payment-item">
								<div class="inspection-payment-text">Subtotal</div>
								<div class="inspection-payment-value">${{ payment.details.subtotal }}</div>
							</div>
							<div class="inspection-payment-item payment-subsidiary">
								<div class="inspection-payment-text">Tax ({{ payment.details.tax_percent }}%)</div>
								<div class="inspection-payment-value">${{ payment.details.tax }}</div>
							</div>
							<div class="inspection-payment-item payment-total">
								<div class="inspection-payment-text">{{ payment.invoice_sent ? "Invoiced" : "Total" }}</div>
								<div class="inspection-payment-value">${{ payment.invoice_sent ? payment.invoiced : payment.details.total }}</div>
							</div>
							<div class="inspection-payment-item payment-paid" v-if="payment.invoice_sent">
								<div class="inspection-payment-text">Paid</div>
								<div class="inspection-payment-value">${{ payment.invoiced - payment.balance }}</div>
							</div>
							<div class="inspection-payment-divider" v-if="payment.invoice_sent"></div>
							<div class="inspection-payment-item payment-due" v-if="payment.invoice_sent">
								<div class="inspection-payment-text">Due</div>
								<div class="inspection-payment-value">${{ payment.balance }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Mixins } from "vue-property-decorator";
	import { FormattingMixin } from "@/mixins";
	import Mapbox from "mapbox-gl";
	import MaskedInput from "vue-text-mask";
	import HTTP from "@/classes/http";

	@Component({
		components: {
			MaskedInput
		}
	})
	export default class Inspection extends Mixins(FormattingMixin) {
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
		private inspector = {
			id: "",
			name: "",
			email: "",
			phone: ""
		};
		private client1 = {
			id: "",
			name: "",
			email: "",
			phone: ""
		};
		private client2 = {
			id: "",
			name: "",
			email: "",
			phone: ""
		};
		private realtor = {
			id: "",
			name: "",
			email: "",
			phone: ""
		};
		private date = "";
		private time = -1;
		private scheduled = -1;
		private previewImage = "https://photos.zillowstatic.com/cc_ft_768/ISni89iuad9ntt1000000000.webp";

		private detailsLocked = false;

		private editPropertyDetailsModal = false;
		private editPropertyDetailsLoading = true;
		private editPropertyDetails = {
			address1: "",
			address2: "",
			city: "",
			state: "",
			zip: -1,
			sqft: -1,
			year_built: -1,
			foundation: ""
		};

		private minutes = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60 ];

		private editAppointmentModal = false;
		private editAppointmentLoading = true;
		private editAppointment = {
			date: "",
			time: {
				hour: 0,
				minute: 0,
				period: ""
			}
		}
		private editAppointmentDateOptions = {
			disabledDate(date: Date) {
				return date && date.valueOf() < Date.now() - 86400000;
			}
		};

		private payment = {
			invoice_sent: false,
			invoiced: 0,
			balance: 0,
			payments: [],
			details: {
				items: [],
				subtotal: 0,
				tax: 0,
				tax_percent: 0,
				total: 0
			}
		}

		private documents = [];

		mounted() {
			this.getInfo();
			this.getPaymentInfo();
			this.getDocuments();
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
				this.inspector = result.data.data.inspector;
				this.client1 = result.data.data.client1;
				this.client2 = result.data.data.client2;
				this.realtor = result.data.data.realtor;
				this.date = result.data.data.date;
				this.time = result.data.data.time;
				this.scheduled = result.data.data.scheduled;
				this.detailsLocked = result.data.data.details_locked;

				this.initMap();
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Get Inspection Info Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}
		}

		private async getPaymentInfo() {
			try {
				const result = await HTTP.get("/inspection/payment_info", {
					params: { id: this.$route.params.id }
				});

				this.payment = result.data.data;
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Get Payment Info Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}
		}

		private showEditPropertyDetailsModal() {
			this.editPropertyDetails.address1 = this.property.address1;
			this.editPropertyDetails.address2 = this.property.address2;
			this.editPropertyDetails.city = this.property.city;
			this.editPropertyDetails.state = this.property.state;
			this.editPropertyDetails.zip = this.property.zip;
			this.editPropertyDetails.sqft = this.property.sqft;
			this.editPropertyDetails.year_built = this.property.year_built;
			this.editPropertyDetails.foundation = this.property.foundation;
			this.editPropertyDetailsModal = true;
		}

		private showEditAppointmentModal() {
			this.editAppointment.date = this.formatDate(this.date);
			let formattedTimeParts = this.formatTimeParts(this.time);
			this.editAppointment.time.hour = formattedTimeParts.hour;
			this.editAppointment.time.minute = formattedTimeParts.minute;
			this.editAppointment.time.period = formattedTimeParts.period;
			this.editAppointmentModal = true;
		}

		private async doEditPropertyDetails() {
			try {
				const result = await HTTP.post("/inspection/property_info", {
					id: this.id,
					address1: this.editPropertyDetails.address1 ? this.editPropertyDetails.address1 : undefined,
					address2: this.editPropertyDetails.address2,
					city: this.editPropertyDetails.city ? this.editPropertyDetails.city : undefined,
					state: this.editPropertyDetails.state ? this.editPropertyDetails.state.toUpperCase() : undefined,
					zip: this.editPropertyDetails.zip ? this.editPropertyDetails.zip : undefined,
					sqft: this.editPropertyDetails.sqft ? this.editPropertyDetails.sqft : undefined,
					year_built: this.editPropertyDetails.year_built ? this.editPropertyDetails.year_built : undefined,
					foundation: this.editPropertyDetails.foundation ? this.editPropertyDetails.foundation : undefined
				});

				this.property.address1 = !!this.editPropertyDetails.address1 ? this.editPropertyDetails.address1 : this.property.address1;
				this.property.address2 = this.editPropertyDetails.address2;
				this.property.city = !!this.editPropertyDetails.city ? this.editPropertyDetails.city : this.property.city;
				this.property.state = !!this.editPropertyDetails.state ? this.editPropertyDetails.state.toUpperCase() : this.property.state;
				this.property.zip = !!this.editPropertyDetails.zip ? this.editPropertyDetails.zip : this.property.zip;
				this.property.sqft = !!this.editPropertyDetails.sqft ? this.editPropertyDetails.sqft : this.property.sqft;
				this.property.year_built = !!this.editPropertyDetails.year_built ? this.editPropertyDetails.year_built : this.property.year_built;
				this.property.foundation = !!this.editPropertyDetails.foundation ? this.editPropertyDetails.foundation : this.property.foundation;

				if (!this.map) {
					await this.initMap();
				}

				await this.setMapCenter();
				this.updateMap();

				this.$store.dispatch("pushMessage", {
					text: "Successfully updated property details",
					level: "success"
				});
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Update Property Details Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}

			this.editPropertyDetailsModal = false;
		}

		private async doEditAppointment() {
			try {
				let date = this.unformatDate(this.editAppointment.date);
				let time = this.unformatTimeParts(this.editAppointment.time);

				const result = await HTTP.post("/inspection/appointment", {
					id: this.id,
					date: date,
					time: time
				});

				this.date = date;
				this.time = time;

				this.$store.dispatch("pushMessage", {
					text: "Successfully updated appointment details",
					level: "success"
				});
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Update Appointment Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}

			this.editAppointmentModal = false;
		}

		private async generateSendInvoice() {
			this.$Modal.confirm({
				title: "Confirm Generate & Send Invoice",
				content: "<p>Are you sure you want to generate and send the invoice to the client(s)?</p><br><p><strong>Doing so will irreversibly lock the inspection details from being edited.</strong></p>",
				okText: "Generate & Send",
				loading: true,
				onOk: async () => {
					try {
						const result = await HTTP.post("/inspection/gen_invoice", {
							id: this.id
						});

						this.payment = result.data.data;
						this.detailsLocked = true;
						this.$Modal.remove();
						this.$store.dispatch("pushMessage", {
							text: "Successfully generated and sent invoice",
							level: "success"
						});
					} catch (error) {
						this.$Modal.remove();
						this.$store.dispatch("pushNotice", {
							title: "Generate & Send Invoice Failed",
							desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
							level: "error"
						});
					}
				}
			});
		}

		private async getDocuments() {
			try {
				const result = await HTTP.get("/inspection/documents", {
					params: { id: this.$route.params.id }
				});

				this.documents = result.data.data;
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Get Documents Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}
		}

		private getInitials(name: string) {
			let split = name.split(" ");
			return split[0].charAt(0).toUpperCase() + (split.length >= 2 ? split[1].charAt(0).toUpperCase() : "");
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
		margin-bottom: 1rem;
		padding: 1rem;
		background-color: $color_primary;
		box-shadow: $shadow-1;
		border-radius: 5px;

		.inspection-status {
			position: relative;
			margin: 0 0.5rem;
			padding: 0.5rem 1rem 0.5rem 0.5rem;
			background: $color_primary-darker;
			border-radius: 5px;
			color: $color_white;
			line-height: 3rem;
			font-weight: $font-weight_semibold;

			&::before {
				content: '';
				display: block;
				float: left;
				width: 3rem;
				height: 3rem;
				margin-right: 1rem;
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
				&::before {
					content: '\f00d';
					background-color: $color_red;
				}
			}

			&[data-status-state="complete"] {
				&::before {
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

			&[data-type="OTHER"] {
				.inspection-document-download {
					&::before {
						@include fa-icon("\f15c");
					}
				}
			}

			&[data-type="INVOICE"] {
				.inspection-document-download {
					&::before {
						@include fa-icon("\f571");
					}
				}
			}

			&[data-type="AGREEMENT"] {
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
			margin-top: 0.5rem;

			&::before {
				content: '';
				display: block;
				border-bottom: 1px solid $color_grey-4;
			}
		}

		.inspection-payment-item {
			margin-bottom: 0.5rem;
			font-weight: $font-weight_semibold;

			&::after {
				content: "";
				clear: both;
				display: table;
			}
			
			&.payment-subsidiary {
				font-weight: $font-weight_regular;

				.inspection-payment-text {
					color: $color-grey-6;
				}
			}

			&.payment-paid {
				.inspection-payment-value {
					&::before {
						content: '-';
						margin-right: 0.5rem;
					}
				}
			}

			&.payment-due {
				font-size: $font-size_xl;
				font-weight: $font-weight_semibold;
			}
			
			.inspection-payment-text {
				float: left;
			}

			.inspection-payment-value {
				float: right;
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
