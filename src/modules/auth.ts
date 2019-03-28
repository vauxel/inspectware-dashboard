import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module
export default class AuthModule extends VuexModule {
	private loggedIn: boolean = false;

	public get isLoggedIn(): boolean {
		return this.loggedIn;
	}

	@Mutation
	public LOGIN(): void {
		this.loggedIn = true;
	}

	@Action
	public attemptLogin(): void {
		this.context.commit("LOGIN");
	}
}
