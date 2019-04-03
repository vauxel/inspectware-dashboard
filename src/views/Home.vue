<template>
	<div class="container-fluid">
		<!-- Page Heading -->
		<div class="d-sm-flex align-items-center justify-content-between mb-4">
			<h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
			<a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
		</div>

		<!-- Content Row -->
		<div class="row">
			<!-- Inspections (Past Month) Card -->
			<div class="col-xl-4 col-md-12 mb-4">
				<div class="card border-left-info shadow h-100 py-2">
					<div class="card-body">
						<div class="row no-gutters align-items-center">
							<div class="col mr-2">
								<div class="text-xs font-weight-bold text-info text-uppercase mb-1">Inspections (Past Month)</div>
								<div class="h5 mb-0 font-weight-bold text-gray-800">123</div>
							</div>
							<div class="col-auto">
								<i class="fas fa-calendar fa-2x text-gray-300"></i>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Revenue (Past Month) Card -->
			<div class="col-xl-4 col-md-12 mb-4">
				<div class="card border-left-info shadow h-100 py-2">
					<div class="card-body">
						<div class="row no-gutters align-items-center">
							<div class="col mr-2">
								<div class="text-xs font-weight-bold text-info text-uppercase mb-1">Revenue (Past Month)</div>
								<div class="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
							</div>
							<div class="col-auto">
								<i class="fas fa-coins fa-2x text-gray-300"></i>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Upcoming Inspections Card -->
			<div class="col-xl-4 col-md-12 mb-4">
				<div class="card border-left-info shadow h-100 py-2">
					<div class="card-body">
						<div class="row no-gutters align-items-center">
							<div class="col mr-2">
								<div class="text-xs font-weight-bold text-info text-uppercase mb-1">Upcoming Inspections</div>
								<div class="h5 mb-0 font-weight-bold text-gray-800">18</div>
							</div>
							<div class="col-auto">
								<i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Content Row -->
		<div class="row">
			<!-- Activity Log -->
			<div class="col-xl-12">
				<div class="card shadow mb-4">
					<!-- Card Header -->
					<div class="card-header py-3">
						<h6 class="m-0 font-weight-bold">Activity Log</h6>
					</div>
					<!-- Card Body -->
					<div class="table-responsive">
						<table class="table text-nowrap m-0">
							<tbody>
								<tr>
									<td class="w-100">
										<div class="d-flex align-items-center">
											<router-link class="icon-circle bg-success mr-3" to="/inspections/id">
												<i class="fas fa-home text-white"></i>
											</router-link>
											<div>
												<router-link class="font-weight-bold text-dark" to="/inspections/id">5000 sq/ft Home Inspection</router-link>
												<div class="text-muted text-xs text-uppercase font-weight-bold"><i class="fas fa-fw fa-plus-square"></i> New Inspection</div>
											</div>
										</div>
									</td>
									<td class="align-middle"><span class="badge badge-info">April 1st, 2019 @ 5:00 PM</span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Content Row -->
		<div class="row">
			<!-- Inspections Calendar -->
			<div class="col-xl-8 col-lg-7">
				<div class="card shadow mb-4">
					<!-- Card Header -->
					<div class="card-header py-3">
						<h6 class="m-0 font-weight-bold">Inspections Calendar</h6>
					</div>
					<!-- Card Body -->
					<div class="card-body">
						<div id="inspectionsCalendar"></div>
					</div>
				</div>
			</div>

			<!-- Today's Inspections -->
			<div class="col-xl-4 col-lg-5">
				<div class="card shadow mb-4">
					<!-- Card Header -->
					<div class="card-header py-3">
						<h6 class="m-0 font-weight-bold">Today's Inspections</h6>
					</div>
					<!-- Card Body -->
					<div class="card-body">
						
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { Calendar } from "@fullcalendar/core";
	import dayGridPlugin from "@fullcalendar/daygrid";

	@Component
	export default class Home extends Vue {
		public mounted(): void {
			this.initInspectionsCalendar();
		}

		private initInspectionsCalendar() {
			const calendarElement = document.getElementById("inspectionsCalendar") as HTMLElement;
			const calendar = new Calendar(calendarElement, {
				plugins: [ dayGridPlugin ],
				defaultView: "dayGridMonth",
				header: {
					left: "title",
					center: "",
					right: "prev,next today"
				},
				editable: false
			});

			calendar.render();
		}
	}
</script>

<style scoped lang="scss">
	@import "~@fullcalendar/core/main.min.css";
	@import "~@fullcalendar/daygrid/main.min.css";
</style>
