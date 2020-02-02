<template>
	<div class="container-fluid">
		<div class="panel">
			<div class="panel-head">
				<div class="panel-title">
					<i class="fas fa-fw fa-chart-bar"></i>
					Quick Stats
				</div>
			</div>
			<div class="panel-body">
				<div class="stats-row">
					<div class="stats-item">
						<i class="stats-icon fas fa-fw fa-calendar fa-2x"></i>
						<div class="stats-details">
							<div class="stats-name">Inspections (Past Month)</div>
							<div class="stats-value">123</div>
						</div>
					</div>
					<div class="stats-item">
						<i class="stats-icon fas fa-fw fa-coins fa-2x"></i>
						<div class="stats-details">
							<div class="stats-name">Revenue (Past Month)</div>
							<div class="stats-value">$1,234</div>
						</div>
					</div>
					<div class="stats-item">
						<i class="stats-icon fas fa-fw fa-clipboard-list fa-2x"></i>
						<div class="stats-details">
							<div class="stats-name">Upcoming Inspections</div>
							<div class="stats-value">20</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="panel">
			<div class="panel-head">
				<div class="panel-title">
					<i class="fas fa-fw fa-clipboard-list"></i>
					Activity Log
				</div>
			</div>
			<div class="panel-body">
				<ul class="shadow border border-gray-300 border-b-4 bg-white">
				<li class="flex items-center p-4 border-b border-gray-300">
					<div class="bg-gray-200 p-2 rounded-lg"><i class="fas fa-fw fa-plus fa-lg"></i></div>
					<div class="flex-grow mx-3 text-lg italic">New inspection booked for 2609 Dockery Ln, Raleigh, NC 27606</div>
					<div class="bg-gray-200 py-1 px-3 rounded-full text-sm font-semibold">April 1 2019 @ 2:00 PM</div>
				</li>
				<li class="flex items-center p-4">
					<div class="bg-gray-200 p-2 rounded-lg"><i class="fas fa-fw fa-plus fa-lg"></i></div>
					<div class="flex-grow mx-3 text-lg italic">New inspection booked for 2609 Dockery Ln, Raleigh, NC 27606</div>
					<div class="bg-gray-200 py-1 px-3 rounded-full text-sm font-semibold">April 1 2019 @ 2:00 PM</div>
				</li>
			</ul>
			</div>
		</div>

		<div class="panel">
			<div class="panel-head">
				<div class="panel-title">
					<i class="far fa-fw fa-calendar"></i>
					Inspections Calendar
				</div>
			</div>
			<div class="panel-body">
				<Calendar :events="calendarEvents"></Calendar>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Calendar from "../../components/inspector/Calendar.vue";
	import HTTP from "../../classes/http";
	import moment from "moment";

	@Component({
		components: {
			Calendar
		},
	})
	export default class Home extends Vue {
		private activityCols = [
			{
				title: ' ',
				key: 'name'
			},
			{
				title: 'Description',
				key: 'description'
			},
			{
				title: 'Date / Time',
				key: 'date'
			}
		];
		
		private activityData = [
			{
				name: 'John Brown',
				description: '5000 sq/ft Home Inspection',
				date: 'April 1st, 2019 @ 5:00 PM'
			},
			{
				name: 'Jim Green',
				description: 'London No. 1 Lake Park',
				date: 'April 1st, 2019 @ 5:00 PM'
			},
		];

		private calendarEvents = {};

		public mounted() {
			this.getCalendarInspections();
		}

		private async getCalendarInspections() {
			const result = await HTTP.get("/inspector/inspections", {
				params: {
					from: moment().format("YYYYMMDD"),
					until: moment().add("months", 1).date(0).format("YYYYMMDD")
				}
			});

			let inspections: any = {};

			for (const inspection of result.data.data) {
				let date = inspection.date;
				delete inspection.date;
				
				if (!inspections[date]) {
					inspections[date] = [];
				}

				inspections[date].push(inspection);
			}

			this.calendarEvents = inspections;
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	.stats-row {
		display: flex;
		justify-content: space-around;

		.stats-item {
			display: flex;

			.stats-icon {
				display: block;
				align-self: center;
			}

			.stats-details {
				margin-left: 1rem;
				padding: 0.5rem 0 0.5rem 1rem;
				border-left: 2px solid $font_color_dark;
				flex-grow: 1;

				.stats-name {
					font-size: $font-size_sm;
					color: $color-grey-6;
					text-transform: uppercase;
					font-weight: $font-weight_semibold;
				}

				.stats-value {
					font-weight: $font-weight_bold;
					font-size: $font-size_xl;
				}
			}
		}
	}

	@include respond-below(md) {
		.stats-row {
			flex-direction: column;
			align-items: left;
			margin: -0.5rem 0;

			.stats-item {
				margin: 0.5rem 0;

				.stats-details {
					text-align: right;
				}
			}
		}
	}
</style>
