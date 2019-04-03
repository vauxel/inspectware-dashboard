import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import HTTP from "@/classes/http";

@Module
export default class AuthModule extends VuexModule {
	private loggedIn: boolean = !!localStorage.getItem("authtoken");
	private loginFailure: string = "";

	private affiliation: string = "";
	private userId: string = "";
	private loginName: string = "";
	private name: string = "";
	private accountId: string = "";

	public get isLoggedIn(): boolean {
		return this.loggedIn;
	}

	public get getLoginFailure(): string {
		return this.loginFailure;
	}

	public get getAffiliation(): string {
		return this.affiliation;
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

	@Mutation
	public LOGIN() {
		this.loggedIn = true;
	}

	@Mutation
	public LOGOUT() {
		this.loggedIn = false;
	}

	@Mutation
	public LOGIN_FAILURE(data: string) {
		this.loginFailure = data;
	}

	@Mutation
	public UPDATE_BASE_INFO(data: {
		affiliation: string,
		userId: string,
		loginName: string,
		name: string,
		accountId?: string
	}) {
		this.affiliation = data.affiliation;
		this.userId = data.userId;
		this.loginName = data.loginName;
		this.name = data.name;

		if (data.accountId) {
			this.accountId = data.accountId;
		}
	}

	@Action
	public readAuthToken() {
		const authToken = localStorage.getItem("authtoken");

		if (authToken) {
			const parsedToken = JSON.parse(window.atob(authToken.split(".")[1]));
			this.context.commit("UPDATE_BASE_INFO", {
				affiliation: parsedToken.affiliation,
				userId: parsedToken.id,
				loginName: parsedToken.loginName,
				name: parsedToken.name,
				accountId: parsedToken.accountId
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
			this.context.commit("LOGIN_FAILURE", error.response.status + ": " + error.response.statusText);
			return;
		}

		if (!result.data.success) {
			this.context.commit("LOGIN_FAILURE", result.data.error.message);
		} else {
			localStorage.setItem("authtoken", result.data.data.token);
			this.context.dispatch("readAuthToken");
			this.context.commit("LOGIN");
			this.context.dispatch("addNotification", {
				message: "You have been successfully logged in! Welcome, " + this.name + ".",
				level: "success"
			});
		}
	}

	@Action
	public logout() {
		localStorage.removeItem("authtoken");
		this.context.commit("LOGOUT");
		this.context.dispatch("addNotification", {
			message: "You have been successfully logged out!",
			level: "success"
		});
	}
}
