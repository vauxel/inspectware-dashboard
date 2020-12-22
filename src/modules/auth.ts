import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Router from "../router";
import HTTP from "../classes/http";

@Module
export default class AuthModule extends VuexModule {
	private loggedIn: boolean = !!localStorage.getItem("auth_token");

	private affiliation: string = "";
	private userId: string = "";
	private loginName: string = "";
	private name: string = "";
	private accountId: string = "";
	private isOwner: boolean = false;

	public get isLoggedIn(): boolean {
		return this.loggedIn;
	}

	public get getAffiliation(): string {
		return this.affiliation;
	}

	public get isInspector(): boolean {
		return this.affiliation === "inspector";
	}

	public get isClient(): boolean {
		return this.affiliation === "client";
	}

	public get isRealtor(): boolean {
		return this.affiliation === "realtor";
	}

	public get getUserId(): string {
		return this.userId;
	}

	public get getLoginName(): string {
		return this.loginName;
	}

	public get getUserName(): string {
		return this.name;
	}

	public get getAccountId(): string {
		return this.accountId;
	}

	public get isOwnerInspector(): boolean {
		return this.isOwner;
	}

	@Mutation
	public LOGIN() {
		this.loggedIn = true;
	}

	@Mutation
	public LOGOUT() {
		this.loggedIn = false;
	}

	@Mutation
	public UPDATE_BASE_INFO(data: {
		affiliation: string,
		userId: string,
		loginName: string,
		name: string,
		accountId?: string,
		isOwner?: boolean
	}) {
		this.affiliation = data.affiliation;
		this.userId = data.userId;
		this.loginName = data.loginName;
		this.name = data.name;

		if (data.accountId) {
			this.accountId = data.accountId;
		}

		if (data.isOwner) {
			this.isOwner = data.isOwner;
		}
	}

	@Action
	public readAuthToken() {
		const authToken = localStorage.getItem("auth_token");

		if (authToken) {
			const parsedToken = JSON.parse(window.atob(authToken.split(".")[1]));
			this.context.commit("UPDATE_BASE_INFO", {
				affiliation: parsedToken.affiliation,
				userId: parsedToken.id,
				loginName: parsedToken.loginName,
				name: parsedToken.name,
				accountId: parsedToken.accountId,
				isOwner: parsedToken.isOwner
			});
		}
	}

	@Action
	public async attemptLogin(data: {
		affiliation: string,
		loginName: string,
		password: string
	}) {
		let result;

		try {
			result = await HTTP.post("auth/login", {
				affiliation: data.affiliation,
				loginName: data.loginName,
				password: data.password,
			});
		} catch (error) {
			this.context.dispatch("pushMessage", {
				text: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
				level: "error"
			});
			return;
		}

		if (result.data.status == 200) {
			localStorage.setItem("auth_token", result.data.data.token);

			this.context.dispatch("readAuthToken");
			this.context.commit("LOGIN");
			this.context.dispatch("pushMessage", {
				text: "You have been successfully logged in! Welcome, " + this.name + ".",
				level: "success"
			});

			Router.push(`/${data.affiliation}`);
		}
	}

	@Action
	public logout() {
		localStorage.removeItem("auth_token");
		this.context.commit("LOGOUT");
		this.context.dispatch("pushMessage", {
			text: "You have been successfully logged out!",
			level: "success"
		});
		Router.push("/");
	}

	@Action
	public restrictedRedirect() {
		if (this.isLoggedIn) {
			localStorage.removeItem("auth_token");
			this.context.commit("LOGOUT");
		}

		this.context.dispatch("pushMessage", {
			text: "You are unauthorized to make that request without sufficient authentication.",
			level: "warning"
		});
		Router.push("/");
	}
}
