/*
 * Portfolio runtime. Shared by index.html and the subpages; every block checks
 * that its elements exist before doing anything.
 *
 * Order matters: content is rendered from window.SITE (config.js) first, so the
 * behaviour blocks below see the final DOM.
 */
const SITE = window.SITE || {};
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;

const esc = (s = "") =>
	String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), SITE);

/*=============== BIND SINGLE VALUES ===============*/
$$("[data-bind]").forEach((el) => {
	const v = get(el.dataset.bind);
	if (v != null) el.textContent = v;
});
$$("[data-href]").forEach((el) => {
	const key = el.dataset.href;
	const v = key === "mailto" ? `mailto:${SITE.email || ""}` : get(key);
	if (v) el.href = v;
});
$$("[data-src]").forEach((el) => {
	const v = get(el.dataset.src);
	if (v) el.src = v;
	if (el.dataset.alt) el.alt = get(el.dataset.alt) || "";
});

/*=============== RENDER LISTS ===============*/
const chip = (c) =>
	c.logo
		? `<li style="--logo: url(${esc(c.logo)})">${esc(c.label)}</li>`
		: `<li>${c.icon ? `<i class="bx ${esc(c.icon)}" aria-hidden="true"></i>` : ""}${esc(c.label)}</li>`;

function hideSection(id) {
	const s = document.getElementById(id);
	if (s) s.hidden = true;
}

function renderHero() {
	const el = $("#heroTags");
	if (el) el.innerHTML = (SITE.heroTags || []).map((t) => `<span class="home__stack-tag">${esc(t)}</span>`).join("");
}

function renderAbout() {
	const el = $("#aboutContent");
	if (el) el.innerHTML = (SITE.about || []).map((p) => `<p>${esc(p)}</p>`).join("");
}

function renderStack() {
	const el = $("#stackGrid");
	if (!el) return;
	if (!SITE.stack?.length) return hideSection("skills");
	el.innerHTML = SITE.stack
		.map(
			(a) => `
		<article class="stack__card" data-reveal>
			<h3 class="stack__label"><i class="bx ${esc(a.icon || "bx-code-alt")}" aria-hidden="true"></i>${esc(a.label)}</h3>
			<p class="stack__headline">${esc(a.headline)}</p>
			<div class="stack__tier"><span class="stack__tier-label">core</span><ul class="chips">${(a.core || []).map(chip).join("")}</ul></div>
			${a.familiar?.length ? `<div class="stack__tier stack__tier--muted"><span class="stack__tier-label">familiar</span><ul class="chips">${a.familiar.map(chip).join("")}</ul></div>` : ""}
		</article>`,
		)
		.join("");
}

function renderProcess() {
	const p = SITE.process;
	if (!$("#processSteps")) return;
	if (!p) return hideSection("process");
	$("#processTitle").innerHTML = `${esc(p.title?.[0])} <em>${esc(p.title?.[1])}</em>`;
	$("#processNote").innerHTML = p.sideNote || ""; // trusted: allows <br>
	$("#processSteps").innerHTML = (p.steps || [])
		.map(
			(s, i) => `
		<li class="process__step">
			<span class="process__num">${String(i + 1).padStart(2, "0")}</span>
			<h3>${esc(s.name)}</h3>
			<p>${esc(s.text)}</p>
		</li>`,
		)
		.join("");
	$("#processTools").innerHTML = (p.tools || []).map(chip).join("");
}

function renderEducation() {
	const el = $("#educationTimeline");
	if (!el) return;
	if (!SITE.education?.length) return hideSection("qualification");
	el.innerHTML = SITE.education
		.map(
			(e) => `
		<div class="timeline-container" data-reveal>
			<div class="content">
				<div class="timeline-header">
					<h3 class="timeline-title">${e.logo ? `<img src="${esc(e.logo)}" alt="">` : ""}${esc(e.school)}</h3>
					<span class="timeline-date">${esc(e.dates)}</span>
				</div>
				<p class="timeline-footer">${esc(e.location)}</p>
				<h4 class="timeline-position">${esc(e.degree)}</h4>
				${(e.notes || []).map((n) => `<p class="timeline-note">${esc(n)}</p>`).join("")}
			</div>
		</div>`,
		)
		.join("");
}

const flipArrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" aria-hidden="true"><path d="M3 12h16"/><path d="M13 6l6 6-6 6"/></svg>`;

function jobFace(job, side, data, hasBack) {
	return `
		<div class="job-face job-face--${side}" ${side === "back" ? 'aria-hidden="true" inert' : ""}>
			<div class="job-head">
				<h3 class="job-title">${esc(job.title)} <span class="job-title__at">@ ${esc(job.company)}</span></h3>
				${hasBack ? `<button type="button" class="job-flip__btn" aria-label="Show the other side of this role">${flipArrow}</button>` : ""}
			</div>
			<p class="job-dates">${esc(job.dates)}</p>
			<ul class="job-metrics">${(data.metrics || []).map((m) => `<li class="job-metric">${esc(m)}</li>`).join("")}</ul>
			<ul class="job-description">${(data.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
		</div>`;
}

function renderExperience() {
	const list = $("#companyList");
	const details = $("#jobDetails");
	if (!list || !details) return;
	if (!SITE.experience?.length) return hideSection("experience");
	list.innerHTML = SITE.experience
		.map(
			(j, i) =>
				`<button class="company-tab${i === 0 ? " active" : ""}" data-company="${esc(j.id)}">${esc(j.company)}<span class="company-tab__role">${esc(j.tabRole)}</span></button>`,
		)
		.join("");
	details.innerHTML = SITE.experience
		.map(
			(j, i) => `
		<div class="job-content${i === 0 ? " active" : ""}" id="job-${esc(j.id)}">
			<div class="job-flip">
				${jobFace(j, "front", j, !!j.back)}
				${j.back ? jobFace(j, "back", j.back, true) : ""}
			</div>
		</div>`,
		)
		.join("");
}

function renderBuilding() {
	const el = $("#buildingCard");
	if (!el) return;
	const b = SITE.building;
	if (!b) return hideSection("building");
	const notes = b.notes || [];
	el.innerHTML = `
		<div class="building__card">
			<div class="building__grid">
				<div class="building__media">
					<img class="building__frame" src="${esc(b.image)}" alt="${esc(b.imageAlt)}" loading="lazy">
					${notes.length ? `<div class="building__notes" id="building-notes" aria-hidden="true">${notes.map((n) => `<figure class="building__note"><img src="${esc(n.src)}" alt="" loading="lazy"><figcaption>${esc(n.caption)}</figcaption></figure>`).join("")}</div>` : ""}
				</div>
				<div class="building__body">
					<span class="building__live"><i></i> ${esc(b.status)}</span>
					<h3 class="building__name">${esc(b.name)}</h3>
					<p class="building__pitch">${esc(b.pitch)}</p>
					${notes.length ? `<div class="building__demo-controls"><span class="building__demo-label">see it</span><button type="button" data-notes="building-notes" aria-pressed="false" aria-controls="building-notes">screens</button></div>` : ""}
					<div class="building__tech">${(b.tech || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
					<div class="building__actions">
						<div class="stack-btn-wrapper stack-btn-wrapper--dark">
							<div class="stack-btn__shadow-back"></div><div class="stack-btn__shadow-mid"></div>
							<a href="${esc(b.liveUrl)}" target="_blank" rel="noopener" class="stack-btn stack-btn--dark">${esc(b.liveLabel)}</a>
						</div>
						${b.sourceUrl ? `<a href="${esc(b.sourceUrl)}" target="_blank" rel="noopener" class="text-link">view source</a>` : ""}
					</div>
				</div>
			</div>
		</div>`;
}

