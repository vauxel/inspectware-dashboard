<template>
	<div class="container-fluid">
		<Row :gutter="15">
			<Col span="12">
				<Card>
					<p slot="title">
						<i class="fas fa-fw fa-user"></i>
						User Info Settings
					</p>
					<Button type="primary" size="small" slot="extra" @click="saveUserInformation">
						<i class="fas fa-fw fa-save"></i>
						Save Changes
					</Button>
					<Form ref="userInfoForm" :model="userInfo" :rules="userInfoRules" :label-width="135">
						<FormItem label="First Name" prop="firstName">
							<Input v-model="userInfo.firstName" placeholder="Enter your first name" disabled></Input>
						</FormItem>
						<FormItem label="Last Name" prop="lastName">
							<Input v-model="userInfo.lastName" placeholder="Enter your last name" disabled></Input>
						</FormItem>
						<FormItem label="Email Address" prop="email">
							<Input v-model="userInfo.email" placeholder="Enter your email address"></Input>
						</FormItem>
						<FormItem label="Phone Number" prop="phone">
							<masked-input
								type="text"
								class="ivu-input"
								v-model="userInfo.phone"
								:mask="['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]"
								:guide="true"
								placeholderChar="_">
							</masked-input>
						</FormItem>
						<FormItem label="Confirm Password" prop="confirmPass">
							<Input type="password" v-model="userInfo.confirmPass" placeholder="Enter your password to confirm changes"></Input>
						</FormItem>
					</Form>
				</Card>
			</Col>
			<Col span="12">
				<Card>
					<p slot="title">
						<i class="fas fa-fw fa-shield-alt"></i>
						Security Settings
					</p>
					<Button type="primary" size="small" slot="extra" @click="saveSecurity">
						<i class="fas fa-fw fa-save"></i>
						Save Changes
					</Button>
					<Form ref="securityForm" :model="security" :rules="securityRules" :label-width="160">
						<FormItem label="Current Password" prop="currentPass">
							<Input type="password" v-model="security.currentPass" placeholder="Enter your current password"></Input>
						</FormItem>
						<FormItem label="New Password" prop="newPass1">
							<Input type="password" v-model="security.newPass1" placeholder="Enter a new password"></Input>
						</FormItem>
						<FormItem label="Repeat New Password" prop="newPass2">
							<Input type="password" v-model="security.newPass2" placeholder="Enter the new password again"></Input>
						</FormItem>
					</Form>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import MaskedInput from "vue-text-mask";
	import HTTP from "../classes/http";

	@Component({
		components: {
			MaskedInput
		}
	})
	export default class Settings extends Vue {
		private userInfo = {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			confirmPass: ""
		};

		private security = {
			currentPass: "",
			newPass1: "",
			newPass2: ""
		};

		private userInfoRules = {
			email: [
				{ message: "The email cannot be empty", trigger: "blur" },
				{ type: "email", message: "Invalid email format", trigger: "blur" }
			],
			phone: [
				{ message: "The phone number cannot be empty", trigger: "blur" }
			],
			confirmPass: [
				{ required: true, message: "You must enter your password to save your changes", trigger: "blur" }
			]
		};

		private securityRules = {
			currentPass: [
				{ required: true, message: "The current password cannot be empty", trigger: "blur" }
			],
			newPass1: [
				{ required: true, validator: this.validateNewPass1, trigger: "change" }
			],
			newPass2: [
				{ required: true, validator: this.validateNewPass2, trigger: "change" }
			]
		};

		public mounted() {
			this.getUserInformation();
		}

		private validateNewPass1(rule: any, value: any, callback: Function) {
			if (value === "") {
				callback(new Error("Please enter a new password"));
			} else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.security.newPass1))) {
				callback(new Error("The new password must be atleast 8 character long, atleast one lowercase letter, atleast one uppercase letter, and atleast one number"));
			} else {
				callback();
			}
		}

		private validateNewPass2(rule: any, value: any, callback: Function) {
			if (value === "") {
				callback(new Error("Please enter the new password again"));
			} else if (value !== this.security.newPass1) {
				callback(new Error("The two passwords do not match"));
			} else {
				callback();
			}
		}

		private async getUserInformation() {
			const result = await HTTP.get("/auth/user_info");
			this.userInfo.firstName = result.data.data.firstName;
			this.userInfo.lastName = result.data.data.lastName;
			this.userInfo.email = result.data.data.email;
			this.userInfo.phone = result.data.data.phone;
		}

		private async saveUserInformation() {
			let valid: boolean = await this.$refs["userInfoForm"].validate();

			if (!valid) {
				return;
			}

			const result = await HTTP.post("/user/update_info", {
				email: this.userInfo.email,
				phone: this.userInfo.phone
			});

			if (result.data.status != 200) {
				this.$Notice.info({
					title: "User Info Updated",
					desc: "Your user information has been successfully updated"
				});

				this.userInfo.confirmPass = "";
			} else {
				this.$Message.error(result.data.error.message);

				if (result.data.error.message === "Incorrect current password") {
					this.$refs["userInfoForm"].$children[this.$refs["userInfoForm"].$children.length - 1].error = "The password you entered is incorrect";
				}
			}
		}

		private async saveSecurity() {
			let valid: boolean = await this.$refs["securityForm"].validate();

			if (!valid) {
				return;
			}

			const result = await HTTP.post("/auth/update_pass", {
				current: this.security.currentPass,
				new: this.security.newPass1
			});

			if (result.data.status != 200) {
				this.$Notice.info({
					title: "Password Updated",
					desc: "Your password has been successfully changed"
				});

				this.$refs["securityForm"].resetFields();
			} else {
				this.$Message.error(result.data.error.message);

				if (result.data.error.message === "Incorrect current password") {
					this.$refs["securityForm"].$children[0].error = "The password you entered is incorrect";
				}
			}
		}
	}
</script>
