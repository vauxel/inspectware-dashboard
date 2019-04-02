import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import HTTP from "@/classes/http";

@Module
export default class AuthModule extends VuexModule {
	private loggedIn: boolean = !!localStorage.getItem("authtoken");
	private loginFailure: string = "";

	private affiliation: string = "";
	private userId: string = "";
	private loginname: string = "";
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
		return this.loginname;
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
	public LOGIN_FAILURE(data: string) {
		this.loginFailure = data;
	}

	@Mutation
	public UPDATE_BASE_INFO(data: {
		affiliation: string,
		userId: string,
		loginname: string,
		name: string,
	}) {
		this.affiliation = data.affiliation;
		this.userId = data.userId;
		this.loginname = data.loginname;
		this.name = data.name;
	}

	@Action
	public async attemptLogin(data: {
		affiliation: string,
		loginname: string,
		password: string,
	}) {
		let result;

		try {
			result = await HTTP.post("auth/login", {
				affiliation: data.affiliation,
				loginname: data.loginname,
				password: data.password,
			});
		} catch (error) {
			this.context.commit("LOGIN_FAILURE", error.response.status + ": " + error.response.statusText);
			return;
		}

		if (!result.data.success) {
			this.context.commit("LOGIN_FAILURE", result.data.error.message);
		} else {
			console.log(result);
			this.context.commit("LOGIN");
			this.context.commit("UPDATE_BASE_INFO", {
				affiliation: data.affiliation,
				userId: result.data.data.userId,
				loginname: data.loginname,
				name: result.data.data.name,
			});
			localStorage.setItem("authtoken", result.data.data.token);
		}
	}
}