function renderProjects() {
	const el = $("#projectsGrid");
	if (!el) return;
	const projects = SITE.projects || [];
	if (!projects.length) {
		el.innerHTML = `<div class="project-card project-card--placeholder">
			<p>[PROJECTS_PLACEHOLDER]<br>Add entries to <code>SITE.projects</code> in assets/js/config.js</p></div>`;
		return;
	}
	el.innerHTML = projects
		.map(
			(p, i) => `
		<a href="${esc(p.url || "#")}" class="project-card" data-project="${i}" data-cursor="view project" data-reveal>
			<div class="project-card__thumbnail">
				<span class="project-card__tag">${esc(p.tag)}</span>
				<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">
			</div>
			<div class="project-card__body">
				<h3 class="project-card__title">${esc(p.title)}</h3>
				<p class="project-card__desc">${esc(p.description)}</p>
			</div>
		</a>`,
		)
		.join("");
}

function renderArchive() {
	const body = $("#archiveBody");
	if (!body) return;
	const rows = SITE.archive || [];
	body.innerHTML = rows.length
		? rows
				.map(
					(r) => `<tr>
				<td class="archive__year">${esc(r.year)}</td>
				<td class="archive__title">${esc(r.title)}</td>
				<td class="archive__hide-sm">${esc(r.madeAt)}</td>
				<td class="archive__hide-sm"><ul class="chips">${(r.tech || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul></td>
				<td>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="Open"><i class="bx bx-link-external"></i></a>` : ""}</td>
			</tr>`,
				)
				.join("")
		: `<tr><td colspan="5">[ARCHIVE_PLACEHOLDER] — add rows to <code>SITE.archive</code> in assets/js/config.js</td></tr>`;
}

renderHero();
renderAbout();
renderStack();
renderProcess();
renderEducation();
renderExperience();
renderBuilding();
renderProjects();
renderArchive();

const yearEl = $("#currentYear");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/*=============== LENIS SMOOTH SCROLL ===============*/
let lenis = null;
if (window.Lenis && !REDUCED_MOTION) {
	lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
	requestAnimationFrame(function raf(t) {
		lenis.raf(t);
		requestAnimationFrame(raf);
	});
}
function scrollToTarget(target) {
	if (lenis) lenis.scrollTo(target, { offset: 0 });
	else (typeof target === "string" ? $(target) : target)?.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth" });
}
$$('a[href^="#"]').forEach((a) =>
	a.addEventListener("click", (e) => {
		const id = a.getAttribute("href");
		if (id.length < 2 || !$(id)) return;
		e.preventDefault();
		closeNav();
		// The sticky footer always reads top=0, so "contact" means the end of the page.
		scrollToTarget(id === "#contact" ? document.body.scrollHeight : id);
	}),
);

/*=============== LOADING SCREEN ===============*/
// Logo draws in, counter runs to 90 while drawing, holds until fonts are ready,
// finishes, then the logo flies into its spot in the nav.
(function loader() {
	const screen = $("#loading-screen");
	const header = $("#header");
	const done = () => {
		document.body.classList.add("is-loaded");
		header?.classList.remove("header--pre-reveal");
		document.dispatchEvent(new CustomEvent("loadingComplete"));
	};
	if (!screen) return done();
	if (REDUCED_MOTION || sessionStorage.getItem("intro-seen") === "1") {
		screen.remove();
		return done();
	}
	sessionStorage.setItem("intro-seen", "1");

	const navSvg = $(".nav__logo-svg", header);
	const logo = $(".loading__logo", screen);
	logo.appendChild(navSvg.cloneNode(true));
	const pct = $("#loading-pct");
	const fill = $("#loading-fill");
	const DRAW_MS = 1400, FINISH_MS = 700;
	const ease = (t) => 1 - Math.pow(1 - t, 4);
	let ready = false, t90 = 0;
	const t0 = performance.now();
	document.fonts.ready.then(() => (ready = true));
	lenis?.stop();

	requestAnimationFrame(function tick(now) {
		const t = Math.min((now - t0) / DRAW_MS, 1);
		if (t === 1 && ready && !t90) t90 = now;
		const t2 = t90 ? Math.min((now - t90) / FINISH_MS, 1) : 0;
		const v = Math.round(90 * ease(t) + 10 * ease(t2));
		pct.textContent = `${v}%`;
		fill.style.width = `${v}%`;
		if (t2 < 1) requestAnimationFrame(tick);
		else setTimeout(fly, 250);
	});

	function fly() {
		const from = logo.getBoundingClientRect();
		const to = navSvg.getBoundingClientRect();
		const dx = to.left + to.width / 2 - (from.left + from.width / 2);
		const dy = to.top + to.height / 2 - (from.top + from.height / 2);
		logo.style.transform = `translate(${dx}px, ${dy}px) scale(${to.width / from.width})`;
		screen.classList.add("loading--exit");
		setTimeout(() => {
			done();
			lenis?.start();
			screen.style.opacity = "0";
			setTimeout(() => screen.remove(), 600);
		}, 800);
	}
})();

/*=============== NAV OVERLAY ===============*/
const navOverlay = $("#navOverlay");
function openNav() {
	if (!navOverlay) return;
	document.body.classList.add("nav-open");
	navOverlay.inert = false;
	lenis?.stop();
}
function closeNav() {
	if (!navOverlay || !document.body.classList.contains("nav-open")) return;
	document.body.classList.remove("nav-open");
	navOverlay.inert = true;
	lenis?.start();
}
$("#navMenuBtn")?.addEventListener("click", openNav);
$("#navClose")?.addEventListener("click", closeNav);
$("#navBackdrop")?.addEventListener("click", closeNav);
document.addEventListener("keydown", (e) => e.key === "Escape" && (closeNav(), closeDrawer()));

/*=============== HEADER: HIDE ON SCROLL + MATCH SECTION COLOUR ===============*/
const header = $("#header");
const progress = $("#scroll-progress");
const colorSections = $$("[data-header-color]");

function contrastInk(hex) {
	const n = parseInt(hex.replace("#", ""), 16);
	const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
	return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#000000" : "#ffffff";
}
// Natural document top: the sticky footer's rect.top is always 0, so sum offsets instead.
function docTop(el) {
	if (el.id === "contact") return document.documentElement.scrollHeight - el.offsetHeight;
	let y = 0;
	for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
	return y;
}

let lastY = window.scrollY;
function onScroll() {
	const y = window.scrollY;
	const max = document.documentElement.scrollHeight - innerHeight;
	if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

	if (header && !document.body.classList.contains("nav-open")) {
		header.classList.toggle("header--hidden", y > lastY && y > 200);
	}
	lastY = y;

	if (header && colorSections.length) {
		const probe = y + 40;
		let active = colorSections[0];
		for (const s of colorSections) if (!s.hidden && docTop(s) <= probe) active = s;
		const bg = active.dataset.headerColor;
		header.style.setProperty("--header-bg", bg);
		header.style.setProperty("--header-ink", contrastInk(bg));
		const accent = getComputedStyle(active).getPropertyValue("--accent").trim();
		if (accent && progress) progress.style.setProperty("--header-accent", accent);
	}

	// Footer parallax: 0 → 1 as the footer rises into view.
	const contact = $("#contact");
	if (contact) {
		const start = docTop(contact) - innerHeight;
		const r = Math.min(Math.max((y - start) / innerHeight, 0), 1);
		contact.style.setProperty("--footer-reveal", r.toFixed(3));
	}
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();

/*=============== SCROLL REVEAL ===============*/
function startReveals() {
	const io = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				e.target.classList.add("is-visible");
				io.unobserve(e.target);
			}),
		{ threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
	);
	$$("[data-reveal], .section__title").forEach((el) => io.observe(el));
}
// The loader may already have finished (intro skipped on repeat visits), so check before listening.
if (document.body.classList.contains("is-loaded")) startReveals();
else document.addEventListener("loadingComplete", startReveals, { once: true });

/*=============== EXPERIENCE TABS + NOTE FLIP ===============*/
(function experience() {
	const list = $("#companyList");
	if (!list) return;
	const tabs = $$(".company-tab", list);
	function moveBar(tab) {
		list.style.setProperty("--tab-x", `${tab.offsetLeft}px`);
		list.style.setProperty("--tab-w", `${tab.offsetWidth}px`);
		list.style.setProperty("--tab-y", `${tab.offsetTop}px`);
		list.style.setProperty("--tab-h", `${tab.offsetHeight}px`);
	}
	tabs.forEach((tab) =>
		tab.addEventListener("click", () => {
			tabs.forEach((t) => t.classList.remove("active"));
			$$(".job-content").forEach((c) => c.classList.remove("active"));
			tab.classList.add("active");
			$(`#job-${CSS.escape(tab.dataset.company)}`)?.classList.add("active");
			moveBar(tab);
		}),
	);
	if (tabs[0]) requestAnimationFrame(() => moveBar(tabs[0]));
	addEventListener("resize", () => moveBar($(".company-tab.active", list) || tabs[0]));

	$$(".job-flip").forEach((flip) => {
		const [front, back] = $$(".job-face", flip);
		if (!back) return;
		$$(".job-flip__btn", flip).forEach((btn) =>
			btn.addEventListener("click", () => {
				const flipped = flip.classList.toggle("is-flipped");
				front.inert = flipped;
				front.setAttribute("aria-hidden", String(flipped));
				back.inert = !flipped;
				back.setAttribute("aria-hidden", String(!flipped));
			}),
		);
	});
})();

