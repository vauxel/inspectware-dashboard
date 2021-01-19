<template>
	<div class="calendar">
		<div class="calendar-header">
			<div class="calendar-month">{{ monthName }} {{ year }}</div>
			<div class="calendar-buttons">
				<ButtonGroup>
					<Button @click="setMonthPrev"><i class="fas fa-angle-double-left"></i></Button>
					<Button @click="setMonthCurrent">Current</Button>
					<Button @click="setMonthNext"><i class="fas fa-angle-double-right"></i></Button>
				</ButtonGroup>
			</div>
		</div>
		<div class="calendar-body">
			<table class="calendar-table">
				<thead>
					<th>Sunday</th>
					<th>Monday</th>
					<th>Tuesday</th>
					<th>Wednesday</th>
					<th>Thursday</th>
					<th>Friday</th>
					<th>Saturday</th>
				</thead>
				<tbody>
					<tr v-for="x in 6" :key="x">
						<td v-for="y in 7" :key="y">
							<div class="date" :class="{ 'date-inactive': !isThisMonth(x, y), 'date-today': isToday(x, y) }">
								<div class="date-header">
									{{ getDay(x, y) }} <span class="date-weekday">{{ getWeekday(y) }}</span>
									<span class="date-eventcount"><i class="fas fa-clipboard-list"></i> {{ eventsForDay(x, y).length }}</span>
								</div>
								<ul class="date-events">
									<li class="date-event" v-for="event in eventsForDay(x, y)" :key="event.id">
										<div class="text-xs font-bold"><i class="fas fa-fw fa-clock"></i> {{ formatTime(event.time) }}</div>
										<div><i class="fas fa-fw fa-home fa-sm"></i> {{ event.address }}</div>
										<div class="text-sm"><i class="fas fa-fw fa-user"></i> {{ event.client }}</div>
										<div class="text-sm"><i class="fas fa-fw fa-sign"></i> {{ event.realtor }}</div>
									</li>
								</ul>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
	import { FormattingMixin } from "@/mixins";

	@Component
	export default class Calendar extends Mixins(FormattingMixin) {
		@Prop(Object) readonly events: any;

		private year = 1970;
		private month = 0;

		private monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];

		private get monthDays() {
			return [
				31,
				(this.year % 4 === 0) ? 29 : 28,
				31,
				30,
				31,
				30,
				31,
				31,
				30,
				31,
				30,
				31
			];
		}

		created() {
			let date = new Date();
			this.year = date.getFullYear();
			this.month = date.getMonth();
		}

		private get monthName() {
			return this.monthNames[this.month];
		}

		private get days() {
			let date = new Date();
			date.setMonth(this.month);
			date.setFullYear(this.year);
			let startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

			let days = [];

			for (let i = 0; i < 42; i++) {
				let day, thisMonth;
				let today = false;

				if (i < startDay) {
					day = this.monthDays[this.month === 0 ? 11 : this.month - 1] - startDay + 1 + i;
					thisMonth = false;
				} else if(i >= (this.monthDays[this.month] + startDay)) {
					day = i - (this.monthDays[this.month] + startDay) + 1;
					thisMonth = false;
				} else {
					day = i - startDay + 1;

					let currentDate = new Date();
					if (this.year === currentDate.getFullYear() && this.month === currentDate.getMonth() && day === currentDate.getDate()) {
						today = true;
					}

					thisMonth = true;
				}

				days[i] = {
					day: (day + '').padStart(2, '0'),
					thisMonth,
					today
				};
			}

			return days;
		};

		private getDay(row: number, col: number) {
			return this.days[((row - 1) * 7) + (col - 1)].day;
		}

		private getWeekday(col: number) {
			switch(col) {
				case 1: return "Sunday";
				case 2: return "Monday";
				case 3: return "Tuesday";
				case 4: return "Wednesday";
				case 5: return "Thursday";
				case 6: return "Friday";
				case 7: return "Saturday";
				default: return "UNKNOWN";
			}
		}

		private isToday(row: number, col: number) {
			return this.days[((row - 1) * 7) + (col - 1)].today;
		}

		private isThisMonth(row: number, col: number) {
			return this.days[((row - 1) * 7) + (col - 1)].thisMonth;
		}

		private eventsForDay(row: number, col: number) {
			let dayRaw = ((row - 1) * 7) + (col - 1);
			let day = this.days[dayRaw];
			let date;

			if (day.thisMonth) {
				date = `${this.year}${((this.month + 1) + '').padStart(2, '0')}${(day.day + '').padStart(2, '0')}`;
			} else {
				let otherMonth = this.month;

				if (dayRaw < 7) {
					otherMonth--;
				} else {
					otherMonth++;
				}

				let otherDate = new Date(this.year, otherMonth, parseInt(day.day));
				date = `${otherDate.getFullYear()}${((otherDate.getMonth() + 1) + '').padStart(2, '0')}${(otherDate.getDate() + '').padStart(2, '0')}`;
			}
			
			if (this.events.hasOwnProperty(date)) {
				return this.events[date];
			} else {
				return [];
			}
		}

		private setMonthCurrent() {
			let newDate = new Date();
			this.month = newDate.getMonth();
			this.year = newDate.getFullYear();
		}

		private setMonthPrev() {
			let newDate = new Date(this.year, this.month - 1, 1);
			this.month = newDate.getMonth();
			this.year = newDate.getFullYear();
		}

		private setMonthNext() {
			let newDate = new Date(this.year, this.month + 1, 1);
			this.month = newDate.getMonth();
			this.year = newDate.getFullYear();
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	.calendar {
		.calendar-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0px 5px;
			margin-bottom: 10px;

			.calendar-month {
				font-weight: 700;
				font-size: 1.5rem;
				background-color: $color_grey-1;
				border: 2px solid $color_grey-2;
				border-radius: 5px;
				padding: 2.5px 10px;
			}
		}

		.calendar-body {
			.calendar-table {
				width: 100%;
				table-layout: fixed;

				th {
					padding: 5px 0px 5px 10px;
					text-align: left;
					font-weight: 600;
				}

				td {
					vertical-align: top;
					height: 200px;

					.date {
						display: flex;
						flex-direction: column;
						border-top: 3px solid $color_grey-3;
						padding: 5px;
						margin-left: 5px;
						margin-right: 5px;
						height: 100%;
						transition: all 100ms ease-in-out;
						overflow-y: hidden;

						&:hover {
							background-color: rgba(#BEE3F8, 0.25);

							.date-header {
								.date-weekday, .date-eventcount {
									opacity: 1;
								}
							}

							.date-events {
								color: inherit !important;
							}
						}

						&.date-today {
							font-weight: bold;
							background-color: rgba(#BEE3F8, 0.25);
						}

						&.date-inactive {
							.date-header, .date-events {
								color: $color_grey-5;
							}
						}

						&:not(.date-inactive) .date-header {
							color: $color_grey-6;
						}

						.date-header {
							margin-bottom: 2.5px;
							white-space: nowrap;
							word-wrap: none;
							line-break: strict;
							overflow-wrap: unset;

							.date-weekday {
								opacity: 0;
								text-transform: uppercase;
								font-size: 0.75em;
							}

							.date-eventcount {
								opacity: 0;
								float: right;
								font-weight: 600;
							}
						}

						.date-events {
							flex-grow: 1;
							overflow-y: auto;
							transition: color 100ms ease-in-out;

							.date-event {
								border-left: 4px solid rgba($color_primary, 0.50);
								background-color: $color_grey-2;
								padding: 2.5px 5px;
								border-radius: 6px;
								transition: border-left 100ms ease-in-out;
								cursor: pointer;

								&:hover {
									border-left: 6px solid rgba($color_primary, 0.70);
								}

								&:not(:last-of-type) {
									margin-bottom: 5px;
								}

								div {
									white-space: nowrap;
									overflow-x: hidden;
									text-overflow: ellipsis;
								}
							}
						}
					}
				}
			}
		}

		@media (max-width: $breakpoint-md) {
			.calendar-header {
				flex-direction: column;
				justify-content: center;

				.calendar-month {
					margin-bottom: 10px;
					font-size: 1.25em;
				}
			}

			.calendar-body {
				display: block;
				max-height: 500px;
				overflow-y: scroll;

				.calendar-table {
					thead {
						display: none;
					}

					tr {
						display: flex;
						flex-direction: column;
					}

					td {
						height: auto;
						min-height: 50px;
					}

					.date-weekday {
						opacity: 1 !important;
					}

					.date-eventcount {
						opacity: 1 !important;
					}
				}
			}
		}
	}
</style>
