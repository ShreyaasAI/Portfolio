/*
 * SITE CONFIG — the only file you need to edit to personalise the portfolio.
 *
 * Every value in ALL_CAPS between square brackets is a placeholder.
 * main.js reads this object and fills the page:
 *   - single values go into elements marked  data-bind="path.to.value"
 *   - lists (stack, experience, education, projects, ...) are rendered into
 *     their containers by the render* functions in main.js.
 *
 * Leave a list empty ([]) to hide that section.
 */
window.SITE = {
	/* ---------- identity ---------- */
	name: "[YOUR_NAME]",
	shortName: "[SHORT_NAME]",
	handle: "[HANDLE]", // used for the footer signature, e.g. "nauqh"
	role: "[YOUR_ROLE]", // e.g. "a software engineer"
	tagline: "[ONE_LINE_PITCH]", // e.g. "I build scalable data pipelines & intelligent workflows"
	footerRole: "[FOOTER_ROLE]", // e.g. "Full Stack Engineer"
	email: "[EMAIL@EXAMPLE.COM]",
	resumeUrl: "assets/pdf/resume.pdf",
	portrait: "assets/img/portrait-placeholder.svg",
	portraitAlt: "[PORTRAIT_ALT_TEXT]",

	/* ---------- links ---------- */
	links: {
		github: "https://github.com/[GITHUB_USERNAME]",
		linkedin: "https://www.linkedin.com/in/[LINKEDIN_SLUG]/",
	},
	githubUsername: "", // e.g. "octocat" — leave empty to show the placeholder state

	/* ---------- hero ---------- */
	heroTags: ["[TAG_1]", "[TAG_2]", "[TAG_3]", "[TAG_4]", "[TAG_5]"],

	/* ---------- about (one string per paragraph) ---------- */
	about: [
		"[ABOUT_PARAGRAPH_1 — who you are and what you focus on.]",
		"[ABOUT_PARAGRAPH_2 — what you do in your current role.]",
		"[ABOUT_PARAGRAPH_3 — side projects / freelance work.]",
		"[ABOUT_PARAGRAPH_4 — what roles you're open to.]",
	],

	/* ---------- skills ("what I use") ----------
	 * icon: a Boxicons class (https://boxicons.com)
	 * chips: { label, logo? } — logo is an SVG url (simple-icons works well:
	 *   https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/<slug>.svg)
	 *   or { label, icon: "bx-..." } for a boxicon.
	 */
	stack: [
		{
			label: "[AREA_1]",
			icon: "bx-brain",
			headline: "[ONE_LINE_ABOUT_THIS_AREA]",
			core: [{ label: "[TOOL]" }, { label: "[TOOL]" }],
			familiar: [{ label: "[TOOL]" }],
		},
		{
			label: "[AREA_2]",
			icon: "bx-data",
			headline: "[ONE_LINE_ABOUT_THIS_AREA]",
			core: [{ label: "[TOOL]" }, { label: "[TOOL]" }],
			familiar: [{ label: "[TOOL]" }],
		},
		{
			label: "[AREA_3]",
			icon: "bx-server",
			headline: "[ONE_LINE_ABOUT_THIS_AREA]",
			core: [{ label: "[TOOL]" }, { label: "[TOOL]" }],
			familiar: [{ label: "[TOOL]" }],
		},
		{
			label: "[AREA_4]",
			icon: "bx-layout",
			headline: "[ONE_LINE_ABOUT_THIS_AREA]",
			core: [{ label: "[TOOL]" }, { label: "[TOOL]" }],
			familiar: [{ label: "[TOOL]" }],
		},
	],

	/* ---------- workflow / process section (the original's "agent teams") ---------- */
	process: {
		title: ["how I [VERB]", "[NOUN]"], // second part is the emphasised word
		sideNote: "[SIDE_NOTE_LINE_1]<br>[SIDE_NOTE_LINE_2]",
		lead: "[INTRO_SENTENCE_ABOUT_YOUR_PROCESS]",
		steps: [
			{ name: "[STEP_1]", text: "[STEP_1_DESCRIPTION]" },
			{ name: "[STEP_2]", text: "[STEP_2_DESCRIPTION]" },
			{ name: "[STEP_3]", text: "[STEP_3_DESCRIPTION]" },
			{ name: "[STEP_4]", text: "[STEP_4_DESCRIPTION]" },
		],
		tools: [{ label: "[TOOL]" }, { label: "[TOOL]" }],
	},

	/* ---------- education timeline ---------- */
	education: [
		{
			dates: "[START] - [END]",
			school: "[INSTITUTION]",
			logo: "", // optional image url
			location: "[CITY, COUNTRY]",
			degree: "[DEGREE]",
			notes: ["[SPECIALISATION / GPA]"],
		},
		{
			dates: "[START] - [END]",
			school: "[INSTITUTION]",
			logo: "",
			location: "[CITY, COUNTRY]",
			degree: "[DEGREE]",
			notes: ["[DETAIL]"],
		},
	],

	/* ---------- experience (tabs on the left, details on the right) ----------
	 * back: optional second "page" of the same role; the arrow button flips to it.
	 */
	experience: [
		{
			id: "job1",
			company: "[COMPANY_1]",
			tabRole: "[SHORT_LABEL]",
			title: "[JOB_TITLE]",
			dates: "[START] ~ Present",
			metrics: ["[FOCUS_AREA]", "[FOCUS_AREA]", "[FOCUS_AREA]"],
			bullets: ["[ACHIEVEMENT_1]", "[ACHIEVEMENT_2]", "[ACHIEVEMENT_3]"],
			back: {
				metrics: ["[OTHER_FOCUS_AREA]", "[OTHER_FOCUS_AREA]"],
				bullets: ["[OTHER_ACHIEVEMENT_1]", "[OTHER_ACHIEVEMENT_2]"],
			},
		},
		{
			id: "job2",
			company: "[COMPANY_2]",
			tabRole: "[SHORT_LABEL]",
			title: "[JOB_TITLE]",
			dates: "[START] ~ [END]",
			metrics: ["[FOCUS_AREA]", "[FOCUS_AREA]"],
			bullets: ["[ACHIEVEMENT_1]", "[ACHIEVEMENT_2]"],
		},
		{
			id: "job3",
			company: "[COMPANY_3]",
			tabRole: "[SHORT_LABEL]",
			title: "[JOB_TITLE]",
			dates: "[START] ~ [END]",
			metrics: ["[FOCUS_AREA]"],
			bullets: ["[ACHIEVEMENT_1]"],
		},
	],

	/* ---------- "what I'm building now" feature card ----------
	 * Set to null to hide the section.
	 */
	building: {
		name: "[CURRENT_PROJECT_NAME]",
		status: "in progress",
		pitch: "[TWO_SENTENCE_PITCH]",
		image: "assets/img/project-placeholder.svg",
		imageAlt: "[IMAGE_ALT]",
		notes: [
			// optional screenshots that fan out beside the main image
			{ src: "assets/img/project-placeholder.svg", caption: "[CAPTION]" },
			{ src: "assets/img/project-placeholder.svg", caption: "[CAPTION]" },
		],
		tech: ["[TECH]", "[TECH]", "[TECH]"],
		liveUrl: "#",
		liveLabel: "[CTA_LABEL]",
		sourceUrl: "#",
	},

	/* ---------- projects grid ("things I've built") ----------
	 * Intentionally empty: add your own. Each project opens the side drawer.
	 * {
	 *   title, tag, year, image, images?: [..], url, github?,
	 *   description, tech: "A, B, C"
	 * }
	 */
	projects: [],

	/* ---------- archive.html table ----------
	 * { year, title, madeAt, tech: [..], url }
	 */
	archive: [],
};
