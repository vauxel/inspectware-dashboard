<template>
	<div id="mailing">
		<div class="flex-row flex-gutter-2">
			<div class="flex-column flex-grow flex-gutter-2">
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							Email Header Content
						</div>
						<div class="panel-options">
							<Button size="small" type="text" @click="headerTemplate.opened = !headerTemplate.opened">
								<i class="fas fa-caret-square-down" v-show="!headerTemplate.opened"></i>
								<i class="fas fa-caret-square-up" v-show="headerTemplate.opened"></i>
							</Button>
						</div>
					</div>
					<div class="panel-body" v-show="headerTemplate.opened">
						<Form label-position="top">
							<FormItem label="Content" prop="time">
								<quill-editor class="editor" v-model="headerTemplate.body"></quill-editor>
							</FormItem>
							<FormItem>
								<Button type="primary" @click="updateHeaderTemplate()">Update Header Content</Button>
							</FormItem>
						</Form>
					</div>
				</div>
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							Email Footer Content
						</div>
						<div class="panel-options">
							<Button size="small" type="text" @click="footerTemplate.opened = !footerTemplate.opened">
								<i class="fas fa-caret-square-down" v-show="!footerTemplate.opened"></i>
								<i class="fas fa-caret-square-up" v-show="footerTemplate.opened"></i>
							</Button>
						</div>
					</div>
					<div class="panel-body" v-show="footerTemplate.opened">
						<Form label-position="top">
							<FormItem label="Content" prop="time">
								<quill-editor class="editor" v-model="footerTemplate.body"></quill-editor>
							</FormItem>
							<FormItem>
								<Button type="primary" @click="updateFooterTemplate()">Update Footer Content</Button>
							</FormItem>
						</Form>
					</div>
				</div>
				<div class="panel" v-for="template in templates" :key="template">
					<div class="panel-head">
						<div class="panel-title">
							Email Template: {{ template.name }}
						</div>
						<div class="panel-options">
							<Button size="small" type="text" @click="template.opened = !template.opened">
								<i class="fas fa-caret-square-down" v-show="!template.opened"></i>
								<i class="fas fa-caret-square-up" v-show="template.opened"></i>
							</Button>
						</div>
					</div>
					<div class="panel-body" v-show="template.opened">
						<Form label-position="top">
							<FormItem label="Subject" prop="date">
								<Input v-model="template.subject" placeholder="Enter the primary address"></Input>
							</FormItem>
							<FormItem label="Body" prop="time">
								<quill-editor class="editor" v-model="template.body"></quill-editor>
							</FormItem>
							<FormItem>
								<Button type="primary" @click="updateTemplate(template.id, template.subject, template.body)">Update Template</Button>
							</FormItem>
						</Form>
					</div>
				</div>
			</div>
			<div class="flex-column">
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							Template Placeholders
						</div>
					</div>
					<div class="panel-body">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import HTTP from "@/classes/http";
	import { quillEditor } from "vue-quill-editor";

	@Component({
		components: {
			quillEditor
		}
	})
	export default class Mailing extends Vue {
		private headerTemplate = {
			body: "",
			opened: false
		};

		private footerTemplate = {
			body: "",
			opened: false
		};

		private templates: object[] = [];

		public mounted() {
			this.getTemplates();
			console.log(this.$refs);
		}

		private async getTemplates() {
			try {
				const result = await HTTP.get("/account/email_templates", {
					params: { id: this.$route.params.id }
				});

				this.headerTemplate.body = result.data.data.header;
				this.footerTemplate.body = result.data.data.footer;

				for (let template of result.data.data.templates) {
					this.templates.push({
						id: template.id,
						name: template.name,
						subject: template.subject,
						body: template.body,
						opened: false
					});
				}
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Get Email Templates Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}
		}

		private async updateTemplate(id: string, subject: string, body: string) {
			try {
				const result = await HTTP.post("/account/email_template", {
					template: id,
					subject: subject,
					body: body
				});

				this.$store.dispatch("pushMessage", {
					text: "Email template successfully updated",
					level: "success"
				});
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Update Template Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}
		}

		private async updateHeaderTemplate() {
			try {
				const result = await HTTP.post("/account/email_template", {
					template: "header",
					body: this.headerTemplate.body
				});

				this.$store.dispatch("pushMessage", {
					text: "Email template successfully updated",
					level: "success"
				});
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Update Template Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}
		}

		private async updateFooterTemplate() {
			try {
				const result = await HTTP.post("/account/email_template", {
					template: "footer",
					body: this.footerTemplate.body
				});

				this.$store.dispatch("pushMessage", {
					text: "Email template successfully updated",
					level: "success"
				});
			} catch (error) {
				this.$store.dispatch("pushNotice", {
					title: "Update Template Failed",
					desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
					level: "error"
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	@import '~quill/dist/quill.core.css';
	@import '~quill/dist/quill.snow.css';
</style>
