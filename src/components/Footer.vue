<template>
	<footer class="sticky-footer bg-white">
		<div class="container my-auto">
			<div class="copyright text-center my-auto">
				<span>Copyright &copy; Your Website 2019</span>
			</div>
		</div>
	</footer>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import "bootstrap";

	@Component
	export default class Footer extends Vue {}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";
	
	footer.sticky-footer {
		padding: 2rem 0;
		flex-shrink: 0;
		.copyright {
			line-height: 1;
			font-size: 0.8rem;
		}
	}

	body.sidebar-toggled {
		footer.sticky-footer {
			width: 100%;
		}
	}
</style>
