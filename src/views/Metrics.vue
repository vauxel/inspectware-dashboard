<template>
	<div class="container-fluid">
		<!-- Page Heading -->
		<div class="d-sm-flex align-items-center justify-content-between mb-4">
			<h1 class="h3 mb-0 text-gray-800">Metrics</h1>
		</div>

		<!-- Content Row -->
		<div class="row">
			<!-- Inspection Count -->
			<div class="col-xl-6">
				<div class="card shadow mb-4">
					<!-- Card Header - Dropdown -->
					<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
						<h6 class="m-0 font-weight-bold">Inspection Count</h6>
						<div class="dropdown no-arrow">
							<a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
							</a>
							<div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
								<div class="dropdown-header">Dropdown Header:</div>
								<a class="dropdown-item" href="#">Action</a>
								<a class="dropdown-item" href="#">Another action</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="#">Something else here</a>
							</div>
						</div>
					</div>
					<!-- Card Body -->
					<div class="card-body">
						<div class="chart-area">
							<canvas id="inspectionCountChart"></canvas>
						</div>
					</div>
				</div>
			</div>

			<!-- Inspection Revenue -->
			<div class="col-xl-6">
				<div class="card shadow mb-4">
					<!-- Card Header - Dropdown -->
					<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
						<h6 class="m-0 font-weight-bold">Inspection Revenue</h6>
						<div class="dropdown no-arrow">
							<a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
							</a>
							<div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
								<div class="dropdown-header">Dropdown Header:</div>
								<a class="dropdown-item" href="#">Action</a>
								<a class="dropdown-item" href="#">Another action</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="#">Something else here</a>
							</div>
						</div>
					</div>
					<!-- Card Body -->
					<div class="card-body">
						<div class="chart-area">
							<canvas id="inspectionRevenueChart"></canvas>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { Chart, ChartData, Point } from "chart.js";

	@Component
	export default class Metrics extends Vue {
		public mounted(): void {
			this.initInspectionCountChart();
		}

		public number_format(num: any, decimals: number, decPoint = ".", thousandsSep = ",") {
			num = Number((num + "").replace(",", "").replace(" ", ""));
			const n = !isFinite(+num) ? 0 : +num;
			const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
			const toFixedFix = (n2: any, prec2: any) => {
				const k = Math.pow(10, prec2);
				return "" + Math.round(n2 * k) / k;
			};

			const s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
			if (s[0].length > 3) {
				s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSep);
			}

			if ((s[1] || "").length < prec) {
				s[1] = s[1] || "";
				s[1] += new Array(prec - s[1].length + 1).join("0");
			}

			return s.join(decPoint);
		}

		private initInspectionCountChart() {
			Chart.defaults.global.defaultFontFamily = "'Nunito',-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
			Chart.defaults.global.defaultFontColor = "#858796";

			const chartElement = document.getElementById("inspectionCountChart") as HTMLCanvasElement;
			const number_format = this.number_format;
			const chartObject = new Chart(chartElement, {
				type: "line",
				data: {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					datasets: [{
						label: "Inspections",
						lineTension: 0.3,
						backgroundColor: "rgba(78, 115, 223, 0.05)",
						borderColor: "#3b945e",
						pointRadius: 3,
						pointBackgroundColor: "#3b945e",
						pointBorderColor: "#3b945e",
						pointHoverRadius: 3,
						pointHoverBackgroundColor: "#3b945e",
						pointHoverBorderColor: "#3b945e",
						pointHitRadius: 10,
						pointBorderWidth: 2,
						data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
					}],
				},
				options: {
					maintainAspectRatio: false,
					layout: {
						padding: {
							left: 10,
							right: 25,
							top: 25,
							bottom: 0
						}
					},
					scales: {
						xAxes: [{
							time: {
								unit: "day"
							},
							gridLines: {
								display: false,
								drawBorder: false
							},
							ticks: {
								maxTicksLimit: 7
							}
						}],
						yAxes: [{
							ticks: {
								maxTicksLimit: 5,
								padding: 10,
								callback: (value, index, values) => {
									return "$" + number_format(value, 2);
								}
							},
							gridLines: {
								color: "rgb(234, 236, 244)",
								zeroLineColor: "rgb(234, 236, 244)",
								drawBorder: false,
								borderDash: [2],
								zeroLineBorderDash: [2]
							}
						}],
					},
					legend: {
						display: false
					},
					tooltips: {
						backgroundColor: "rgb(255,255,255)",
						bodyFontColor: "#858796",
						titleMarginBottom: 10,
						titleFontColor: "#6e707e",
						titleFontSize: 14,
						borderColor: "#dddfeb",
						borderWidth: 1,
						xPadding: 15,
						yPadding: 15,
						displayColors: false,
						intersect: false,
						mode: "index",
						caretPadding: 10,
						callbacks: {
							label: (tooltipItem, chart) => {
								let datasetLabel;

								if (!chart.datasets || !tooltipItem.datasetIndex) {
									datasetLabel = "";
								} else {
									datasetLabel = chart.datasets[tooltipItem.datasetIndex].label;
								}

								return datasetLabel + ": $" + number_format(tooltipItem.yLabel, 2);
							}
						}
					}
				}
			});
		}
	}
</script>
