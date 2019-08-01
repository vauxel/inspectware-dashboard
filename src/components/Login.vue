<template>
	<div class="login-container">
		<div class="login-box">
			<div v-show="!affiliation">
				<div class="text-center mb-5 mt-4">
					<h1 class="h4 text-gray-900">I Am A ...</h1>
					<div>Choose your affiliation from the options below</div>
				</div>
				<div class="flex justify-around">
					<button class="affiliation-btn" @click="setHIAffiliation">
						<i class="fas fa-3x fa-hard-hat"></i>
						Home Inspector
					</button>
					<button class="affiliation-btn" @click="setClientAffiliation">
						<i class="fas fa-3x fa-user"></i>
						Client
					</button>
					<button class="affiliation-btn" @click="setREAAffiliation">
						<i class="fas fa-3x fa-sign"></i>
						Real Estate Agent
					</button>
				</div>
			</div>
			<div v-show="affiliation">
				<div class="text-center mb-5 mt-4">
					<i v-if="affiliation == 'inspector'" class="fas fa-hard-hat fa-4x mb-4"></i>
					<i v-if="affiliation == 'client'" class="fas fa-user fa-4x mb-4"></i>
					<i v-if="affiliation == 'realtor'" class="fas fa-sign fa-4x mb-4"></i>
					<h1 class="h4 text-gray-900">I Am A: <i>{{ affiliationName }}</i></h1>
					<span class="text-muted font-weight-light">Enter your login credentials below to access your account</span>
				</div>
				<Form ref="loginForm" :model="loginInfo" :rules="loginRules">
					<FormItem label="Email Address" prop="email">
						<Input type="email" v-model="loginInfo.email" placeholder="Enter your email address"></Input>
					</FormItem>
					<FormItem label="Password" prop="password">
						<Input type="password" v-model="loginInfo.password" placeholder="Enter your password"></Input>
					</FormItem>
					<FormItem>
						<Button type="primary" long @click="login">Log In</Button>
					</FormItem>
					<Button long @click="clearAffiliation">Go Back</Button>
				</Form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class Login extends Vue {
		private affiliation: string = "";
		private affiliationName: string = "";

		private loginInfo = {
			email: "",
			password: ""
		};

		private loginRules = {
			email: [
				{ required: true, message: "You must enter an email", trigger: "blur" },
				{ type: "email", message: "Invalid email format", trigger: "blur" }
			],
			password: [
				{ required: true, message: "You must enter a password", trigger: "blur" }
			]
		};

		private clearAffiliation(): void {
			this.affiliation = "";
			this.affiliationName = "";
			this.$refs["loginForm"].resetFields();
		}

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

		private async login() {
			let valid: boolean = await this.$refs["loginForm"].validate();

			if (!valid) {
				return;
			}

			this.$store.dispatch("attemptLogin", {
				affiliation: this.affiliation,
				loginName: this.loginInfo.email,
				password: this.loginInfo.password
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
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: $primary;

		.login-box {
			flex-grow: 1;
			max-width: 500px;
			padding: 30px;
			background-color: $white;
			box-shadow: $shadow-1;
			border-radius: 5px;

			.affiliation-btn {
				flex: 1;
				background: $primary;
				border-radius: 5px;
				color: $grey-1;
				padding: 20px 10px;
				margin: 0px 5px;
				font-weight: 600;
				border: 2px solid $primary-darker;
				transition: all 150ms ease-in-out;

				&:hover {
					background-color: $primary-darker;
					box-shadow: $shadow-2;
				}

				.fas {
					display: block;
					padding-bottom: 10px;
					margin-bottom: 5px;
					border-bottom: 2px solid $grey-1;
				}
			}
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
