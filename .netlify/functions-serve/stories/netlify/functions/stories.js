var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseCookie = parseCookie;
    exports2.parse = parseCookie;
    exports2.stringifyCookie = stringifyCookie;
    exports2.stringifySetCookie = stringifySetCookie;
    exports2.serialize = stringifySetCookie;
    exports2.parseSetCookie = parseSetCookie;
    exports2.stringifySetCookie = stringifySetCookie;
    exports2.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie2, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie2)) {
        const val = cookie2[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie2 = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie2.name)) {
        throw new TypeError(`argument name is invalid: ${cookie2.name}`);
      }
      const value = cookie2.value ? enc(cookie2.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie2.value}`);
      }
      let str = cookie2.name + "=" + value;
      if (cookie2.maxAge !== void 0) {
        if (!Number.isInteger(cookie2.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie2.maxAge}`);
        }
        str += "; Max-Age=" + cookie2.maxAge;
      }
      if (cookie2.domain) {
        if (!domainValueRegExp.test(cookie2.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie2.domain}`);
        }
        str += "; Domain=" + cookie2.domain;
      }
      if (cookie2.path) {
        if (!pathValueRegExp.test(cookie2.path)) {
          throw new TypeError(`option path is invalid: ${cookie2.path}`);
        }
        str += "; Path=" + cookie2.path;
      }
      if (cookie2.expires) {
        if (!isDate(cookie2.expires) || !Number.isFinite(cookie2.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie2.expires}`);
        }
        str += "; Expires=" + cookie2.expires.toUTCString();
      }
      if (cookie2.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie2.secure) {
        str += "; Secure";
      }
      if (cookie2.partitioned) {
        str += "; Partitioned";
      }
      if (cookie2.priority) {
        const priority = typeof cookie2.priority === "string" ? cookie2.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie2.priority}`);
        }
      }
      if (cookie2.sameSite) {
        const sameSite = typeof cookie2.sameSite === "string" ? cookie2.sameSite.toLowerCase() : cookie2.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie2.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// netlify/functions/stories.js
var stories_exports = {};
__export(stories_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(stories_exports);

// node_modules/storyblok-js-client/dist/index.mjs
var isCDNUrl = (url = "") => url.includes("/cdn/");
var getOptionsPage = (options, perPage = 25, page = 1) => ({
  ...options,
  per_page: perPage,
  page
});
var delay = (ms) => new Promise((res) => setTimeout(res, ms));
var arrayFrom = (length = 0, func) => Array.from({ length }, func);
var range = (start = 0, end = start) => {
  const length = Math.abs(end - start) || 0;
  const step = start < end ? 1 : -1;
  return arrayFrom(length, (_, i) => i * step + start);
};
var asyncMap = async (arr, func) => Promise.all(arr.map(func));
var flatMap = (arr = [], func) => arr.map(func).reduce((xs, ys) => [...xs, ...ys], []);
var decodeIfEncoded = (value) => {
  if (/%[0-9A-F]{2}/i.test(value)) try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
  return value;
};
var stringify = (params, prefix, isArray) => {
  const pairs = [];
  for (const key in params) {
    if (!Object.prototype.hasOwnProperty.call(params, key)) continue;
    const value = params[key];
    if (value === null || value === void 0) continue;
    const enkey = isArray ? "" : encodeURIComponent(key);
    let pair;
    if (typeof value === "object") pair = stringify(value, prefix ? prefix + encodeURIComponent(`[${enkey}]`) : enkey, Array.isArray(value));
    else pair = `${prefix ? prefix + encodeURIComponent(`[${enkey}]`) : enkey}=${encodeURIComponent(value)}`;
    pairs.push(pair);
  }
  return pairs.join("&");
};
var getRegionURL = (regionCode) => {
  const REGION_URLS = {
    eu: "api.storyblok.com",
    us: "api-us.storyblok.com",
    cn: "app.storyblokchina.cn",
    ap: "api-ap.storyblok.com",
    ca: "api-ca.storyblok.com"
  };
  return REGION_URLS[regionCode] ?? REGION_URLS.eu;
};
var SbFetch = class {
  baseURL;
  timeout;
  headers;
  responseInterceptor;
  fetch;
  ejectInterceptor;
  url;
  parameters;
  fetchOptions;
  constructor($c) {
    this.baseURL = $c.baseURL;
    this.headers = $c.headers || new Headers();
    this.timeout = $c?.timeout ? $c.timeout * 1e3 : 0;
    this.responseInterceptor = $c.responseInterceptor;
    this.fetch = (...args) => $c.fetch ? $c.fetch(...args) : fetch(...args);
    this.ejectInterceptor = false;
    this.url = "";
    this.parameters = {};
    this.fetchOptions = {};
  }
  /**
  *
  * @param url string
  * @param params ISbStoriesParams
  * @returns Promise<ISbResponse | Error>
  */
  get(url, params) {
    this.url = url;
    this.parameters = params;
    return this._methodHandler("get");
  }
  post(url, params) {
    this.url = url;
    this.parameters = params;
    return this._methodHandler("post");
  }
  put(url, params) {
    this.url = url;
    this.parameters = params;
    return this._methodHandler("put");
  }
  patch(url, params) {
    this.url = url;
    this.parameters = params;
    return this._methodHandler("patch");
  }
  delete(url, params) {
    this.url = url;
    this.parameters = params ?? {};
    return this._methodHandler("delete");
  }
  async _responseHandler(res) {
    const headers = [];
    const response = {
      data: {},
      headers: {},
      status: 0,
      statusText: ""
    };
    if (res.status !== 204) await res.json().then(($r) => {
      response.data = $r;
    });
    for (const pair of res.headers.entries()) headers[pair[0]] = pair[1];
    response.headers = { ...headers };
    response.status = res.status;
    response.statusText = res.statusText;
    return response;
  }
  async _methodHandler(method) {
    let urlString = `${this.baseURL}${this.url}`;
    let body = null;
    if (method === "get") urlString = `${this.baseURL}${this.url}?${stringify(this.parameters)}`;
    else body = JSON.stringify(this.parameters);
    const url = new URL(urlString);
    const controller = new AbortController();
    const { signal } = controller;
    let timeout = null;
    if (this.timeout) timeout = setTimeout(() => controller.abort(), this.timeout);
    try {
      const fetchResponse = await this.fetch(`${url}`, {
        method,
        headers: this.headers,
        body,
        signal,
        ...this.fetchOptions
      });
      if (this.timeout && timeout) clearTimeout(timeout);
      const response = await this._responseHandler(fetchResponse);
      if (this.responseInterceptor && !this.ejectInterceptor) return this._statusHandler(this.responseInterceptor(response));
      else return this._statusHandler(response);
    } catch (err) {
      if (err.name === "AbortError") return { message: "Request timeout: The request was aborted due to timeout" };
      return { message: err.message || err.toString() || "An unknown error occurred" };
    }
  }
  setFetchOptions(fetchOptions = {}) {
    if (Object.keys(fetchOptions).length > 0 && "method" in fetchOptions) delete fetchOptions.method;
    this.fetchOptions = { ...fetchOptions };
  }
  eject() {
    this.ejectInterceptor = true;
  }
  /**
  * Normalizes error messages from different response structures
  * @param data The response data that might contain error information
  * @returns A normalized error message string
  */
  _normalizeErrorMessage(data) {
    if (Array.isArray(data)) return data[0] || "Unknown error";
    if (data && typeof data === "object") {
      if (data.error) return data.error;
      for (const key in data) {
        if (Array.isArray(data[key])) return `${key}: ${data[key][0]}`;
        if (typeof data[key] === "string") return `${key}: ${data[key]}`;
      }
      if (data.slug) return data.slug;
    }
    return "Unknown error";
  }
  _statusHandler(res) {
    const statusOk = /20[0-6]/g;
    return new Promise((resolve, reject) => {
      if (statusOk.test(`${res.status}`)) return resolve(res);
      reject({
        message: this._normalizeErrorMessage(res.data),
        status: res.status,
        response: res
      });
    });
  }
};
var StoryblokContentVersion = {
  DRAFT: "draft",
  PUBLISHED: "published"
};
var StoryblokContentVersionValues = Object.values(StoryblokContentVersion);
var DEFAULT_PER_PAGE = 25;
var PER_PAGE_THRESHOLDS = {
  SMALL: 25,
  MEDIUM: 50,
  LARGE: 75
};
var RATE_LIMIT_TIERS = {
  SINGLE_OR_SMALL: 50,
  MEDIUM: 15,
  LARGE: 10,
  VERY_LARGE: 6
};
var MAX_RATE_LIMIT = 1e3;
var MANAGEMENT_API_DEFAULT_RATE_LIMIT = 3;
function isSingleStoryRequest(url, params) {
  const isCdnStories = url.includes("/cdn/stories/");
  const hasSpecificPath = url.split("/").length > 3 && !url.endsWith("/cdn/stories");
  const hasFindBy = "find_by" in params;
  return isCdnStories && hasSpecificPath || hasFindBy;
}
function getRateLimitTier(perPage) {
  if (perPage <= PER_PAGE_THRESHOLDS.SMALL) return RATE_LIMIT_TIERS.SINGLE_OR_SMALL;
  else if (perPage <= PER_PAGE_THRESHOLDS.MEDIUM) return RATE_LIMIT_TIERS.MEDIUM;
  else if (perPage <= PER_PAGE_THRESHOLDS.LARGE) return RATE_LIMIT_TIERS.LARGE;
  else return RATE_LIMIT_TIERS.VERY_LARGE;
}
function determineRateLimit(url, params, config = {}, defaultRateLimit) {
  if (config.userRateLimit !== void 0) return Math.min(config.userRateLimit, MAX_RATE_LIMIT);
  if (config.serverHeadersRateLimit !== void 0) return Math.min(config.serverHeadersRateLimit, MAX_RATE_LIMIT);
  if (defaultRateLimit !== void 0) return defaultRateLimit;
  if (!url || !params) return RATE_LIMIT_TIERS.SINGLE_OR_SMALL;
  if (isSingleStoryRequest(url, params)) return RATE_LIMIT_TIERS.SINGLE_OR_SMALL;
  return getRateLimitTier(params.per_page || DEFAULT_PER_PAGE);
}
function parseRateLimitHeaders(headers) {
  if (!headers) return null;
  const rateLimitHeader = headers["x-ratelimit"] || headers["X-RateLimit"];
  const rateLimitPolicyHeader = headers["x-ratelimit-policy"] || headers["X-RateLimit-Policy"];
  if (!rateLimitHeader && !rateLimitPolicyHeader) return null;
  const result = {};
  if (rateLimitHeader) {
    const remainingMatch = rateLimitHeader.match(/r=(\d+)/);
    if (remainingMatch) result.remaining = Number.parseInt(remainingMatch[1], 10);
  }
  if (rateLimitPolicyHeader) {
    const maxMatch = rateLimitPolicyHeader.match(/q=(\d+)/);
    if (maxMatch) result.max = Number.parseInt(maxMatch[1], 10);
  }
  return Object.keys(result).length > 0 ? result : null;
}
function createRateLimitConfig(userRateLimit, isManagementApi = false) {
  return {
    userRateLimit,
    serverHeadersRateLimit: void 0,
    isManagementApi
  };
}
var AbortError = class extends Error {
  constructor(msg) {
    super(msg);
    this.name = "AbortError";
  }
};
function throttledQueue(fn, limit, interval) {
  if (!Number.isFinite(limit)) throw new TypeError("Expected `limit` to be a finite number");
  if (!Number.isFinite(interval)) throw new TypeError("Expected `interval` to be a finite number");
  const queue = [];
  let timeouts = [];
  let activeCount = 0;
  let isAborted = false;
  const next = async () => {
    activeCount++;
    const x = queue.shift();
    if (x) try {
      const res = await fn(...x.args);
      x.resolve(res);
    } catch (error) {
      x.reject(error);
    }
    const id = setTimeout(() => {
      activeCount--;
      if (queue.length > 0) next();
      timeouts = timeouts.filter((currentId) => currentId !== id);
    }, interval);
    if (!timeouts.includes(id)) timeouts.push(id);
  };
  const throttled = (...args) => {
    if (isAborted) return Promise.reject(/* @__PURE__ */ new Error("Throttled function is already aborted and not accepting new promises"));
    return new Promise((resolve, reject) => {
      queue.push({
        resolve,
        reject,
        args
      });
      if (activeCount < limit) next();
    });
  };
  throttled.abort = () => {
    isAborted = true;
    timeouts.forEach(clearTimeout);
    timeouts = [];
    queue.forEach((x) => x.reject(() => new AbortError("Throttle function aborted")));
    queue.length = 0;
  };
  return throttled;
}
var ThrottleQueueManager = class {
  queues;
  interval;
  throttledRequestFn;
  constructor(throttledRequestFn, interval = 1e3) {
    this.queues = /* @__PURE__ */ new Map();
    this.interval = interval;
    this.throttledRequestFn = throttledRequestFn;
  }
  /**
  * Gets or creates a throttle queue for the specified rate limit
  */
  getQueue(rateLimit) {
    let queue = this.queues.get(rateLimit);
    if (!queue) {
      queue = throttledQueue(this.throttledRequestFn, rateLimit, this.interval);
      this.queues.set(rateLimit, queue);
    }
    return queue;
  }
  /**
  * Executes a request through the appropriate throttle queue based on rate limit
  */
  execute(rateLimit, ...args) {
    return this.getQueue(rateLimit)(...args);
  }
  /**
  * Aborts all throttle queues
  */
  abortAll() {
    this.queues.forEach((queue) => {
      queue.abort?.();
    });
    this.queues.clear();
  }
  /**
  * Gets the number of active queues
  */
  getQueueCount() {
    return this.queues.size;
  }
};
var memory = {};
var cacheVersions = {};
var Storyblok = class {
  client;
  maxRetries;
  retriesDelay;
  throttleManager;
  accessToken;
  cache;
  resolveCounter;
  relations;
  links;
  version;
  rateLimitConfig;
  cvMode;
  /**
  * @deprecated This property is deprecated. Use the standalone `richTextResolver` from `@storyblok/richtext` instead.
  * @see https://github.com/storyblok/richtext
  */
  richTextResolver;
  resolveNestedRelations;
  stringifiedStoriesCache;
  inlineAssets;
  /**
  *
  * @param config ISbConfig interface
  * @param pEndpoint string, optional
  */
  constructor(config, pEndpoint) {
    let endpoint = config.endpoint || pEndpoint;
    if (!endpoint) {
      const protocol = config.https === false ? "http" : "https";
      if (!config.oauthToken) endpoint = `${protocol}://${getRegionURL(config.region)}/v2`;
      else endpoint = `${protocol}://${getRegionURL(config.region)}/v1`;
    }
    const headers = new Headers();
    if (!(!config.oauthToken && typeof window !== "undefined")) headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    if (config.headers) (config.headers.constructor.name === "Headers" ? config.headers.entries().toArray() : Object.entries(config.headers)).forEach(([key, value]) => {
      headers.set(key, value);
    });
    if (config.oauthToken) headers.set("Authorization", config.oauthToken);
    this.rateLimitConfig = createRateLimitConfig(config.rateLimit, !!config.oauthToken);
    this.maxRetries = config.maxRetries || 10;
    this.retriesDelay = config.retriesDelay ?? 300;
    this.throttleManager = new ThrottleQueueManager(this.throttledRequest.bind(this), 1e3);
    this.accessToken = config.accessToken || "";
    this.relations = {};
    this.links = {};
    this.cache = config.cache || { clear: "manual" };
    this.cvMode = config.cache?.cv ?? "auto";
    this.resolveCounter = 0;
    this.resolveNestedRelations = config.resolveNestedRelations || true;
    this.stringifiedStoriesCache = {};
    this.version = config.version || StoryblokContentVersion.PUBLISHED;
    this.inlineAssets = config.inlineAssets || false;
    this.client = new SbFetch({
      baseURL: endpoint,
      timeout: config.timeout || 0,
      headers,
      responseInterceptor: config.responseInterceptor,
      fetch: config.fetch
    });
  }
  parseParams(params) {
    if (!params.token) params.token = this.getToken();
    if (!params.cv && this.cvMode === "auto") params.cv = cacheVersions[params.token];
    if (Array.isArray(params.resolve_relations)) params.resolve_relations = params.resolve_relations.map(decodeIfEncoded).join(",");
    else if (typeof params.resolve_relations === "string") params.resolve_relations = decodeIfEncoded(params.resolve_relations);
    if (typeof params.resolve_relations !== "undefined") params.resolve_level = 2;
    return params;
  }
  factoryParamOptions(url, params) {
    if (isCDNUrl(url)) return this.parseParams(params);
    return params;
  }
  makeRequest(url, params, per_page, page, fetchOptions) {
    const query = this.factoryParamOptions(url, getOptionsPage(params, per_page, page));
    return this.cacheResponse(url, query, void 0, fetchOptions);
  }
  get(slug, params = {}, fetchOptions) {
    if (!params) params = {};
    const url = `/${slug}`;
    if (isCDNUrl(url)) params.version = params.version || this.version;
    const query = this.factoryParamOptions(url, params);
    return this.cacheResponse(url, query, void 0, fetchOptions);
  }
  async getAll(slug, params = {}, entity, fetchOptions) {
    const perPage = params?.per_page || 25;
    const url = `/${slug}`.replace(/\/$/, "");
    const e = entity ?? url.substring(url.lastIndexOf("/") + 1);
    params.version = params.version || this.version;
    const firstPage = 1;
    const firstRes = await this.makeRequest(url, params, perPage, firstPage, fetchOptions);
    return flatMap([firstRes, ...await asyncMap(range(firstPage, firstRes.total ? Math.ceil(firstRes.total / (firstRes.perPage || perPage)) : 1), (i) => {
      return this.makeRequest(url, params, perPage, i + 1, fetchOptions);
    })], (res) => Object.values(res.data[e]));
  }
  post(slug, params = {}, fetchOptions) {
    const url = `/${slug}`;
    const rateLimit = determineRateLimit(void 0, void 0, this.rateLimitConfig, MANAGEMENT_API_DEFAULT_RATE_LIMIT);
    return this.throttleManager.execute(rateLimit, "post", url, params, fetchOptions);
  }
  put(slug, params = {}, fetchOptions) {
    const url = `/${slug}`;
    const rateLimit = determineRateLimit(void 0, void 0, this.rateLimitConfig, MANAGEMENT_API_DEFAULT_RATE_LIMIT);
    return this.throttleManager.execute(rateLimit, "put", url, params, fetchOptions);
  }
  patch(slug, params = {}, fetchOptions) {
    const url = `/${slug}`;
    const rateLimit = determineRateLimit(void 0, void 0, this.rateLimitConfig, MANAGEMENT_API_DEFAULT_RATE_LIMIT);
    return this.throttleManager.execute(rateLimit, "patch", url, params, fetchOptions);
  }
  delete(slug, params = {}, fetchOptions) {
    if (!params) params = {};
    const url = `/${slug}`;
    const rateLimit = determineRateLimit(void 0, void 0, this.rateLimitConfig, MANAGEMENT_API_DEFAULT_RATE_LIMIT);
    return this.throttleManager.execute(rateLimit, "delete", url, params, fetchOptions);
  }
  getStories(params = {}, fetchOptions) {
    this._addResolveLevel(params);
    return this.get("cdn/stories", params, fetchOptions);
  }
  getStory(slug, params = {}, fetchOptions) {
    this._addResolveLevel(params);
    return this.get(`cdn/stories/${slug}`, params, fetchOptions);
  }
  getToken() {
    return this.accessToken;
  }
  ejectInterceptor() {
    this.client.eject();
  }
  _addResolveLevel(params) {
    if (typeof params.resolve_relations !== "undefined") params.resolve_level = 2;
  }
  _cleanCopy(value) {
    return JSON.parse(JSON.stringify(value));
  }
  _insertLinks(jtree, treeItem, resolveId) {
    const node = jtree[treeItem];
    if (node && node.fieldtype === "multilink" && node.linktype === "story" && typeof node.id === "string" && this.links[resolveId][node.id]) node.story = this._cleanCopy(this.links[resolveId][node.id]);
    else if (node && node.linktype === "story" && typeof node.uuid === "string" && this.links[resolveId][node.uuid]) node.story = this._cleanCopy(this.links[resolveId][node.uuid]);
  }
  /**
  *
  * @param resolveId A counter number as a string
  * @param uuid The uuid of the story
  * @returns string | object
  */
  getStoryReference(resolveId, uuid) {
    return this.relations[resolveId][uuid] ? JSON.parse(this.stringifiedStoriesCache[uuid] || JSON.stringify(this.relations[resolveId][uuid])) : uuid;
  }
  /**
  * Resolves a field's value by replacing UUIDs with their corresponding story references
  * @param jtree - The JSON tree object containing the field to resolve
  * @param treeItem - The key of the field to resolve
  * @param resolveId - The unique identifier for the current resolution context
  *
  * This method handles both single string UUIDs and arrays of UUIDs:
  * - For single strings: directly replaces the UUID with the story reference
  * - For arrays: maps through each UUID and replaces with corresponding story references
  */
  _resolveField(jtree, treeItem, resolveId) {
    const item = jtree[treeItem];
    if (typeof item === "string") jtree[treeItem] = this.getStoryReference(resolveId, item);
    else if (Array.isArray(item)) jtree[treeItem] = item.map((uuid) => this.getStoryReference(resolveId, uuid)).filter(Boolean);
  }
  /**
  * Inserts relations into the JSON tree by resolving references
  * @param jtree - The JSON tree object to process
  * @param treeItem - The current field being processed
  * @param fields - The relation patterns to resolve (string or array of strings)
  * @param resolveId - The unique identifier for the current resolution context
  *
  * This method handles two types of relation patterns:
  * 1. Nested relations: matches fields that end with the current field name
  *    Example: If treeItem is "event_type", it matches patterns like "*.event_type"
  *
  * 2. Direct component relations: matches exact component.field patterns
  *    Example: "event.event_type" for component "event" and field "event_type"
  *
  * The method supports both string and array formats for the fields parameter,
  * allowing flexible specification of relation patterns.
  */
  _insertRelations(jtree, treeItem, fields, resolveId) {
    if (Array.isArray(fields) ? fields.find((f) => f.endsWith(`.${treeItem}`)) : fields.endsWith(`.${treeItem}`)) {
      this._resolveField(jtree, treeItem, resolveId);
      return;
    }
    const fieldPath = jtree.component ? `${jtree.component}.${treeItem}` : treeItem;
    if (Array.isArray(fields) ? fields.includes(fieldPath) : fields === fieldPath) this._resolveField(jtree, treeItem, resolveId);
  }
  /**
  * Recursively traverses and resolves relations in the story content tree
  * @param story - The story object containing the content to process
  * @param fields - The relation patterns to resolve
  * @param resolveId - The unique identifier for the current resolution context
  */
  iterateTree(story, fields, resolveId) {
    const enrich = (jtree, path = "") => {
      if (!jtree || jtree._stopResolving) return;
      if (Array.isArray(jtree)) jtree.forEach((item, index) => enrich(item, `${path}[${index}]`));
      else if (typeof jtree === "object") for (const key in jtree) {
        const newPath = path ? `${path}.${key}` : key;
        if (jtree.component && jtree._uid || jtree.type === "link") {
          this._insertRelations(jtree, key, fields, resolveId);
          this._insertLinks(jtree, key, resolveId);
        }
        enrich(jtree[key], newPath);
      }
    };
    enrich(story.content);
  }
  async resolveLinks(responseData, params, resolveId) {
    let links = [];
    if (responseData.link_uuids) {
      const relSize = responseData.link_uuids.length;
      const chunks = [];
      const chunkSize = 50;
      for (let i = 0; i < relSize; i += chunkSize) {
        const end = Math.min(relSize, i + chunkSize);
        chunks.push(responseData.link_uuids.slice(i, end));
      }
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) (await this.getStories({
        per_page: chunkSize,
        language: params.language,
        version: params.version,
        starts_with: params.starts_with,
        by_uuids: chunks[chunkIndex].join(",")
      })).data.stories.forEach((rel) => {
        links.push(rel);
      });
    } else links = responseData.links;
    links.forEach((story) => {
      this.links[resolveId][story.uuid] = {
        ...story,
        _stopResolving: true
      };
    });
  }
  async resolveRelations(responseData, params, resolveId) {
    let relations = [];
    if (responseData.rel_uuids) {
      const relSize = responseData.rel_uuids.length;
      const chunks = [];
      const chunkSize = 50;
      for (let i = 0; i < relSize; i += chunkSize) {
        const end = Math.min(relSize, i + chunkSize);
        chunks.push(responseData.rel_uuids.slice(i, end));
      }
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) (await this.getStories({
        per_page: chunkSize,
        language: params.language,
        version: params.version,
        starts_with: params.starts_with,
        by_uuids: chunks[chunkIndex].join(","),
        excluding_fields: params.excluding_fields
      })).data.stories.forEach((rel) => {
        relations.push(rel);
      });
      if (relations.length > 0) {
        responseData.rels = relations;
        delete responseData.rel_uuids;
      }
    } else relations = responseData.rels;
    if (relations && relations.length > 0) relations.forEach((story) => {
      this.relations[resolveId][story.uuid] = {
        ...story,
        _stopResolving: true
      };
    });
  }
  /**
  *
  * @param responseData
  * @param params
  * @param resolveId
  * @description Resolves the relations and links of the stories
  * @returns Promise<void>
  *
  */
  async resolveStories(responseData, params, resolveId) {
    let relationParams = [];
    this.links[resolveId] = {};
    this.relations[resolveId] = {};
    if (typeof params.resolve_relations !== "undefined" && params.resolve_relations.length > 0) {
      if (typeof params.resolve_relations === "string") relationParams = params.resolve_relations.split(",");
      await this.resolveRelations(responseData, params, resolveId);
    }
    if (params.resolve_links && [
      "1",
      "story",
      "url",
      "link"
    ].includes(params.resolve_links) && (responseData.links?.length || responseData.link_uuids?.length)) await this.resolveLinks(responseData, params, resolveId);
    if (this.resolveNestedRelations) for (const relUuid in this.relations[resolveId]) this.iterateTree(this.relations[resolveId][relUuid], relationParams, resolveId);
    if (responseData.story) this.iterateTree(responseData.story, relationParams, resolveId);
    else responseData.stories.forEach((story) => {
      this.iterateTree(story, relationParams, resolveId);
    });
    this.stringifiedStoriesCache = {};
    delete this.links[resolveId];
    delete this.relations[resolveId];
  }
  async cacheResponse(url, params, retries, fetchOptions) {
    const cacheKey = stringify({
      url,
      params
    });
    const provider = this.cacheProvider();
    if (params.version === "published" && url !== "/cdn/spaces/me") {
      const cache = await provider.get(cacheKey);
      if (cache) return Promise.resolve(cache);
    }
    const defaultLimit = !isCDNUrl(url) && this.rateLimitConfig.isManagementApi ? MANAGEMENT_API_DEFAULT_RATE_LIMIT : void 0;
    const rateLimit = determineRateLimit(url, params, this.rateLimitConfig, defaultLimit);
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.throttleManager.execute(rateLimit, "get", url, params, fetchOptions);
        if (res.status !== 200) return reject(res);
        let response = {
          data: res.data,
          headers: res.headers
        };
        const rateLimitHeaders = parseRateLimitHeaders(res.headers);
        if (rateLimitHeaders?.max !== void 0) this.rateLimitConfig.serverHeadersRateLimit = rateLimitHeaders.max;
        if (res.headers?.["per-page"]) response = Object.assign({}, response, {
          perPage: res.headers["per-page"] ? Number.parseInt(res.headers["per-page"]) : 0,
          total: res.headers["per-page"] ? Number.parseInt(res.headers.total) : 0
        });
        if (response.data.story || response.data.stories) {
          const resolveId = this.resolveCounter = ++this.resolveCounter % 1e3;
          await this.resolveStories(response.data, params, `${resolveId}`);
          response = await this.processInlineAssets(response);
        }
        if (params.version === "published" && url !== "/cdn/spaces/me") await provider.set(cacheKey, response);
        const isCacheClearable = this.cache.clear === "onpreview" && params.version === "draft" || this.cache.clear === "auto";
        if (params.token && response.data.cv) {
          if (isCacheClearable && cacheVersions[params.token] && cacheVersions[params.token] !== response.data.cv) await this.flushCache();
          cacheVersions[params.token] = response.data.cv;
        }
        return resolve(response);
      } catch (error) {
        if (error.response && error.status === 429) {
          retries = typeof retries === "undefined" ? 0 : retries + 1;
          if (retries < this.maxRetries) {
            console.log(`Hit rate limit. Retrying in ${this.retriesDelay / 1e3} seconds.`);
            await delay(this.retriesDelay);
            return this.cacheResponse(url, params, retries).then(resolve).catch(reject);
          }
        }
        reject(error);
      }
    });
  }
  throttledRequest(type, url, params, fetchOptions) {
    this.client.setFetchOptions(fetchOptions);
    return this.client[type](url, params);
  }
  cacheVersions() {
    return cacheVersions;
  }
  cacheVersion() {
    return cacheVersions[this.accessToken];
  }
  setCacheVersion(cv) {
    if (this.accessToken) cacheVersions[this.accessToken] = cv;
  }
  clearCacheVersion() {
    if (this.accessToken) cacheVersions[this.accessToken] = 0;
  }
  cacheProvider() {
    switch (this.cache.type) {
      case "memory":
        return {
          get(key) {
            return Promise.resolve(memory[key]);
          },
          getAll() {
            return Promise.resolve(memory);
          },
          set(key, content) {
            memory[key] = content;
            return Promise.resolve(void 0);
          },
          flush() {
            memory = {};
            return Promise.resolve(void 0);
          }
        };
      case "custom":
        if (this.cache.custom) return this.cache.custom;
      default:
        return {
          get() {
            return Promise.resolve();
          },
          getAll() {
            return Promise.resolve(void 0);
          },
          set() {
            return Promise.resolve(void 0);
          },
          flush() {
            return Promise.resolve(void 0);
          }
        };
    }
  }
  async flushCache() {
    await this.cacheProvider().flush();
    this.clearCacheVersion();
    return this;
  }
  async processInlineAssets(response) {
    if (!this.inlineAssets) return response;
    const processNode = (node) => {
      if (!node || typeof node !== "object") return node;
      if (Array.isArray(node)) return node.map((item) => processNode(item));
      let processedNode = { ...node };
      if (processedNode.fieldtype === "asset" && Array.isArray(response.data.assets)) processedNode = {
        ...response.data.assets.find((asset) => asset.id === processedNode.id),
        ...processedNode
      };
      for (const key in processedNode) if (typeof processedNode[key] === "object") processedNode[key] = processNode(processedNode[key]);
      return processedNode;
    };
    if (response.data.story) response.data.story.content = processNode(response.data.story.content);
    if (response.data.stories) response.data.stories = response.data.stories.map((story) => {
      story.content = processNode(story.content);
      return story;
    });
    return response;
  }
};

// netlify/functions/stories.js
var import_cookie = __toESM(require_dist(), 1);
var handler = async (event) => {
  const cookies = import_cookie.default.parse(event.headers.cookie || "");
  const token = cookies.sb_token;
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
  }
  try {
    const client = new Storyblok({ oauthToken: token });
    const spaceRes = await client.get("spaces/me");
    const spaceId = spaceRes.data.space.id;
    let page = 1;
    let allStories = [];
    while (true) {
      const res = await client.get(`spaces/${spaceId}/stories`, {
        per_page: 100,
        page
      });
      const batch = res.data.stories;
      if (!batch || batch.length === 0) break;
      allStories = [...allStories, ...batch];
      if (batch.length < 100) break;
      page++;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ stories: allStories })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch stories" })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=stories.js.map
