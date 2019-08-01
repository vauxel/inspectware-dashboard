<template>
	<div class="container-fluid">
		<Row :gutter="20" class="mb-3">
			<Col :md="24" :lg="8">
				<div class="flex items-center p-4 shadow-sm rounded border border-gray-400 mb-3 bg-white">
					<div class="pl-3 pr-6">
						<i class="fas fa-calendar fa-2x"></i>
					</div>
					<div class="border-l border-gray-400 pl-6">
						<div class="text-xs font-semibold uppercase text-gray-600">Inspections (Past Month)</div>
						<div class="text-3xl font-bold">123</div>
					</div>
				</div>
			</Col>
			<Col :md="24" :lg="8">
				<div class="flex items-center p-4 shadow-sm rounded border border-gray-400 mb-3 bg-white">
					<div class="pl-3 pr-6">
						<i class="fas fa-coins fa-2x"></i>
					</div>
					<div class="border-l border-gray-400 pl-6">
						<div class="text-xs font-semibold uppercase text-gray-600">Revenue (Past Month)</div>
						<div class="text-3xl font-bold">$1,234</div>
					</div>
				</div>
			</Col>
			<Col :md="24" :lg="8">
				<div class="flex items-center p-4 shadow-sm rounded border border-gray-400 bg-white">
					<div class="pl-3 pr-6">
						<i class="fas fa-clipboard-list fa-2x"></i>
					</div>
					<div class="border-l border-gray-400 pl-6">
						<div class="text-xs font-semibold uppercase text-gray-600">Upcoming Inspections</div>
						<div class="text-3xl font-bold">20</div>
					</div>
				</div>
			</Col>
		</Row>

		<Row class="mb-6">
			<div class="font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">Activity Log</div>
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
		</Row>

		<Row>
			<div class="font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">Inspections Calendar</div>
			<Calendar :events="calendarEvents"></Calendar>
		</Row>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Calendar from "../components/Calendar.vue";

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

		private calendarEvents = {
			20190730: [
				{
					id: "7as9d2",
					address: "2609 Dockery Ln, Raleigh, NC 27606",
					time: 1030,
					client: "John Doe",
					agent: "Austin Villee"
				},
				{
					id: "7as9d2",
					address: "2609 Dockery Ln, Raleigh, NC 27606",
					time: 1230,
					client: "Jack Smith",
					agent: "Adam Lastname"
				}
			],
			20190821: [
				{
					id: "7as9d2",
					address: "2609 Dockery Ln, Raleigh, NC 27606",
					time: 1030,
					client: "John Doe",
					agent: "Austin Villee"
				}
			],
			20190808: [
				{
					id: "7as9d2",
					address: "2609 Dockery Ln, Raleigh, NC 27606",
					time: 1030,
					client: "John Doe",
					agent: "Adam Smith"
				},
				{
					id: "7as9d2",
					address: "2609 Dockery Ln, Raleigh, NC 27606",
					time: 1030,
					client: "John Doe",
					agent: "Adam Smith"
				},
				{
					id: "7as9d2",
					address: "2609 Dockery Ln, Raleigh, NC 27606",
					time: 1030,
					client: "John Doe",
					agent: "Adam Smith"
				}
			]
		};
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";
</style>
