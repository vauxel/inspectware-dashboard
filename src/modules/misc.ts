import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module
export default class MiscModule extends VuexModule {
	private notifications: object[] = [];

	public get getNotifications(): object[] {
		return this.notifications;
	}

	@Mutation
	public PUSH_NOTIFICATION(data: {
		message: string,
		level: string,
	}) {
		this.notifications.push(data);
	}

	@Mutation
	public POP_NOTIFICATION() {
		this.notifications.pop();
	}

	@Action
	public async addNotification(data: {
		message: string,
		level: string
	}) {
		this.context.commit("PUSH_NOTIFICATION", {
			message: data.message,
			level: data.level
		});
	}

	@Action
	public async removeNotification() {
		this.context.commit("POP_NOTIFICATION");
	}
}
