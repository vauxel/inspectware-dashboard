<template>
	<div class="datatable">
		<div class="datatable-head">
			<Input v-model="queryString" placeholder="Filter by a search string..." class="datatable-querystring"/>
		</div>
		<div class="datatable-body">
			<div v-for="row in paginateData(filteredData)" v-bind:key="row.id" :class="rowClass">
				<slot v-bind="row"/>
			</div>
		</div>
		<div class="datatable-footer">
			<ButtonGroup size="small" class="datatable-paginators">
				<Button :disabled="pageNum === 1" @click="prevPage"><i class="fas fa-chevron-left"></i></Button>
				<Button>{{ pageNum }}</Button>
				<Button :disabled="pageNum === maxPageNum" @click="nextPage"><i class="fas fa-chevron-right"></i></Button>
			</ButtonGroup>
			<span class="datatable-resultcount">{{ resultCount }} of {{ totalCount }} results</span>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class DataTable extends Vue {
		@Prop(Array) readonly data: any;
		@Prop(Number) readonly pageRows: number = 5;
		@Prop(String) readonly rowClass: string = "";

		private queryString = "";
		private pageNum = 1;

		private get maxPageNum(): number {
			return this.resultCount === 0 ? 1 : Math.ceil(this.resultCount / this.pageRows);
		}

		private get totalCount(): number {
			return this.data.length;
		}

		private get resultCount(): number {
			return this.filteredData.length;
		}

		private get filteredData(): object[] {
			let filteredData = [];

			for (const row of this.data) {
				for (const key in row) {
					if (!row.hasOwnProperty(key)) {
						continue;
					}

					let element = row[key];

					if (typeof element === "string" || typeof element == "number") {
						if (String(element).includes(this.queryString)) {
							filteredData.push(row);
							break;
						}
					}
				}
			}

			return filteredData;
		}

		private paginateData(data: object[]): object[] {
			return data.slice((this.pageNum - 1) * this.pageRows, this.pageNum * this.pageRows);
		}

		private nextPage() {
			if (this.pageNum !== this.maxPageNum) {
				this.pageNum++;
			}
		}

		private prevPage() {
			if (this.pageNum !== 1) {
				this.pageNum--;
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	.datatable {
		margin-bottom: 2rem;
		background-color: $color_white;
		border: 1px solid $color_grey-4;
		border-radius: 5px;
		overflow: hidden;
	
		.datatable-head {
			border-bottom: 1px solid $color_grey-4;
			background-color: $color_white-1;
			padding: 1rem;

			.datatable-querystring {
				max-width: 300px;
			}
		}

		.datatable-body {

		}

		.datatable-footer {
			padding: 0.5rem;
			background-color: $color_white-4;
			border-top: 1px solid $color_grey-4;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.datatable-resultcount {
				text-transform: uppercase;
				font-size: $font-size_sm;
				color: $color_grey-5;
				float: right;
			}

			.datatable-paginators {
				vertical-align: middle;

				> button:nth-child(2) {
					pointer-events: none;
				}
			}
		}
	}
</style>
