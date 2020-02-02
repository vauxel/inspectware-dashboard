<template>
    <div class="perspective-view" id="inspector-dashboard">
        <sidebar/>
        <div id="content-wrapper">
            <topbar/>
            <div id="content">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Sidebar from "../../components/inspector/Sidebar.vue";
	import Topbar from "../../components/inspector/Topbar.vue";

	@Component({
		components: {
			Sidebar,
			Topbar
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

<style scoped lang="scss">
	@import "@/scss/include.scss";
</style>
