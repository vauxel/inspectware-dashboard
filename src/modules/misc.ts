import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

type Level = ""|"info"|"success"|"warning"|"error";
type LoadingStatus = "stopped"|"started"|"errored";

@Module
export default class MiscModule extends VuexModule {
	private noticeLevel: Level = "";
	private noticeTitle: string = "";
	private noticeDesc: string = "";

	private messageLevel: Level = "";
	private messageText: string = "";

	private loadingStatus: LoadingStatus = "stopped";

	public get loadingStopped(): boolean {
		return this.loadingStatus === "stopped";
	}

	public get loadingStarted(): boolean {
		return this.loadingStatus === "started";
	}

	public get loadingErrored(): boolean {
		return this.loadingStatus === "errored";
	}

	@Mutation
	public DISPLAY_NOTICE(data: {
		title: string,
		desc: string,
		level: Level,
	}) {
		this.noticeTitle = data.title;
		this.noticeDesc = data.desc;
		this.noticeLevel = data.level;
	}

	@Mutation
	public DISPLAY_MESSAGE(data: {
		text: string,
		level: Level,
	}) {
		this.messageText = data.text;
		this.messageLevel = data.level;
	}

	@Mutation
	public START_LOADING() {
		this.loadingStatus = "started";
	}

	@Mutation
	public STOP_LOADING() {
		this.loadingStatus = "stopped";
	}

	@Mutation
	public ERROR_LOADING() {
		this.loadingStatus = "errored";
	}

	@Action
	public async pushNotice(data: {
		title: string,
		desc: string,
		level: Level
	}) {
		this.context.commit("DISPLAY_NOTICE", {
			title: data.title,
			desc: data.desc,
			level: data.level
		});
	}

	@Action
	public async pushMessage(data: {
		text: string,
		level: Level
	}) {
		this.context.commit("DISPLAY_MESSAGE", {
			text: data.text,
			level: data.level
		});
	}

	@Action
	public async startLoading() {
		if (!this.loadingStarted) {
			this.context.commit("START_LOADING");
		}
	}

	@Action
	public async stopLoading() {
		if (!this.loadingStopped) {
			this.context.commit("STOP_LOADING");
		}
	}

	@Action
	public async errorLoading() {
		this.context.commit("ERROR_LOADING");
	}
}
