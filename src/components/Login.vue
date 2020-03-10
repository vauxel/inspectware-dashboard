<template>
	<div class="login-container">
		<div class="login-box">
			<div v-show="!affiliation">
				<div class="login-header">
					<div class="login-header-title">I Am A ...</div>
					<div class="login-header-subtitle">Choose your affiliation from the options below</div>
				</div>
				<div class="login-affiliations">
					<button class="login-affiliation-btn" @click="setHIAffiliation">
						<i class="fas fa-3x fa-hard-hat"></i>
						<span>Home Inspector</span>
					</button>
					<button class="login-affiliation-btn" @click="setClientAffiliation">
						<i class="fas fa-3x fa-user"></i>
						<span>Client</span>
					</button>
					<button class="login-affiliation-btn" @click="setREAAffiliation">
						<i class="fas fa-3x fa-sign"></i>
						<span>Real Estate Agent</span>
					</button>
				</div>
			</div>
			<div v-show="affiliation">
				<div class="login-header">
					<i v-if="affiliation == 'inspector'" class="fas fa-hard-hat fa-3x login-affiliation-badge"></i>
					<i v-if="affiliation == 'client'" class="fas fa-user fa-3x login-affiliation-badge"></i>
					<i v-if="affiliation == 'realtor'" class="fas fa-sign fa-3x login-affiliation-badge"></i>
					<div class="login-header-title">I Am A: {{ affiliationName }}</div>
					<div class="login-header-subtitle">Enter your login credentials below to access your account</div>
				</div>
				<Form ref="loginForm" :model="loginInfo" :rules="loginRules" @submit="login">
					<FormItem label="Email Address" prop="email">
						<Input type="email" v-model="loginInfo.email" placeholder="Enter your email address" @keyup.enter.native="login"/>
					</FormItem>
					<FormItem label="Password" prop="password">
						<Input type="password" v-model="loginInfo.password" placeholder="Enter your password" @keyup.enter.native="login"/>
					</FormItem>
					<div class="equal-width-buttons">
						<Button type="primary" @click="login">Log In</Button>
						<Button @click="clearAffiliation">Go Back</Button>
					</div>
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
			(this.$refs["loginForm"] as any).resetFields();
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
			let valid: boolean = await (this.$refs["loginForm"] as any).validate();

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

<style scoped lang="less">
	@import "../less/include.less";

	.login-container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: @color_primary;

		&::after {
			content: '';
			background-image: url("/img/loginbg.jpg");
			background-size: cover;
			opacity: 0.25;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		.login-box {
			position: relative;
			z-index: 1;
			flex-grow: 1;
			max-width: 550px;
			padding: 4rem;
			margin: 4rem;
			background-color: @color_white;
			box-shadow: @shadow-2;
			border-radius: 5px;

			&::before {
				content: "inspectware";
				position: absolute;
				top: -3rem;
				left: 50%;
				transform: translateX(-50%);
				font-weight: @font-weight_bold;
				font-style: italic;
				font-size: @font-size_xl;
				color: @font_color_dark;
				background-color: @color_white;
				padding: 1rem 2rem;
				border-radius: 10px;
				box-shadow: @shadow-1;
			}
		}

		.login-header {
			margin-bottom: 3rem;
			padding-bottom: 2rem;
			border-bottom: 2px solid @color_grey-3;

			.login-header-title {
				font-weight: @font-weight_bold;
				font-size: @font-size_4xl;
			}

			.login-header-subtitle {
				font-style: italic;
			}
		}

		.login-affiliations {
			.login-affiliation-btn {
				position: relative;
				width: 100%;
				background: @color_primary;
				border-radius: 5px;
				color: @font_color_light;
				padding: 1rem 0;
				margin: 0px 5px;
				font-weight: 600;
				border: 2px solid @color_primary-darker;

				&:hover {
					background-color: @color_primary-darker;
					box-shadow: @shadow-2;
					cursor: pointer;
				}

				&:not(:last-of-type) {
					margin-bottom: 1rem;
				}

				.fas {
					float: right;
					margin-right: 2rem;
				}

				span {
					position: absolute;
					top: 50%;
					left: 2rem;
					transform: translateY(-50%);
				}
			}
		}

		.login-affiliation-badge {
			position: absolute;
			top: -3rem;
			left: -3rem;
			background-color: @color_white;
			padding: 1.5rem;
			box-shadow: @shadow-1;
			border-radius: 50%;
			box-sizing: content-box;
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