/*=============== BUILDING NOTES ===============*/
// Screens fan out once the card has been on screen for 5s, unless the button got there first.
$$("[data-notes]").forEach((button) => {
	const notes = document.getElementById(button.dataset.notes);
	if (!notes) return;
	let timer;
	const set = (open) => {
		button.setAttribute("aria-pressed", String(open));
		notes.setAttribute("aria-hidden", String(!open));
	};
	const seen = new IntersectionObserver(([entry]) => {
		clearTimeout(timer);
		if (entry.isIntersecting)
			timer = setTimeout(() => {
				seen.disconnect();
				set(true);
			}, 5000);
	}, { threshold: 0.6 });
	seen.observe(notes.parentElement);
	button.addEventListener("click", () => {
		seen.disconnect();
		clearTimeout(timer);
		set(button.getAttribute("aria-pressed") !== "true");
	});
});

/*=============== PROJECT DRAWER ===============*/
const drawer = $("#project-drawer");
let galleryTimer;
function closeDrawer() {
	if (!drawer?.classList.contains("is-open")) return;
	drawer.classList.remove("is-open");
	drawer.setAttribute("aria-hidden", "true");
	clearInterval(galleryTimer);
	lenis?.start();
}
function openDrawer(p) {
	$("#drawerTag").textContent = p.tag || "";
	$("#drawerTitle").textContent = p.title || "";
	$("#drawerYear").textContent = p.year || "";
	$("#drawerDesc").textContent = p.description || "";
	$("#drawerTech").innerHTML = String(p.tech || "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)
		.map((t) => `<li>${esc(t)}</li>`)
		.join("");
	$("#drawerLink").href = p.url || "#";
	$("#drawerGithubWrapper").hidden = !p.github;
	if (p.github) $("#drawerGithub").href = p.github;

	const images = p.images?.length ? p.images : [p.image];
	const img = $("#drawerImg");
	const thumbs = $("#drawerThumbs");
	const show = (i) => {
		img.src = images[i];
		img.alt = p.title || "";
		$$("button", thumbs).forEach((b, j) => b.classList.toggle("active", i === j));
	};
	thumbs.hidden = images.length < 2;
	thumbs.innerHTML = images.map((src) => `<button type="button"><img src="${esc(src)}" alt=""></button>`).join("");
	let current = 0;
	$$("button", thumbs).forEach((b, i) => b.addEventListener("click", () => { clearInterval(galleryTimer); show((current = i)); }));
	show(0);
	clearInterval(galleryTimer);
	if (images.length > 1) galleryTimer = setInterval(() => show((current = (current + 1) % images.length)), 4000);

	drawer.classList.add("is-open");
	drawer.setAttribute("aria-hidden", "false");
	lenis?.stop();
}
$$("[data-project]").forEach((card) =>
	card.addEventListener("click", (e) => {
		if (e.metaKey || e.ctrlKey) return; // let modifier-clicks open the link
		e.preventDefault();
		openDrawer(SITE.projects[Number(card.dataset.project)]);
	}),
);
$("#drawerBackdrop")?.addEventListener("click", closeDrawer);
$("#drawerClose")?.addEventListener("click", closeDrawer);

/*=============== GITHUB STATS & REPOS ===============*/
(async function github() {
	const statsEl = $("#githubStats");
	const reposEl = $("#githubRepos");
	if (!statsEl || !reposEl) return;
	const user = SITE.githubUsername;
	if (!user) {
		statsEl.innerHTML = `<p class="github__error">[GITHUB_PLACEHOLDER] — set <code>SITE.githubUsername</code> in assets/js/config.js to load live stats.</p>`;
		return;
	}
	const CACHE_KEY = `gh-cache-${user}`;
	try {
		let data = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
		if (!data) {
			const [profile, repos] = await Promise.all([
				fetch(`https://api.github.com/users/${encodeURIComponent(user)}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
				fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=100&type=public`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
			]);
			data = { profile, repos };
			sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
		}
		const { profile, repos } = data;
		const own = repos.filter((r) => !r.fork);
		const stars = own.reduce((n, r) => n + r.stargazers_count, 0);
		const langs = new Set(own.map((r) => r.language).filter(Boolean));
		const stats = [
			[profile.public_repos, "public repos"],
			[stars, "stars earned"],
			[langs.size, "languages"],
			[profile.followers, "followers"],
		];
		statsEl.innerHTML = stats
			.map(([v, l]) => `<div class="gh-stat"><div class="gh-stat__value">${esc(v)}</div><div class="gh-stat__label">${esc(l)}</div></div>`)
			.join("");
		reposEl.innerHTML = own
			.slice(0, 6)
			.map(
				(r) => `
			<a class="gh-repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
				<div class="gh-repo__name"><i class="bx bx-book-bookmark"></i> ${esc(r.name)}</div>
				<p class="gh-repo__desc">${esc(r.description || "No description")}</p>
				<div class="gh-repo__meta">
					${r.language ? `<span>${esc(r.language)}</span>` : ""}
					<span><i class="bx bx-star"></i> ${r.stargazers_count}</span>
					<span>updated ${new Date(r.pushed_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
				</div>
			</a>`,
			)
			.join("");
	} catch {
		statsEl.innerHTML = `<p class="github__error">Couldn't load GitHub data right now — <a href="${esc(SITE.links?.github || "#")}" target="_blank" rel="noopener">view my profile</a>.</p>`;
	}
})();

/*=============== CURSOR TAG ===============*/
// A small label follows the cursor over elements with data-cursor, coloured per section.
(function cursorTag() {
	if (matchMedia("(hover: none)").matches) return;
	const tag = document.createElement("div");
	tag.className = "cursor-tag";
	document.body.appendChild(tag);
	addEventListener("pointermove", (e) => {
		const host = e.target.closest?.("[data-cursor]");
		tag.classList.toggle("is-visible", !!host);
		if (!host) return;
		tag.textContent = host.dataset.cursor;
		const section = host.closest(".section") || document.body;
		const bg = getComputedStyle(section).getPropertyValue("--cursor-tag").trim() || "#000";
		tag.style.setProperty("--tag-bg", bg);
		tag.style.setProperty("--tag-ink", contrastInk(bg.length === 7 ? bg : "#000000"));
		tag.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`;
	});
})();

/*=============== AGENTS.MD COPY (agents-md.html) ===============*/
$("#mdCopy")?.addEventListener("click", async (e) => {
	try {
		await navigator.clipboard.writeText($("#mdCode").textContent);
		e.currentTarget.textContent = "copied";
	} catch {
		e.currentTarget.textContent = "select & copy manually";
	}
});
