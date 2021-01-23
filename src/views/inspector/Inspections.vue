<template>
	<div id="page-inspections">
		<data-table :data="inspectionsData" :pageRows=5 rowClass="inspection-row">
			<template scope="row">
				<div class="inspection-details">
					<div class="inspection-state" :data-state="row.status"></div>
					<router-link class="inspection-link" :to="'/inspector/inspections/' + row.id">
						<img class="inspection-image" :src="row.image"/>
					</router-link>
					<div class="inspection-fields">
						<div class="inspection-address">{{ row.address }}</div>	
						<div class="inspection-field inspection-date">{{ formatDate(row.date) }}</div>
						<div class="inspection-field inspection-time">{{ formatTime(row.time) }}</div>
						<div class="inspection-field inspection-client">{{ row.client }}</div>
						<div class="inspection-field inspection-realtor">{{ row.realtor }}</div>
					</div>
					<div class="inspection-id">{{ row.id }}</div>
				</div>
				<div class="inspection-statuses">
					<div class="inspection-status" :data-status-state="row.agreement.signed ? 'complete' : 'incomplete'">
						<div class="inspection-status-key">Agreement</div>
						<div class="inspection-status-value">
							<div class="inspection-status-value-primary">{{ row.agreement.signed ? "Signed" : "Not Signed" }}</div>
							<div class="inspection-status-value-secondary">{{ agreementSubtext(row.agreement) }}</div>
						</div>
					</div>
					<div class="inspection-status" :data-status-state="row.payment.balance == 0 ? 'complete' : 'incomplete'">
						<div class="inspection-status-key">Payment</div>
						<div class="inspection-status-value">
							<div class="inspection-status-value-primary">{{ row.payment.balance == 0 ? "Paid in Full" : "Payment Due" }}</div>
							<div class="inspection-status-value-secondary">{{ paymentSubtext(row.payment) }}</div>
						</div>
					</div>
					<div class="inspection-status" :data-status-state="row.report.sent ? 'complete' : 'pending'">
						<div class="inspection-status-key">Report</div>
						<div class="inspection-status-value">
							<div class="inspection-status-value-primary">{{ row.report.sent ? "Sent" : "Not Sent" }}</div>
							<div class="inspection-status-value-secondary">{{ reportSubtext(row.report) }}</div>
						</div>
					</div>
				</div>
			</template>
		</data-table>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Mixins } from "vue-property-decorator";
	import { FormattingMixin } from "@/mixins";
	import DataTable from "@/components/DataTable.vue";
	import HTTP from "@/classes/http";
	import moment from "moment";

	@Component({
		components: {
			DataTable
		},
	})
	export default class Inspections extends Mixins(FormattingMixin) {
		private inspectionsData: object[] = [];

		public mounted() {
			this.getInspections();
		}

		private async getInspections() {
			const result = await HTTP.get("/inspector/inspections");
			this.inspectionsData = result.data.data;
		}

		private agreementSubtext(agreement: { signed: boolean, timestamp: number }): string {
			if (agreement.signed) {
				return "Signed on " + moment(agreement.timestamp, "x").format("M/D/Y");
			} else {
				return "";
			}
		}

		private paymentSubtext(payment: { invoice_sent: boolean, balance: number, timestamp: number }): string {
			if (payment.invoice_sent) {
				if (payment.balance == 0) {
					return "Paid on " + moment(payment.timestamp, "x").format("M/D/Y");
				} else {
					return `Payment due of $${payment.balance}`;
				}
			} else {
				return "Invoice not yet sent";
			}
		}

		private reportSubtext(report: { sent: boolean, timestamp: string }) {
			if (report.sent) {
				return "Sent on" + moment(report.timestamp, "x").format("M/D/Y");
			} else {
				return "";
			}
		}

		public formatDate(date: string) {
			return moment(date).format("MMM Do, YYYY");
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	$color_pending-approval: $color_blue;
	$content_pending-approval: "APPROVAL";

	::v-deep .inspection-row {
		padding: 1rem;
		display: flex;
		position: relative;
		justify-content: space-between;

		.inspection-details {
			border-radius: 5px;
			display: flex;
			max-height: 75px;
			position: relative;
			flex: 1;

			.inspection-state {
				&::before {
					margin-right: 0.5rem;
					color: $font_color_light;
					font-weight: $font-weight_bold;
					writing-mode: vertical-rl;
					padding: 0.5rem 0;
					text-align: center;
					transform: rotate(180deg);
					line-height: 2.5rem;
					display: block;
					font-size: $font-size_xs;
					width: 2.5rem;
					border-top-right-radius: 5px;
					border-bottom-right-radius: 5px;
					height: 100%;
				}

				&[data-state="PENDING_APPROVAL"] {
					&::before {
						content: $content_pending-approval;
						background-color: $color_pending-approval;
					}
				}
			}

			.inspection-link {
				position: relative;

				&::before {
					content: "";
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					background-color: rgba(0, 0, 0, 0.5);
					border-top-right-radius: 5px;
					border-bottom-right-radius: 5px;
				}

				&::after {
					@include fa-icon("\f245");
					font-size: 3rem;
					color: $color_grey-1;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				&::before,
				&::after {
					opacity: 0;
					transition: opacity 0.2s;
				}

				&:hover {
					&::before,
					&::after {
						opacity: 1;
					}
				}
			}

			.inspection-image {
				display: block;
				width: 100px;
				height: 100%;
				border-top-right-radius: 5px;
				border-bottom-right-radius: 5px;
				border: 1px solid $color_grey-3;
			}

			.inspection-fields {
				margin-left: 1rem;

				.inspection-address {
					font-weight: $font-weight_semibold;
					font-size: $font-size_xl;
					margin-bottom: 1rem;

					&::before {
						@include fa-icon("\f015");
						color: $color_grey-5;
						border-radius: 5px;
						margin-right: 0.5rem;
					}
				}

				.inspection-field {
					display: inline-block;
					margin-right: 3rem;
					border-bottom: 2px solid $color_grey-3;
					padding-right: 0.5rem;

					&::before {
						padding: 0 0.5rem;
						color: $color_grey-5;
						border-top-left-radius: 5px;
						border-top-right-radius: 5px;
					}
				}

				.inspection-date {
					&::before {
						@include fa-icon("\f073");
					}
				}

				.inspection-time {
					&::before {
						@include fa-icon("\f017");
					}
				}

				.inspection-client {
					&::before {
						@include fa-icon("\f007");
					}
				}

				.inspection-realtor {
					&::before {
						@include fa-icon("\f4d9");
					}
				}
			}

			.inspection-id {
				font-size: $font-size_xs;
				letter-spacing: 3px;
				text-transform: uppercase;
				background-color: $color_grey-1;
				border: 1px solid $color_grey-3;
				border-radius: 2px;
				padding: 0.5rem;
				position: absolute;
				top: 0;
				right: 0;

				&::before {
					content: '#';
				}
			}
		}

		.inspection-statuses {
			display: flex;
			padding-left: 1rem;
			margin: 0 -0.5rem;
			justify-content: end;

			.inspection-status {
				margin: 0 0.5rem;
				display: flex;
				flex-direction: column;
				min-width: 180px;
				position: relative;
				border: 1px solid $color_grey-3;
				border-radius: 5px;
				padding-top: 2rem;

				&::before {
					content: '';
					position: absolute;
					top: -2px;
					right: -2px;
					width: 2.25rem;
					height: 2.25rem;
					font-family: "Font Awesome 5 Free";
					font-weight: 900;
					font-size: 1rem;
					color: $color_white;
					border-top-right-radius: 5px;
					border-bottom-left-radius: 5px;
					text-align: center;
					line-height: 2.25rem;
					vertical-align: middle;
				}

				&[data-status-state="incomplete"] {
					border-color: $color_red;

					&::before {
						content: '\f00d';
						background-color: $color_red;
					}
				}

				&[data-status-state="pending"] {
					border-color: $color_yellow;

					&::before {
						content: '\f1ce';
						background-color: $color_yellow;
					}
				}

				&[data-status-state="complete"] {
					border-color: $color_green;

					&::before {
						content: '\f00c';
						background-color: $color_green;
					}
				}

				&[data-status-state="pending"],
				&[data-status-state="incomplete"] {
					.inspection-status-value .inspection-status-value-primary {
						font-weight: $font-weight_bold;
					}
				}

				.inspection-status-key {
					font-size: $font-size_sm;
					text-transform: uppercase;
					color: $color_grey-6;
					position: absolute;
					top: 0.2rem;
					left: 0.5rem;
				}

				.inspection-status-value {
					flex-grow: 1;
					text-align: center;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.inspection-status-value-primary {
						font-weight: $font-weight_semibold;
						font-size: $font-size_lg;
						text-transform: uppercase;
						letter-spacing: 2px;
					}

					.inspection-status-value-secondary {
						font-size: $font-size_sm;
						font-style: italic;
					}
				}
			}
		}
	}
</style>
