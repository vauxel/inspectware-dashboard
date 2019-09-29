<template>
	<div class="container-fluid">
		<Card>
			<p slot="title">
				<i class="fas fa-fw fa-stream"></i>
				Available Timeslots
			</p>
			<div class="available-days">
				<div class="available-day" v-for="(day, weekday) in timeslots" :key="weekday">
					<div class="available-day-header">{{ weekday }}</div>
					<ul class="day-timeslot" v-for="time in sortDay(day)" :key="time">
						<i class="fas fa-fw fa-clock"></i> {{ formatTime(time) }}
						<button class="timeslot-delete" @click="deleteAvailTimeslotHelper(weekday, time)"><i class="far fa-trash-alt"></i></button>
					</ul>
					<Poptip placement="bottom" :width="225">
						<Button type="dashed" long style="margin-top: 5px;"><i class="far fa-plus-square"></i> Add Timeslot</Button>
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
		</Card>
		<br>
		<Card>
			<p slot="title">
				<i class="fas fa-fw fa-business-time"></i>
				Time Off
			</p>
		</Card>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import HTTP from "../classes/http";

	@Component({})
	export default class Availability extends Vue {
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

		public mounted() {
			this.getTimeslots();
		}

		private sortDay(day: number[]): number[] {
			return day.slice().sort((a, b) => a - b);
		}

		private async getTimeslots() {
			const result = await HTTP.get("/prefs/timeslots");
			this.timeslots["monday"] = result.data.data["monday"];
			this.timeslots["tuesday"] = result.data.data["tuesday"];
			this.timeslots["wednesday"] = result.data.data["wednesday"];
			this.timeslots["thursday"] = result.data.data["thursday"];
			this.timeslots["friday"] = result.data.data["friday"];
			this.timeslots["saturday"] = result.data.data["saturday"];
			this.timeslots["sunday"] = result.data.data["sunday"];
		}

		private formatTime(time: number): string {
			let hour = Math.floor(time / 100);
			let minute = time % 100;
			let period;

			if (hour > 12) {
				hour -= 12;
				period = "PM";
			} else {
				period = "AM";
			}

			return `${("" + hour).padStart(2, '0')}:${("" + minute).padStart(2, '0')} ${period}`;
		}

		private async addAvailTimeslot(weekday: string) {
			let hour = ("" + (this.newTimeslot.period == "AM" ? this.newTimeslot.hour : this.newTimeslot.hour + 12)).padStart(2, '0');
			let minute = ("" + this.newTimeslot.minute).padStart(2, '0');
			let hourNum = parseInt(hour + minute);

			if ((this.timeslots as any)[weekday].includes(hourNum)) {
				this.$Modal.error({
					title: "Duplicate Timeslot",
					content: "The timeslot you selected already exists!"
				});
			} else {
				const result = await HTTP.post("prefs/timeslots", {
					day: weekday,
					time: hourNum
				});

				if (result.status == 200) {
					(this.timeslots as any)[weekday].push(hourNum);
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
			const result = await HTTP.delete("prefs/timeslots/" + weekday + "/" + time);
			if (result.status == 200) {
				(this.timeslots as any)[weekday].splice((this.timeslots as any)[weekday].indexOf(time), 1);
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
				border-bottom: 2px solid $grey-2;
				padding-bottom: 10px;
				margin: 15px 0px 10px 0px;
			}
		}
	}

	.day-timeslot {
		background-color: $white-3;
		border-radius: 10px;
		margin-bottom: 10px;
		padding: 10px;

		.timeslot-delete {
			float: right;

			&:hover {
				color: $red;
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
