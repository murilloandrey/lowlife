globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-08T02:54:21.884Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/gallery-1-D0clbUZY.jpg": {
		"type": "image/jpeg",
		"etag": "\"216d1-4mRm/RizGGxjUDBIlRgix9Ew01o\"",
		"mtime": "2026-07-08T02:54:20.517Z",
		"size": 136913,
		"path": "../public/assets/gallery-1-D0clbUZY.jpg"
	},
	"/assets/gallery-3-BwR20rUX.jpg": {
		"type": "image/jpeg",
		"etag": "\"1abcf-v8O4kpr6rEplwY8eMzHIiLjYQVc\"",
		"mtime": "2026-07-08T02:54:20.517Z",
		"size": 109519,
		"path": "../public/assets/gallery-3-BwR20rUX.jpg"
	},
	"/assets/gallery-4-CYqzpJvB.jpg": {
		"type": "image/jpeg",
		"etag": "\"12865-V6DVljI1/U7LviFtqdw3SQbxD3A\"",
		"mtime": "2026-07-08T02:54:20.517Z",
		"size": 75877,
		"path": "../public/assets/gallery-4-CYqzpJvB.jpg"
	},
	"/assets/gallery-5-BqIWFAY6.jpg": {
		"type": "image/jpeg",
		"etag": "\"15aa5-dKrwZU0zrcvO3HsANbp6E/gfMvI\"",
		"mtime": "2026-07-08T02:54:20.517Z",
		"size": 88741,
		"path": "../public/assets/gallery-5-BqIWFAY6.jpg"
	},
	"/assets/gallery-7-DRzRAcx9.jpg": {
		"type": "image/jpeg",
		"etag": "\"1024c-RUHH22HWVK4U4rr31BxpBWnl50w\"",
		"mtime": "2026-07-08T02:54:20.518Z",
		"size": 66124,
		"path": "../public/assets/gallery-7-DRzRAcx9.jpg"
	},
	"/assets/gallery-6-DCK0D4cy.jpg": {
		"type": "image/jpeg",
		"etag": "\"12e37-CY/m6Ha87WfIbyMU9mfigHAmRAs\"",
		"mtime": "2026-07-08T02:54:20.517Z",
		"size": 77367,
		"path": "../public/assets/gallery-6-DCK0D4cy.jpg"
	},
	"/assets/gallery-8-CBHuT_qm.jpg": {
		"type": "image/jpeg",
		"etag": "\"139ba-RDimqT9xXzZjRLHU+n3L6fY8PWM\"",
		"mtime": "2026-07-08T02:54:20.518Z",
		"size": 80314,
		"path": "../public/assets/gallery-8-CBHuT_qm.jpg"
	},
	"/assets/hero-meet-DZOAcs33.jpg": {
		"type": "image/jpeg",
		"etag": "\"2457a-tGFztTpluW+SHeKOT0bgLPoAhb4\"",
		"mtime": "2026-07-08T02:54:20.521Z",
		"size": 148858,
		"path": "../public/assets/hero-meet-DZOAcs33.jpg"
	},
	"/assets/index-oDbevfPk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54405-k1hq1TUiCIoNCsDDLtBDSwnJGHg\"",
		"mtime": "2026-07-08T02:54:20.516Z",
		"size": 345093,
		"path": "../public/assets/index-oDbevfPk.js"
	},
	"/assets/product-anime-CvIm3R79.jpg": {
		"type": "image/jpeg",
		"etag": "\"82d0-gmYBcoHD5670xpNs1DwccVZ3Sic\"",
		"mtime": "2026-07-08T02:54:20.521Z",
		"size": 33488,
		"path": "../public/assets/product-anime-CvIm3R79.jpg"
	},
	"/assets/product-banner-DgfzVdMF.jpg": {
		"type": "image/jpeg",
		"etag": "\"7bb6-dhyB5w18xCVLOIRQsIg1zffYsI4\"",
		"mtime": "2026-07-08T02:54:20.521Z",
		"size": 31670,
		"path": "../public/assets/product-banner-DgfzVdMF.jpg"
	},
	"/assets/lowlife-logo-DnQNEguo.png": {
		"type": "image/png",
		"etag": "\"40d3b-bcsWvp1rnqqHzEGlSDf03d8cst0\"",
		"mtime": "2026-07-08T02:54:20.521Z",
		"size": 265531,
		"path": "../public/assets/lowlife-logo-DnQNEguo.png"
	},
	"/assets/product-jersey-DWrd4ZC5.jpg": {
		"type": "image/jpeg",
		"etag": "\"842f-gX8sXvQbIj4qo7NZFwvtosCoTe4\"",
		"mtime": "2026-07-08T02:54:20.521Z",
		"size": 33839,
		"path": "../public/assets/product-jersey-DWrd4ZC5.jpg"
	},
	"/assets/product-plate-BsA6rtOH.jpg": {
		"type": "image/jpeg",
		"etag": "\"945a-ckW4xG7YSbeGO9Q0xrAbGbK0y6g\"",
		"mtime": "2026-07-08T02:54:20.521Z",
		"size": 37978,
		"path": "../public/assets/product-plate-BsA6rtOH.jpg"
	},
	"/assets/product-stickers-C1wxCyTC.jpg": {
		"type": "image/jpeg",
		"etag": "\"51c9d-GcwKxd1K2uoeHn9kXdYXdbtxR9s\"",
		"mtime": "2026-07-08T02:54:20.522Z",
		"size": 335005,
		"path": "../public/assets/product-stickers-C1wxCyTC.jpg"
	},
	"/assets/product-tee-mE6MRSkW.jpg": {
		"type": "image/jpeg",
		"etag": "\"14408-v7HEz3/ZTa8j95Kau8MFJ55kZ14\"",
		"mtime": "2026-07-08T02:54:20.522Z",
		"size": 82952,
		"path": "../public/assets/product-tee-mE6MRSkW.jpg"
	},
	"/assets/routes-DgIaJcqb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"602d-nCNjwMMZ5bqvXVQKyaHeyXLV428\"",
		"mtime": "2026-07-08T02:54:20.517Z",
		"size": 24621,
		"path": "../public/assets/routes-DgIaJcqb.js"
	},
	"/assets/styles-Bn5oiNrL.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14b13-hKwaxyP2yuHXhhcBUtAkP0L+nWg\"",
		"mtime": "2026-07-08T02:54:20.522Z",
		"size": 84755,
		"path": "../public/assets/styles-Bn5oiNrL.css"
	},
	"/assets/gallery-2-BDLNCXTB.jpg": {
		"type": "image/jpeg",
		"etag": "\"6250-YbTnVjlbDev13uZVNEyuOtvC+bY\"",
		"mtime": "2026-07-08T02:54:20.517Z",
		"size": 25168,
		"path": "../public/assets/gallery-2-BDLNCXTB.jpg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_p4PyRL = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_p4PyRL
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
