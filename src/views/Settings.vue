<template>
	<div class="container-fluid">
		<!-- Page Heading -->
		<div class="d-sm-flex align-items-center justify-content-between mb-4">
			<h1 class="h3 mb-0 text-gray-800">Settings</h1>
		</div>

		<!-- Content Row -->
		<div class="row">
			<!-- User Info Settings -->
			<div class="col-xl-6">
				<div class="card shadow mb-4">
					<!-- Card Header -->
					<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
						<h6 class="m-0 font-weight-bold"><i class="fas fa-id-badge"></i> User Info Settings</h6>
						<button form="userSettings" class="btn btn-sm btn-primary btn-icon-split shadow-sm" >
							<span class="icon"><i class="fas fa-save fa-sm"></i></span>
							<span class="text d-none d-sm-inline-block">Save Changes</span>
						</button>
					</div>
					<!-- Card Body -->
					<div class="card-body">
						<div class="alert alert-danger" role="alert" v-show="userInfoError">{{ userInfoError }}</div>
						<form id="userSettings" v-on:submit.prevent="saveUserInformation">
							<div class="form-group">
								<label for="firstName">First Name</label>
								<input type="text" class="form-control" id="firstName" v-model="firstName" disabled>
							</div>
							<div class="form-group">
								<label for="lastName">Last Name</label>
								<input type="text" class="form-control" id="lastName" v-model="lastName" disabled>
							</div>
							<div class="form-group">
								<label for="emailAddress">Email Address</label>
								<input type="email" class="form-control" id="emailAddress" placeholder="Enter an email address" v-bind:class="{ 'is-invalid': invalidEmail }" v-model="emailAddress">
								<div class="invalid-feedback">Please enter a valid email</div>
							</div>

							<div class="form-group">
								<label for="phoneNumber">Phone Number</label>
								<masked-input
									type="text"
									id="phoneNumber"
									class="form-control"
									v-model="phoneNumber"
									:mask="['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]"
									:guide="true"
									placeholderChar="_"
									v-bind:class="{ 'is-invalid': invalidPhone }">
								</masked-input>
								<div class="invalid-feedback">Please enter a valid phone number</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<!-- Security Settings -->
			<div class="col-xl-6">
				<div class="card shadow mb-4">
					<!-- Card Header -->
					<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
						<h6 class="m-0 font-weight-bold"><i class="fas fa-shield-alt"></i> Security Settings</h6>
						<button form="securitySettings" class="btn btn-sm btn-primary btn-icon-split shadow-sm" >
							<span class="icon"><i class="fas fa-save fa-sm"></i></span>
							<span class="text d-none d-sm-inline-block">Save Changes</span>
						</button>
					</div>
					<!-- Card Body -->
					<div class="card-body">
						<div class="alert alert-danger" role="alert" v-show="securityError">{{ securityError }}</div>
						<form id="securitySettings" v-on:submit.prevent="saveSecurity">
							<div class="form-group">
								<label for="currentPassword">Current Password</label>
								<input type="password" class="form-control" id="currentPassword" placeholder="Enter your current password" required v-bind:class="{ 'is-invalid': invalidPassword }" v-model="currentPassword">
								<div class="invalid-feedback">The current password is incorrect</div>
							</div>
							<div class="form-group">
								<label for="newPassword1">New Password</label>
								<input type="password" class="form-control" id="newPassword1" placeholder="Enter a new password" required v-bind:class="{ 'is-invalid': invalidNewPassword }" v-model="newPassword1">
								<div class="invalid-feedback">
									<span>Please supply a valid new password:</span>
									<ul>
										<li>Longer than 8 characters</li>
										<li>Atleast one uppercase letter [A-Z]</li>
										<li>Atleast one lowercase letter [a-z]</li>
										<li>Atleast one number [0-9]</li>
									</ul>
								</div>
							</div>
							<div class="form-group">
								<label for="newPassword2">Repeat New Password</label>
								<input type="password" class="form-control" id="newPassword2" placeholder="Enter a new password again" required v-bind:class="{ 'is-invalid': passwordNoMatch }" v-model="newPassword2">
								<div class="invalid-feedback">The new passwords don't match</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
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
		private currentPassword: string = "";
		private newPassword1: string = "";
		private newPassword2: string = "";
		private firstName: string = "";
		private lastName: string = "";
		private emailAddress: string = "";
		private phoneNumber: string = "";

		private invalidPassword: boolean = false;
		private securityError: string = "";
		private userInfoError: string = "";

		public mounted() {
			this.getUserInformation();
		}

		private get invalidNewPassword(): boolean {
			return this.newPassword1 !== "" && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.newPassword1));
		}

		private get passwordNoMatch(): boolean {
			return this.newPassword1 !== "" && this.newPassword2 !== "" && this.newPassword1 !== this.newPassword2;
		}

		private get invalidEmail(): boolean {
			return this.emailAddress === "" || !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.emailAddress));
		}

		private get invalidPhone(): boolean {
			return this.phoneNumber === "" || !(/^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(this.phoneNumber));
		}

		private async getUserInformation() {
			const result = await HTTP.get("/auth/user_info");
			this.firstName = result.data.data.firstName;
			this.lastName = result.data.data.lastName;
			this.emailAddress = result.data.data.email;
			this.phoneNumber = result.data.data.phone;
		}

		private async saveUserInformation() {

		}

		private async saveSecurity() {
			if (this.currentPassword === "" || this.newPassword1 === "" || this.newPassword2 === "" || this.newPassword1 !== this.newPassword2 || this.invalidNewPassword) {
				return;
			}

			this.invalidPassword = false;

			const result = await HTTP.post("/auth/update_pass", {
				current: this.currentPassword,
				new: this.newPassword1
			});

			if (result.data.success) {
				this.$store.dispatch("addNotification", {
					message: "Your password has been successfully changed",
					level: "success"
				});

				this.currentPassword = "";
				this.newPassword1 = "";
				this.newPassword2 = "";
				this.invalidPassword = false;
			} else {
				if (result.data.error.message === "Incorrect current password") {
					this.invalidPassword = true;
				} else {
					this.securityError = result.data.error.message;
				}
			}
		}
	}
</script>
