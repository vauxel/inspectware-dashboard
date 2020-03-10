<template>
    <div class="perspective-view" id="inspector-dashboard">
        <sidebar/>
        <div id="content-wrapper">
            <div id="content">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Sidebar from "../../components/inspector/Sidebar.vue";

	@Component({
		components: {
			Sidebar
		},
	})
	export default class Dashboard extends Vue {
		public mounted() {
            if (!this.$store.getters.isLoggedIn || !this.$store.getters.isInspector) {
                this.$router.push("/");
            }
		}
	}
</script>

<style scoped lang="less">
	@import "../../less/include.less";
</style>
