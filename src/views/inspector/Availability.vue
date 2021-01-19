<template>
	<div id="page-availability">
		<div class="row">
			<div class="col-xs-12">
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							<i class="fas fa-fw fa-stream"></i>
							Available Timeslots
						</div>
					</div>
					<div class="panel-body">
						<div class="available-days">
							<div class="available-day" v-for="(day, weekday) in timeslots" :key="weekday">
								<div class="available-day-header">{{ weekday }}</div>
								<div class="day-timeslot" v-for="time in sortDay(day)" :key="time">
									<i class="fas fa-fw fa-clock"></i> {{ formatTime(time) }}
									<button class="timeslot-delete" @click="deleteAvailTimeslotHelper(weekday, time)"><i class="fas fa-trash-alt"></i></button>
								</div>
								<Poptip placement="bottom" :width="225">
									<Button type="dashed" long style="margin-top: 5px;"><i class="fas fa-plus-square"></i> Add Timeslot</Button>
									<div slot="content">
										<Row :gutter="5">
											<Col span="8">
												<Select v-model="newTimeslot.hour" placeholder="Hour">
													<Option v-for="hour in 12" :key="hour" :value="hour">{{ hour }}</Option>
												</Select>
											</Col>
											<Col span="8">
												<Select v-model="newTimeslot.minute" placeholder="Minute">
													<Option v-for="minute in minutes" :key="minute" :value="minute">{{ ('' + minute).padStart(2, '0') }}</Option>
												</Select>
											</Col>
											<Col span="8">
												<Select v-model="newTimeslot.period" placeholder="Half">
													<Option value="AM">AM</Option>
													<Option value="PM">PM</Option>
												</Select>
											</Col>
										</Row>
										<Button type="success" long size="small" @click="addAvailTimeslot(weekday)" style="margin-top: 10px;">Add</Button>
									</div>
								</Poptip>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							<i class="fas fa-fw fa-business-time"></i>
							Toggle Time Off
						</div>
					</div>
					<div class="panel-body">
						<div class="timeoff-days">
							<div class="timeoff-day" v-for="(day, index) in timeoffDays" :key="index">
								<div class="timeoff-day-date">{{ day.date.format("MMMM Do") }}</div>
								<div class="timeoff-day-weekday">{{ day.date.format("dddd") }}</div>
								<div class="timeoff-day-times">
									<div class="day-timeslot timeoff-timeslot" v-for="(selected, time) in day.timeslots" :key="time" @click="toggleTimeoff(day.date, time, selected)">
										<i class="fas fa-fw fa-clock"></i> {{ formatTime(time) }}
										<div class="timeoff-indicator" :data-blocked="'' + selected"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import moment from "moment";
	import { Component, Vue, Mixins } from "vue-property-decorator";
	import { FormattingMixin } from "@/mixins";
	import HTTP from "@/classes/http";

	@Component({})
	export default class Availability extends Mixins(FormattingMixin) {
		private newTimeslot = {
			hour: "",
			minute: "",
			period: ""
		};

		private minutes = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60 ]

		private timeslots = {
			"monday": [],
			"tuesday": [],
			"wednesday": [],
			"thursday": [],
			"friday": [],
			"saturday": [],
			"sunday": []
		};

		private timeoff: {date: string, time: number}[] = [];

		public mounted() {
			this.getTimeslots();
			this.getTimeoff();
		}

		private get timeoffDays(): {date: moment.Moment, timeslots: number[]}[] {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth();
			const day = today.getDate();
			let days: {date: moment.Moment, timeslots: number[]}[] = [];

			for (let i = 0; i < 30; i++) {
				let newDate = moment().add(i, "days");
				let timeslotsList: number[] = (this.timeslots as any)[newDate.format("dddd").toLowerCase()];
				let timeslotsObject: any = {};
				for (let i = 0; i < timeslotsList.length; i++) {
					timeslotsObject[timeslotsList[i]] = this.timeoff.find(
						timeoff => timeoff.date == newDate.format("YYYYMMDD") && timeoff.time == timeslotsList[i]
					) != undefined;
				}

				days.push({
					"date": newDate,
					"timeslots": timeslotsObject
				});
			}

			return days;
		}

		private sortDay(day: number[]): number[] {
			return day.slice().sort((a, b) => a - b);
		}

		private async getTimeslots() {
			const result = await HTTP.get("/inspector/timeslots");
			this.timeslots["monday"] = result.data.data["monday"];
			this.timeslots["tuesday"] = result.data.data["tuesday"];
			this.timeslots["wednesday"] = result.data.data["wednesday"];
			this.timeslots["thursday"] = result.data.data["thursday"];
			this.timeslots["friday"] = result.data.data["friday"];
			this.timeslots["saturday"] = result.data.data["saturday"];
			this.timeslots["sunday"] = result.data.data["sunday"];
		}

		private async getTimeoff() {
			const result = await HTTP.get("/inspector/timeoff");
			this.timeoff = result.data.data;
		}

		private async addAvailTimeslot(weekday: string) {
			let hour = parseInt(this.newTimeslot.hour);

			if (this.newTimeslot.period == "PM" && hour < 12) {
				hour += 12;
			}

			if (this.newTimeslot.period == "AM" && hour == 12) {
				hour -= 12;
			}

			let timestamp = (hour * 60) + parseInt(this.newTimeslot.minute);

			if ((this.timeslots as any)[weekday].includes(timestamp)) {
				this.$Modal.error({
					title: "Duplicate Timeslot",
					content: "The timeslot you selected already exists!"
				});
			} else {
				const result = await HTTP.post("/inspector/timeslots", {
					day: weekday,
					time: timestamp
				});

				if (result.status == 200) {
					(this.timeslots as any)[weekday].push(timestamp);
				}
			}
		}

		private deleteAvailTimeslotHelper(weekday: string, time: number) {
			this.$Modal.confirm({
				title: "Remove Timeslot",
				content: "Are you sure you want to remove this timeslot?",
				onOk: () => this.deleteAvailTimeslot(weekday, time)
			});
		}

		private async deleteAvailTimeslot(weekday: string, time: number) {
			const result = await HTTP.delete("/inspector/timeslots/" + weekday + "/" + time);
			if (result.status == 200) {
				(this.timeslots as any)[weekday].splice((this.timeslots as any)[weekday].indexOf(time), 1);
			}
		}

		private toggleTimeoff(date: moment.Moment, time: number, current: boolean) {
			if (current == true) {
				this.removeTimeoff(date, time);
			} else if (current == false) {
				this.addTimeoff(date, time);
			}
		}

		private async addTimeoff(date: moment.Moment, time: number) {
			const dateString = date.format("YYYYMMDD");
			const result = await HTTP.post("/inspector/timeoff", {
				date: dateString,
				time
			});

			if (result.status == 200) {
				this.timeoff.push({date: dateString, time: time});
			}
		}

		private async removeTimeoff(date: moment.Moment, time: number) {
			const dateString = date.format("YYYYMMDD");
			const result = await HTTP.delete("/inspector/timeoff/" + dateString + "/" + time);
			if (result.status == 200) {
				this.timeoff.splice(this.timeoff.findIndex(
					timeoff => timeoff.date == dateString && timeoff.time == time
				), 1);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	.available-days {
		display: flex;
		flex-wrap: wrap;
		margin-right: -10px;
		margin-top: -15px;

		.available-day {
			flex: 1 0 0;
			margin-right: 10px;

			.available-day-header {
				text-transform: capitalize;
				font-weight: 600;
				text-align: center;
				border-bottom: 2px solid $color_grey-2;
				padding-bottom: 10px;
				margin: 15px 0px 10px 0px;
			}
		}
	}

	.day-timeslot {
		background-color: $color_white-3;
		border-radius: 10px;
		margin-bottom: 10px;
		padding: 10px;

		.timeslot-delete {
			border: none;
			cursor: pointer;
			float: right;
			color: $font_color_dark;

			&:hover {
				color: $color_red;
			}
		}
	}

	.timeoff-days {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-gap: 10px;

		.timeoff-day {
			border: 2px solid $color_grey-2;
			border-radius: 5px;
			padding: 5px;

			.timeoff-day-date {
				padding-left: 0.5rem;
				font-size: $font-size_lg;
				font-weight: 600;
				line-height: 1.25;
			}

			.timeoff-day-weekday {
				padding-left: 0.5rem;
				font-size: $font-size_sm;
				color: $color_grey-6;
			}

			.timeoff-day-times {
				margin: 10px 5px 5px 5px;
			}

			.timeoff-timeslot {
				cursor: pointer;

				&:hover {
					background-color: $color_grey-2;
				}

				.timeoff-indicator {
					float: right;
					font-weight: 600;

					&[data-blocked="true"]:after {
						content: "UNAVAIL.";
						color: $color_red;
					}

					&[data-blocked="false"]:after {
						content: "AVAIL.";
						color: $color_green;
					}
				}
			}
		}
	}
</style>

<style lang="scss">
	.ivu-poptip-body-content {
		overflow: visible;
	}

	.ivu-poptip, .ivu-poptip-rel {
		width: 100%;
	}
</style>
