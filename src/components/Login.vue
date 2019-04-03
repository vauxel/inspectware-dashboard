<template>
	<div class="login-container">
		<div class="login-box">
			<div class="card shadow-sm">
				<div class="card-body p-4">
					<div v-show="loginError" class="alert alert-warning" role="alert">
						<i class="fas fa-info-circle fa-sm"></i> {{ loginError }}
					</div>
					<div v-show="!affiliation">
						<div class="text-center mb-5 mt-4">
							<h1 class="h4 text-gray-900">I Am A ...</h1>
							<span class="text-muted font-weight-light">Choose your affiliation from the options below</span>
						</div>
						<a href="#" class="btn btn-primary btn-block btn-affiliation" v-on:click="setHIAffiliation">
							<i class="fas fa-hard-hat border border-white rounded-circle p-2 mr-2"></i> Home Inspector
						</a>
						<a href="#" class="btn btn-primary btn-block btn-affiliation" v-on:click="setClientAffiliation">
							<i class="fas fa-user border border-white rounded-circle p-2 mr-2"></i> Client
						</a>
						<a href="#" class="btn btn-primary btn-block btn-affiliation" v-on:click="setREAAffiliation">
							<i class="fas fa-sign border border-white rounded-circle p-2 mr-2"></i> Real Estate Agent
						</a>
					</div>
					<div v-show="affiliation">
						<div class="text-center mb-5 mt-4">
							<i v-if="affiliation == 'homeinspector'" class="fas fa-hard-hat fa-4x mb-4"></i>
							<i v-if="affiliation == 'client'" class="fas fa-user fa-4x mb-4"></i>
							<i v-if="affiliation == 'realestateagent'" class="fas fa-sign fa-4x mb-4"></i>
							<h1 class="h4 text-gray-900">I Am A: <i>{{ affiliationName }}</i></h1>
							<span class="text-muted font-weight-light">Enter your login credentials below to access your account</span>
						</div>
						<form class="user">
							<div class="form-group">
								<input type="email" class="form-control form-control-user" placeholder="Email Address" v-model="email">
							</div>
							<div class="form-group">
								<input type="password" class="form-control form-control-user" placeholder="Password" v-model="password">
							</div>
							<div class="form-group">
								<div class="custom-control custom-checkbox small">
									<input type="checkbox" class="custom-control-input" id="customCheck">
									<label class="custom-control-label" for="customCheck">Remember Me</label>
								</div>
							</div>
							<a href="#" class="btn btn-primary btn-user btn-block" v-on:click="login">
								Login <i class="fas fa-angle-double-right fa-sm"></i>
							</a>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import "bootstrap";

	@Component
	export default class Login extends Vue {
		private affiliation: string = "";
		private affiliationName: string = "";
		private email: string = "";
		private password: string = "";

		private setHIAffiliation(): void {
			this.affiliation = "inspector";
			this.affiliationName = "Home Inspector";
		}

		private setClientAffiliation(): void {
			this.affiliation = "client";
			this.affiliationName = "Client";
		}

		private setREAAffiliation(): void {
			this.affiliation = "realtor";
			this.affiliationName = "Real Estate Agent";
		}

		private login(): void {
			this.$store.dispatch("attemptLogin", {
				affiliation: this.affiliation,
				loginName: this.email,
				password: this.password
			});
		}

		private get loginError(): string {
			return this.$store.getters.getLoginFailure;
		}
	}
</script>

<style scoped lang="scss">
	@import "@/scss/include.scss";

	.login-container {
		margin-top: 10vh;
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;

		.login-box {
			flex-grow: 1;
			max-width: 500px;
			margin: 1rem;
		}
	}

	.btn-affiliation {
		padding: 1rem;
		text-align: left;
		font-weight: bold;

		+ .btn-affiliation {
			margin-top: 1rem;
		}
	}

	form.user {
		.custom-checkbox.small {
			label {
				line-height: 1.5rem;
			}
		}

		.form-control-user {
			font-size: 0.8rem;
			padding: 1.5rem 1rem;
		}
	}
</style>
