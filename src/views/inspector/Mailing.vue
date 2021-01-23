<template>
	<div id="mailing">
		<div class="row">
			<div class="col-xs-9">
				<div class="template-panel panel">
					<div class="panel-head">
						<div class="panel-title">
							Email Header Content
						</div>
						<div class="panel-options">
							<Button size="small" type="text" @click="toggleTemplatePanel('header')">
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
				<div class="template-panel panel">
					<div class="panel-head">
						<div class="panel-title">
							Email Footer Content
						</div>
						<div class="panel-options">
							<Button size="small" type="text" @click="toggleTemplatePanel('footer')">
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
				<div class="template-panel panel" v-for="template in templates" :key="template">
					<div class="panel-head">
						<div class="panel-title">
							Email Template: {{ template.name }}
						</div>
						<div class="panel-options">
							<Button size="small" type="text" @click="toggleTemplatePanel(template)">
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
			<div class="col-xs-3">
				<div class="panel">
					<div class="panel-head">
						<div class="panel-title">
							Template Placeholders
						</div>
					</div>
					<div class="panel-body">
						<Alert type="info" class="template-placeholders-info" v-if="templatePlaceholders.length != 0">You can use any of these placeholder tags in the body of an email template to have them be automatically replaced with their relevant info when the email is sent.</Alert>
						<Alert type="info" class="template-placeholders-info" v-if="templatePlaceholders.length == 0">Please open one of the email template panels to the left to view which placeholders may be used.</Alert>
						<div class="template-placeholder" v-for="entry in templatePlaceholders" :key="entry">
							<div class="template-placeholder-section" v-if="entry.grouping">{{ entry.grouping }}</div>
							<div class="template-placeholder-pair" v-if="!entry.grouping">
								<div class="template-placeholder-key">{{ entry.name }}</div>
								<div class="template-placeholder-value">{{ wrapInBraces(entry.placeholder) }}</div>
							</div>
						</div>
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

		private templates: any[] = [];
		private templatePlaceholdersCache = {};
		private templatePlaceholders = [];

		public mounted() {
			this.getTemplates();
		}

		private wrapInBraces(placeholder: string) {
			return "{{" + placeholder + "}}";
		}

		private toggleTemplatePanel(template: any) {
			let templateId;
			let opened;

			if (typeof template === "object") {
				templateId = template.id;
				let open = !template.opened;

				this.headerTemplate.opened = false;
				this.footerTemplate.opened = false;
				for (let otherTemplate of this.templates) {
					otherTemplate.opened = false;
				}

				if (open) {
					template.opened = true;
					opened = true;
				}
			} else if (typeof template === "string") {
				templateId = template;
				let headerOpen = !this.headerTemplate.opened;
				let footerOpen = !this.footerTemplate.opened;

				this.headerTemplate.opened = false;
				this.footerTemplate.opened = false;
				for (let otherTemplate of this.templates) {
					otherTemplate.opened = false;
				}

				if (template === "header") {
					if (headerOpen) {
						this.headerTemplate.opened = true;
						opened = true;
					}
				} else if (template === "footer") {
					if (footerOpen) {
						this.footerTemplate.opened = true;
						opened = true;
					}
				}
			}

			if (opened) {
				this.updateTemplatePlaceholdersPanel(templateId);
			} else {
				this.templatePlaceholders = [];
			}
		}

		private async updateTemplatePlaceholdersPanel(template: string) {
			if ((this.templatePlaceholdersCache as any)[template]) {
				this.templatePlaceholders = (this.templatePlaceholdersCache as any)[template];
			} else {
				try {
					const result = await HTTP.get("/account/template_placeholders", {
						params: { template: template }
					});

					this.templatePlaceholders = result.data.data;
					(this.templatePlaceholdersCache as any)[template] = result.data.data;
				} catch (error) {
					this.$store.dispatch("pushNotice", {
						title: "Get Template Placeholders Failed",
						desc: error.response.data.message ? error.response.data.message : error.response.status + ": " + error.response.statusText,
						level: "error"
					});
				}
			}
		}

		private async getTemplates() {
			try {
				const result = await HTTP.get("/account/email_templates");

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
	@import "@/scss/include.scss";
	@import '~quill/dist/quill.core.css';
	@import '~quill/dist/quill.snow.css';

	#mailing {
		.template-panel {
			margin-bottom: 1rem;
		}

		.template-placeholders-info {
			&:last-child {
				margin-bottom: 0;
			}
		}

		.template-placeholder-section {
			text-transform: uppercase;
			font-size: $font-size_sm;
			color: $color_grey-6;
			margin-top: 0.5rem;
			margin-bottom: 0.5rem;
		}

		.template-placeholder-pair {
			.template-placeholder-key {
				float: left;
				font-weight: $font-weight_semibold;
			}

			.template-placeholder-value {
				float: right;
				font-family: monospace;
			}

			&::after {
				content: '';
				display: table;
				clear: both;
			}
		}
	}
</style>
