--9a69053af49040c8ecbd41fdc83a34ac83071e2e4323953acaee13b190b1
Content-Disposition: form-data; name="index.js"

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process2 extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process2.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../.nvm/versions/node/v22.20.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.js
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
__name2(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
__name2(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
__name2(notImplementedClass2, "notImplementedClass");
var _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
var nodeTiming2 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry2 = class {
  static {
    __name(this, "PerformanceEntry");
  }
  static {
    __name2(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow2();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow2() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark3 = class PerformanceMark22 extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMark2");
  }
  static {
    __name2(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMeasure");
  }
  static {
    __name2(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  static {
    __name2(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList2 = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  static {
    __name2(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance2 = class {
  static {
    __name(this, "Performance");
  }
  static {
    __name2(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin2;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming2;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming2("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin2) {
      return _performanceNow2();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark3(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure2(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver2 = class {
  static {
    __name(this, "PerformanceObserver");
  }
  static {
    __name2(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
globalThis.performance = performance2;
globalThis.Performance = Performance2;
globalThis.PerformanceEntry = PerformanceEntry2;
globalThis.PerformanceMark = PerformanceMark3;
globalThis.PerformanceMeasure = PerformanceMeasure2;
globalThis.PerformanceObserver = PerformanceObserver2;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
var noop_default2 = Object.assign(() => {
}, { __unenv__: true });
var _console2 = globalThis.console;
var _ignoreErrors2 = true;
var _stderr2 = new Writable2();
var _stdout2 = new Writable2();
var log3 = _console2?.log ?? noop_default2;
var info3 = _console2?.info ?? log3;
var trace3 = _console2?.trace ?? info3;
var debug3 = _console2?.debug ?? log3;
var table3 = _console2?.table ?? log3;
var error3 = _console2?.error ?? log3;
var warn3 = _console2?.warn ?? error3;
var createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
var clear3 = _console2?.clear ?? noop_default2;
var count3 = _console2?.count ?? noop_default2;
var countReset3 = _console2?.countReset ?? noop_default2;
var dir3 = _console2?.dir ?? noop_default2;
var dirxml3 = _console2?.dirxml ?? noop_default2;
var group3 = _console2?.group ?? noop_default2;
var groupEnd3 = _console2?.groupEnd ?? noop_default2;
var groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
var profile3 = _console2?.profile ?? noop_default2;
var profileEnd3 = _console2?.profileEnd ?? noop_default2;
var time3 = _console2?.time ?? noop_default2;
var timeEnd3 = _console2?.timeEnd ?? noop_default2;
var timeLog3 = _console2?.timeLog ?? noop_default2;
var timeStamp3 = _console2?.timeStamp ?? noop_default2;
var Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
var _times2 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler2 = noop_default2;
var _stderrErrorHandler2 = noop_default2;
var workerdConsole2 = globalThis["console"];
var {
  assert: assert3,
  clear: clear22,
  // @ts-expect-error undocumented public API
  context: context2,
  count: count22,
  countReset: countReset22,
  // @ts-expect-error undocumented public API
  createTask: createTask22,
  debug: debug22,
  dir: dir22,
  dirxml: dirxml22,
  error: error22,
  group: group22,
  groupCollapsed: groupCollapsed22,
  groupEnd: groupEnd22,
  info: info22,
  log: log22,
  profile: profile22,
  profileEnd: profileEnd22,
  table: table22,
  time: time22,
  timeEnd: timeEnd22,
  timeLog: timeLog22,
  timeStamp: timeStamp22,
  trace: trace22,
  warn: warn22
} = workerdConsole2;
Object.assign(workerdConsole2, {
  Console: Console2,
  _ignoreErrors: _ignoreErrors2,
  _stderr: _stderr2,
  _stderrErrorHandler: _stderrErrorHandler2,
  _stdout: _stdout2,
  _stdoutErrorHandler: _stdoutErrorHandler2,
  _times: _times2
});
var console_default2 = workerdConsole2;
globalThis.console = console_default2;
var hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime2"), "hrtime"), {
  bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
    return BigInt(Date.now() * 1e6);
  }, "bigint"), "bigint")
});
var WriteStream2 = class {
  static {
    __name(this, "WriteStream");
  }
  static {
    __name2(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir32, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env22) {
    return 1;
  }
  hasColors(count32, env22) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var ReadStream2 = class {
  static {
    __name(this, "ReadStream");
  }
  static {
    __name2(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var NODE_VERSION2 = "22.14.0";
var Process2 = class _Process extends EventEmitter2 {
  static {
    __name(this, "_Process");
  }
  static {
    __name2(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream2(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream2(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream2(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd22) {
    this.#cwd = cwd22;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION2}`;
  }
  get versions() {
    return { node: NODE_VERSION2 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError2("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError2("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError2("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError2("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError2("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess2 = globalThis["process"];
var getBuiltinModule2 = globalProcess2.getBuiltinModule;
var { exit: exit2, platform: platform2, nextTick: nextTick2 } = getBuiltinModule2(
  "node:process"
);
var unenvProcess2 = new Process2({
  env: globalProcess2.env,
  hrtime: hrtime4,
  nextTick: nextTick2
});
var {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  finalization: finalization2,
  features: features2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
} = unenvProcess2;
var _process2 = {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exit: exit2,
  finalization: finalization2,
  features: features2,
  getBuiltinModule: getBuiltinModule2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  nextTick: nextTick2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  platform: platform2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  // @ts-expect-error old API
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
};
var process_default2 = _process2;
globalThis.process = process_default2;
var MAX_LOG_BODY = 150;
var json = /* @__PURE__ */ __name2((data, init = {}) => new Response(JSON.stringify(data), {
  ...init,
  headers: { "content-type": "application/json; charset=utf-8", ...init.headers || {} }
}), "json");
var unauthorized = /* @__PURE__ */ __name2(() => json({ error: "Unauthorized" }, { status: 401 }), "unauthorized");
var withBearer = /* @__PURE__ */ __name2((req, env22) => {
  const h = req.headers.get("authorization") || "";
  const token = h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : "";
  return !!token && token === env22.API_KEY;
}, "withBearer");
var truncate = /* @__PURE__ */ __name2((s, n = MAX_LOG_BODY) => {
  const str = typeof s === "string" ? s : JSON.stringify(s ?? "");
  if (str.length <= n) return str;
  return str.slice(0, n) + "\u2026";
}, "truncate");
var nowMs = /* @__PURE__ */ __name2(() => Date.now(), "nowMs");
function logStep(step, data = {}, messageId = null) {
  const time4 = (/* @__PURE__ */ new Date()).toISOString();
  const tag = messageId ? `[MSG:${String(messageId).slice(0, 6)}]` : "";
  let pretty;
  try {
    pretty = JSON.stringify(data, null, 2);
  } catch {
    pretty = String(data);
  }
  console.log(`
\u{1F7E2} [${time4}] ${tag} STEP \u2192 ${step}
${pretty}
---------------------------`);
}
__name(logStep, "logStep");
var safeString = /* @__PURE__ */ __name2((v) => {
  try {
    if (typeof v === "string") return v;
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}, "safeString");
async function notifyError(env22, title22, body) {
  if (env22.PUSHOVER_TOKEN && env22.PUSHOVER_USER) {
    try {
      const form = new URLSearchParams();
      form.set("token", env22.PUSHOVER_TOKEN);
      form.set("user", env22.PUSHOVER_USER);
      form.set("title", title22);
      form.set("message", body);
      form.set("priority", "1");
      await fetch("https://api.pushover.net/1/messages.json", { method: "POST", body: form });
      return;
    } catch {
    }
  }
  if (env22.NTFY_TOPIC) {
    try {
      await fetch(`https://ntfy.sh/${encodeURIComponent(env22.NTFY_TOPIC)}`, {
        method: "POST",
        headers: { "Title": title22 },
        body
      });
      return;
    } catch {
    }
  }
  try {
    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env22.ADMIN_EMAIL }] }],
        from: { email: env22.FROM_EMAIL },
        subject: title22,
        content: [{ type: "text/plain", value: body }]
      })
    });
  } catch {
  }
}
__name(notifyError, "notifyError");
__name2(notifyError, "notifyError");
async function notifyReport(env22, title22, body) {
  if (env22.PUSHOVER_TOKEN && env22.PUSHOVER_USER) {
    try {
      const form = new URLSearchParams();
      form.set("token", env22.PUSHOVER_TOKEN);
      form.set("user", env22.PUSHOVER_USER);
      form.set("title", title22);
      form.set("message", body);
      form.set("priority", "0");
      await fetch("https://api.pushover.net/1/messages.json", { method: "POST", body: form });
      return;
    } catch {
    }
  }
  if (env22.NTFY_TOPIC) {
    try {
      await fetch(`https://ntfy.sh/${encodeURIComponent(env22.NTFY_TOPIC)}`, {
        method: "POST",
        headers: { "Title": title22 },
        body
      });
      return;
    } catch {
    }
  }
  try {
    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env22.ADMIN_EMAIL }] }],
        from: { email: env22.FROM_EMAIL },
        subject: title22,
        content: [{ type: "text/plain", value: body }]
      })
    });
  } catch {
  }
}
__name(notifyReport, "notifyReport");
__name2(notifyReport, "notifyReport");
async function sendReportEmail(env22, subject, text) {
  await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: env22.ADMIN_EMAIL }] }],
      from: { email: env22.FROM_EMAIL },
      subject,
      content: [{ type: "text/plain", value: text }]
    })
  });
}
__name(sendReportEmail, "sendReportEmail");
__name2(sendReportEmail, "sendReportEmail");
function isInstanceInvalidated(resp) {
  return resp.status === "error" && resp.message === "Instance ID Invalidated";
}
__name(isInstanceInvalidated, "isInstanceInvalidated");
__name2(isInstanceInvalidated, "isInstanceInvalidated");
async function insertMessageRow(env22, payload) {
  const id = crypto.randomUUID();
  const created_at = nowMs();
  const to_number = payload?.number ?? null;
  const instance_id = payload?.instance_id ?? null;
  const reqClone = { ...payload || {} };
  if (typeof reqClone.message === "string") reqClone.message = truncate(reqClone.message);
  await env22.DB.prepare(
    `INSERT INTO messages
     (id, to_number, instance_id, body, sendapp_request, sendapp_response, status, error_code, error_detail, provider_name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', NULL, NULL, NULL, ?, ?)`
  ).bind(
    id,
    String(to_number ?? ""),
    String(instance_id ?? ""),
    truncate(payload?.message ?? ""),
    JSON.stringify(reqClone),
    "",
    // response placeholder
    created_at,
    created_at
  ).run();
  return { id, created_at };
}
__name(insertMessageRow, "insertMessageRow");
__name2(insertMessageRow, "insertMessageRow");
async function updateMessage(env22, args) {
  const updated_at = nowMs();
  await env22.DB.prepare(
    `UPDATE messages
     SET status = ?, sendapp_response = ?, error_code = ?, error_detail = ?, provider_name = ?, updated_at = ?
     WHERE id = ?`
  ).bind(
    args.status,
    args.sendapp_response,
    args.error_code ?? null,
    args.error_detail ?? null,
    args.provider_name ?? null,
    updated_at,
    args.id
  ).run();
}
__name(updateMessage, "updateMessage");
__name2(updateMessage, "updateMessage");
async function insertEvent(env22, message_id, type, payload) {
  await env22.DB.prepare(
    `INSERT INTO events (id, message_id, type, payload, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(crypto.randomUUID(), message_id, type, JSON.stringify(payload ?? {}), nowMs()).run();
}
__name(insertEvent, "insertEvent");
__name2(insertEvent, "insertEvent");
async function doSendToProvider(env22, payload) {
  const res = await fetch(env22.SENDAPP_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
  }
  return { httpStatus: res.status, text, json: parsed };
}
__name(doSendToProvider, "doSendToProvider");
__name2(doSendToProvider, "doSendToProvider");
async function tryReconnect(env22, instanceId) {
  const url = new URL(env22.RECONNECT_BASE);
  url.searchParams.set("instance_id", instanceId);
  url.searchParams.set("access_token", env22.RECONNECT_ACCESS_TOKEN);
  const res = await fetch(url.toString(), { method: "GET" });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}
__name(tryReconnect, "tryReconnect");
__name2(tryReconnect, "tryReconnect");
var sleep = /* @__PURE__ */ __name2((ms) => new Promise((r) => setTimeout(r, ms)), "sleep");
async function delayedRetrySend(env22, payload, messageId, label = "delayed_resend") {
  await insertEvent(env22, messageId, `${label}_scheduled`, { delay_ms: 1e4 });
  logStep("RETRY_WAITING", { delay_ms: 1e4 }, messageId);
  await sleep(1e4);
  logStep("RETRY_RESULT", { httpStatus: retry.httpStatus, body: retry.text.slice(0, 400) }, messageId);
  const retry = await doSendToProvider(env22, payload);
  await insertEvent(env22, messageId, `${label}_result`, {
    status: retry.httpStatus,
    body: retry.text
  });
  return retry;
}
__name(delayedRetrySend, "delayedRetrySend");
__name2(delayedRetrySend, "delayedRetrySend");
function isHttp2xx(status) {
  return status >= 200 && status < 300;
}
__name(isHttp2xx, "isHttp2xx");
__name2(isHttp2xx, "isHttp2xx");
function parsePeriod(period) {
  const now = /* @__PURE__ */ new Date();
  const end = now.getTime();
  const dayMs = 24 * 60 * 60 * 1e3;
  if (period === "yesterday") {
    const d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    const todayStart = d.getTime();
    return { since: todayStart - dayMs, until: todayStart, label: "yesterday" };
  } else if (period === "7d") {
    return { since: end - 7 * dayMs, until: end, label: "last 7 days" };
  } else if (period === "30d") {
    return { since: end - 30 * dayMs, until: end, label: "last 30 days" };
  } else {
    const d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    return { since: d.getTime(), until: end, label: "today" };
  }
}
__name(parsePeriod, "parsePeriod");
__name2(parsePeriod, "parsePeriod");
async function queryStats(env22, since, until) {
  const tot = await env22.DB.prepare(
    "SELECT COUNT(*) as c FROM messages WHERE created_at BETWEEN ? AND ?"
  ).bind(since, until).first();
  const ok = await env22.DB.prepare(
    "SELECT COUNT(*) as c FROM messages WHERE status = 'success' AND created_at BETWEEN ? AND ?"
  ).bind(since, until).first();
  const err = await env22.DB.prepare(
    "SELECT COUNT(*) as c FROM messages WHERE status = 'error' AND created_at BETWEEN ? AND ?"
  ).bind(since, until).first();
  const ar = await env22.DB.prepare(
    `SELECT COUNT(1) as c
     FROM messages m
     WHERE m.status = 'success'
       AND m.created_at BETWEEN ? AND ?
       AND EXISTS (
         SELECT 1 FROM events e
         WHERE e.message_id = m.id
           AND e.type IN (
             'reconnect',                       -- riconnessione effettuata
             'resend_result',                   -- resend immediato dopo reconnect
             'delayed_resend_fetch_result',     -- retry dopo FETCH error
             'delayed_resend_generic_result',   -- retry generico
             'delayed_resend_after_reconnect_result' -- retry dopo reconnect fallito al primo resend
           )
       )`
  ).bind(since, until).first();
  const total = tot?.c ?? 0;
  const success = ok?.c ?? 0;
  const error32 = err?.c ?? 0;
  const autoResolved = ar?.c ?? 0;
  return {
    total,
    success,
    error: error32,
    errorRate: total > 0 ? error32 / total : 0,
    autoResolved,
    // nuovi campi
    autoResolvedRate: success > 0 ? autoResolved / success : 0
  };
}
__name(queryStats, "queryStats");
__name2(queryStats, "queryStats");
function isNineLocal(env22, date = /* @__PURE__ */ new Date()) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: env22.TZ || "Europe/Rome",
    hour: "2-digit",
    hour12: false
  });
  const hour = parseInt(fmt.formatToParts(date).find((p) => p.type === "hour")?.value || "0", 10);
  return hour === 9;
}
__name(isNineLocal, "isNineLocal");
__name2(isNineLocal, "isNineLocal");
async function retentionCleanup(env22) {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1e3;
  await env22.DB.prepare("DELETE FROM events WHERE created_at < ?").bind(cutoff).run();
  await env22.DB.prepare("DELETE FROM messages WHERE created_at < ?").bind(cutoff).run();
}
__name(retentionCleanup, "retentionCleanup");
__name2(retentionCleanup, "retentionCleanup");
function centerFromInstanceId(idRaw) {
  const id = (idRaw || "").toUpperCase();
  const map = {
    "67EFB605B93A1": "Torre Del Greco",
    "67F7E1DA0EF73": "Portici",
    "67EFB424D2353": "Arzano"
  };
  return map[id] || (idRaw || "N/D");
}
__name(centerFromInstanceId, "centerFromInstanceId");
__name2(centerFromInstanceId, "centerFromInstanceId");
function recipientFromPayload(payload) {
  const name = typeof payload?.name === "string" && payload.name.trim() || [payload?.first_name, payload?.last_name].filter(Boolean).join(" ").trim();
  const who = name + " " + String(payload?.number ?? "");
  const centro = centerFromInstanceId(payload?.instance_id);
  return { who, centro };
}
__name(recipientFromPayload, "recipientFromPayload");
__name2(recipientFromPayload, "recipientFromPayload");
function titleFor(kind) {
  switch (kind) {
    case "RECONNECT_FAILED":
      return "Errore SendApp \u2013 Riconnessione non riuscita";
    case "RETRY_FAILED":
      return "Errore SendApp \u2013 Invio non riuscito";
    case "FETCH":
      return "Errore SendApp \u2013 Errore di rete";
    default:
      return "Errore SendApp \u2013 Errore generico";
  }
}
__name(titleFor, "titleFor");
__name2(titleFor, "titleFor");
function descriptionFor(kind) {
  switch (kind) {
    case "RECONNECT_FAILED":
      return "Account disconnesso: riconnessione non riuscita";
    case "RETRY_FAILED":
      return "Impossibile inviare il messaggio dopo la riconnessione";
    case "FETCH":
      return "Errore di rete verso SendApp";
    default:
      return "Errore durante l'invio del messaggio";
  }
}
__name(descriptionFor, "descriptionFor");
__name2(descriptionFor, "descriptionFor");
function sanitizePayloadForNotify(payload) {
  const copy = { ...payload || {} };
  if (typeof copy.message === "string") copy.message = truncate(copy.message);
  if (copy.access_token) {
    const v = String(copy.access_token);
    copy.access_token = v.length > 6 ? `${v.slice(0, 2)}***${v.slice(-4)}` : "***";
  }
  return copy;
}
__name(sanitizePayloadForNotify, "sanitizePayloadForNotify");
__name2(sanitizePayloadForNotify, "sanitizePayloadForNotify");
async function notifyStructuredError(env22, kind, payload, sendappMessage, respText) {
  const title22 = titleFor(kind);
  const descr = descriptionFor(kind);
  const { who, centro } = recipientFromPayload(payload);
  const payloadSan = sanitizePayloadForNotify(payload);
  const body = `${descr} \u2013 [${truncate(sendappMessage || "", 500)}]

- Destinatario: ${who}
- Centro: ${centro}

Pacchetto del messaggio inviato:
${JSON.stringify(payloadSan, null, 2)}

Pacchetto risposta SendApp:
${respText ? respText.length > 4e3 ? respText.slice(0, 4e3) + "\u2026" : respText : "\u2014"}`;
  await notifyError(env22, title22, body);
}
__name(notifyStructuredError, "notifyStructuredError");
__name2(notifyStructuredError, "notifyStructuredError");
async function ensureSchema(env22) {
  const stmts = [
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      to_number TEXT,
      instance_id TEXT,
      body TEXT,
      sendapp_request TEXT,
      sendapp_response TEXT,
      status TEXT CHECK (status IN ('pending','success','error')),
      error_code TEXT,
      error_detail TEXT,
      provider_name TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      message_id TEXT,
      type TEXT,
      payload TEXT,
      created_at INTEGER,
      FOREIGN KEY(message_id) REFERENCES messages(id) ON DELETE CASCADE
    )`,
    `CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_number)`,
    `CREATE INDEX IF NOT EXISTS idx_events_message ON events(message_id)`
  ];
  for (const sql of stmts) {
    await env22.DB.prepare(sql).run();
  }
}
__name(ensureSchema, "ensureSchema");
__name2(ensureSchema, "ensureSchema");
var index_default = {
  async fetch(req, env22, ctx) {
    const url = new URL(req.url);
    const { pathname } = url;
    if (req.method === "POST" && pathname === "/send") {
      logStep("REQUEST_RECEIVED", { url: req.url, method: req.method, headers: Object.fromEntries(req.headers) });
      let raw = "";
      try {
        raw = await req.text();
        logStep("RAW_BODY_RECEIVED", { length: raw.length, preview: raw });
      } catch (e) {
        logStep("ERROR_READING_BODY", { error: e?.message || e });
        return new Response(JSON.stringify({ error: "Cannot read body", detail: String(e?.message || e) }), { status: 400, headers: { "content-type": "application/json" } });
      }
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        const maybe = raw.trim();
        if (maybe.startsWith("payload=") || maybe.startsWith("data=")) {
          const eq = maybe.indexOf("=");
          const inner = decodeURIComponent(maybe.slice(eq + 1));
          try {
            payload = JSON.parse(inner);
            logStep("PAYLOAD_URLENCODED_UNWRAPPED", { preview: inner });
          } catch (e2) {
            logStep("ERROR_PARSING_JSON_URLENCODED", { error: e2?.message || e2, innerPreview: inner });
            return new Response(JSON.stringify({ error: "Invalid JSON (urlencoded)", detail: String(e2?.message || e2) }), { status: 400, headers: { "content-type": "application/json" } });
          }
        } else {
          logStep("ERROR_PARSING_JSON", { error: "SyntaxError", rawPreview: raw });
          return new Response(JSON.stringify({ error: "Invalid JSON", detail: "Body is not valid JSON" }), { status: 400, headers: { "content-type": "application/json" } });
        }
      }
      if (payload && typeof payload.raw === "string") {
        try {
          const inner = JSON.parse(payload.raw);
          payload = inner;
          logStep("PAYLOAD_WRAPPED_RAW_FIX", { ok: true });
        } catch (e3) {
          logStep("PAYLOAD_WRAPPED_RAW_FIX_FAILED", { error: e3?.message || e3, rawPreview: (payload.raw || "") });
          return new Response(JSON.stringify({ error: "Invalid JSON in 'raw' field", detail: String(e3?.message || e3) }), { status: 400, headers: { "content-type": "application/json" } });
        }
      }
      logStep("PAYLOAD_PARSED", payload);
      if (payload.number !== void 0) {
        if (typeof payload.number === "string") {
          const digits = payload.number.replace(/[^\d]/g, "");
          if (digits.length > 0) payload.number = Number(digits);
        }
        if (typeof payload.number !== "number" || !Number.isFinite(payload.number)) {
          logStep("VALIDATION_ERROR", { field: "number", value: payload.number });
          return new Response(JSON.stringify({ error: "Invalid 'number' field" }), { status: 400, headers: { "content-type": "application/json" } });
        }
      } else {
        logStep("VALIDATION_ERROR", { field: "number", reason: "missing" });
        return new Response(JSON.stringify({ error: "Missing 'number' field" }), { status: 400, headers: { "content-type": "application/json" } });
      }
      if (typeof payload.message !== "string" || payload.message.trim() === "") {
        logStep("VALIDATION_ERROR", { field: "message", value: payload.message });
        return new Response(JSON.stringify({ error: "Invalid 'message' field" }), { status: 400, headers: { "content-type": "application/json" } });
      }
      if (typeof payload.instance_id !== "string" || payload.instance_id.trim() === "") {
        logStep("VALIDATION_ERROR", { field: "instance_id", value: payload.instance_id });
        return new Response(JSON.stringify({ error: "Invalid 'instance_id' field" }), { status: 400, headers: { "content-type": "application/json" } });
      }
      if (typeof payload.access_token !== "string" || payload.access_token.trim() === "") {
        logStep("VALIDATION_ERROR", { field: "access_token", value: payload.access_token });
        return new Response(JSON.stringify({ error: "Invalid 'access_token' field" }), { status: 400, headers: { "content-type": "application/json" } });
      }
      logStep("PAYLOAD_READY_TO_SEND", {
        numberType: typeof payload.number,
        number: payload.number,
        instance_id: payload.instance_id,
        msgPreview: payload.message.slice(0, 120)
      });
      let messageId;
      let status = "error";
      let error_code = null;
      let error_detail = null;
      let provider_name = null;
      try {
        const ins = await insertMessageRow(env22, payload);
        messageId = ins.id;
        logStep("DB_INSERT_OK", { messageId, payload });
      } catch (e) {
        const msg = String(e?.message || e);
        return json({ status: "error", message: "DB insert failed (are tables created?)", detail: msg }, { status: 500 });
      }
      let sendRes;
      try {
        logStep("SENDING_TO_SENDAPP", { url: env22.SENDAPP_URL, payload }, messageId);
        sendRes = await doSendToProvider(env22, payload);
        logStep("SENDAPP_RESPONSE", { httpStatus: sendRes.httpStatus, body: sendRes.text.slice(0, 400) }, messageId);
      } catch (e) {
        const errText = `FETCH_ERROR: ${e?.message || e}`;
        logStep("ERROR_FETCH_EXCEPTION", { error: e?.message || e }, messageId);
        await insertEvent(env22, messageId, "fetch_error_initial", { error: String(errText) });
        const delayed = await delayedRetrySend(env22, payload, messageId, "delayed_resend_fetch");
        const dj = delayed.json;
        if (dj && dj.status === "success" || !dj && isHttp2xx(delayed.httpStatus)) {
          logStep("UPDATING_MESSAGE_STATUS", {
            status,
            error_code,
            error_detail,
            provider_name
          }, messageId);
          await updateMessage(env22, {
            id: messageId,
            status: "success",
            sendapp_response: delayed.text,
            error_code: null,
            error_detail: null,
            provider_name: dj?.data?.name ?? null
          });
          return json(dj ?? { status: "success", message: "OK" }, { status: 200 });
        }
        logStep("UPDATING_MESSAGE_STATUS", {
          status,
          error_code,
          error_detail,
          provider_name
        }, messageId);
        await updateMessage(env22, {
          id: messageId,
          status: "error",
          sendapp_response: errText + "\n\n" + delayed.text,
          error_code: "FETCH_ERROR",
          error_detail: dj && safeString(dj) || delayed.text.slice(0, 500)
        });
        await notifyStructuredError(env22, "FETCH", payload, "Upstream fetch failed", delayed.text || errText);
        return json({ status: "error", message: "Upstream fetch failed" }, { status: 502 });
      }
      const respText = sendRes.text;
      const parsed = sendRes.json;
      if (parsed && isInstanceInvalidated(parsed)) {
        const instId = payload?.instance_id ?? "";
        await insertEvent(env22, messageId, "reconnect_attempt", {
          url: `${env22.RECONNECT_BASE}?instance_id=${instId}&access_token=***`
        });
        const rec = await tryReconnect(env22, instId);
        await insertEvent(env22, messageId, "reconnect", { status: rec.status, ok: rec.ok, body: rec.text });
        if (!rec.ok) {
          logStep("UPDATING_MESSAGE_STATUS", {
            status,
            error_code,
            error_detail,
            provider_name
          }, messageId);
          await updateMessage(env22, {
            id: messageId,
            status: "error",
            sendapp_response: respText,
            // risposta originale con "Instance ID Invalidated"
            error_code: `RECONNECT_HTTP_${rec.status}`,
            error_detail: rec.text.slice(0, 500),
            provider_name: null
          });
          await notifyStructuredError(env22, "RECONNECT_FAILED", payload, parsed?.message, rec.text);
          return json({ status: "error", message: "Reconnect failed" }, { status: 502 });
        }
        const retry = await doSendToProvider(env22, payload);
        await insertEvent(env22, messageId, "resend_result", {
          status: retry.httpStatus,
          body: retry.text
        });
        const rj = retry.json;
        if (rj && rj.status === "success") {
          logStep("UPDATING_MESSAGE_STATUS", {
            status,
            error_code,
            error_detail,
            provider_name
          }, messageId);
          await updateMessage(env22, {
            id: messageId,
            status: "success",
            sendapp_response: retry.text,
            error_code: null,
            error_detail: null,
            provider_name: rj.data?.name ?? null
          });
          return json(rj, { status: 200 });
        }
        {
          const delayed = await delayedRetrySend(env22, payload, messageId, "delayed_resend_after_reconnect");
          const dj = delayed.json;
          if (dj && dj.status === "success" || !dj && isHttp2xx(delayed.httpStatus)) {
            logStep("UPDATING_MESSAGE_STATUS", {
              status,
              error_code,
              error_detail,
              provider_name
            }, messageId);
            await updateMessage(env22, {
              id: messageId,
              status: "success",
              sendapp_response: delayed.text,
              error_code: null,
              error_detail: null,
              provider_name: dj?.data?.name ?? null
            });
            return json(dj ?? { status: "success", message: "OK" }, { status: 200 });
          }
          logStep("UPDATING_MESSAGE_STATUS", {
            status,
            error_code,
            error_detail,
            provider_name
          }, messageId);
          await updateMessage(env22, {
            id: messageId,
            status: "error",
            sendapp_response: delayed.text,
            error_code: `HTTP_${delayed.httpStatus}`,
            error_detail: dj ? safeString(dj) : delayed.text.slice(0, 500),
            provider_name: null
          });
          await notifyStructuredError(env22, "RETRY_FAILED", payload, dj && dj.message || "", delayed.text);
          return json({ status: "error", message: "Retry failed" }, { status: 502 });
        }
      }
      let finalStatus = null;
      let finalText = null;
      let finalProvider = null;
      let finalErrorCode = null;
      let finalErrorDetail = null;
      const initialFailed = parsed ? parsed.status !== "success" : !isHttp2xx(sendRes.httpStatus);
      if (initialFailed) {
        const delayed = await delayedRetrySend(env22, payload, messageId, "delayed_resend_generic");
        const dj = delayed.json;
        if (dj && dj.status === "success" || !dj && isHttp2xx(delayed.httpStatus)) {
          logStep("UPDATING_MESSAGE_STATUS", {
            status,
            error_code,
            error_detail,
            provider_name
          }, messageId);
          await updateMessage(env22, {
            id: messageId,
            status: "success",
            sendapp_response: delayed.text,
            error_code: null,
            error_detail: null,
            provider_name: dj?.data?.name ?? null
          });
          return json(dj ?? { status: "success", message: "OK" }, { status: 200 });
        }
        finalStatus = "error";
        finalText = delayed.text;
        finalProvider = null;
        finalErrorCode = `HTTP_${delayed.httpStatus}`;
        finalErrorDetail = dj ? truncate(safeString(dj), 500) : truncate(delayed.text, 500);
      }
      if (finalStatus === null) {
        if (parsed) {
          if (parsed.status === "success") {
            finalStatus = "success";
            finalProvider = parsed.data?.name ?? null;
            finalText = respText;
            finalErrorCode = null;
            finalErrorDetail = null;
          } else {
            finalStatus = "error";
            finalText = respText;
            finalErrorCode = `HTTP_${sendRes.httpStatus}`;
            finalErrorDetail = truncate(safeString(parsed), 500);
          }
        } else {
          if (isHttp2xx(sendRes.httpStatus)) {
            finalStatus = "success";
            finalText = respText;
          } else {
            finalStatus = "error";
            finalText = respText;
            finalErrorCode = `HTTP_${sendRes.httpStatus}`;
            finalErrorDetail = truncate(respText, 500);
          }
        }
      }
      logStep("UPDATING_MESSAGE_STATUS", {
        status,
        error_code,
        error_detail,
        provider_name
      }, messageId);
      await updateMessage(env22, {
        id: messageId,
        status: finalStatus,
        sendapp_response: finalText,
        error_code: finalErrorCode ?? null,
        error_detail: finalErrorDetail ?? null,
        provider_name: finalProvider ?? null
      });
      if (finalStatus === "error") {
        const sendappMsg = parsed && parsed.message || "";
        await insertEvent(env22, messageId, "notify_after_delayed_retry", {
          error_code: finalErrorCode,
          error_detail: finalErrorDetail
        });
        await notifyStructuredError(env22, "GENERIC", payload, sendappMsg, finalText);
      }
      return json(
        parsed ?? { status: finalStatus, message: finalStatus === "success" ? "OK" : "Error" },
        { status: finalStatus === "success" ? 200 : 502 }
      );
    }
    if (req.method === "GET" && pathname === "/report") {
      if (!withBearer(req, env22)) return unauthorized();
      const period = url.searchParams.get("period") || "today";
      const { since, until, label } = parsePeriod(period);
      const stats = await queryStats(env22, since, until);
      return json({ period: label, since, until, ...stats });
    }
    if (req.method === "POST" && pathname === "/setup") {
      if (!withBearer(req, env22)) return unauthorized();
      await ensureSchema(env22);
      return json({ ok: true, message: "Schema ensured (statements applied)" });
    }
    if (req.method === "POST" && pathname === "/webhook") {
      return json({ ok: true, message: "Webhook accepted (no-op)" });
    }
    return json({ error: "Not found" }, { status: 404 });
  },
  // Cron oraria → invia report alle 09:00 Europe/Rome + retention cleanup
  async scheduled(_event, env22, ctx) {
    ctx.waitUntil((async () => {
      await retentionCleanup(env22);
      if (isNineLocal(env22, /* @__PURE__ */ new Date())) {
        const { since, until } = parsePeriod("yesterday");
        const stats = await queryStats(env22, since, until);
        const subject = `SendApp Report \u2013 ${env22.TZ || "Europe/Rome"} 09:00`;
        const when = new Intl.DateTimeFormat("it-IT", {
          timeZone: env22.TZ || "Europe/Rome",
          dateStyle: "short",
          timeStyle: "short"
        }).format(/* @__PURE__ */ new Date());
        const text = `Periodo: ieri
Totale: ${stats.total}
Successi: ${stats.success}
Errori: ${stats.error}
Error rate: ${(stats.errorRate * 100).toFixed(2)}%
Risolti automaticamente (silenz.): ${stats.autoResolved} (${(stats.autoResolvedRate * 100).toFixed(2)}% dei successi)

Inviato alle: ${when} (${env22.TZ || "Europe/Rome"})`;
        await sendReportEmail(env22, subject, text);
        await notifyReport(env22, subject, text);
      }
    })());
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

--9a69053af49040c8ecbd41fdc83a34ac83071e2e4323953acaee13b190b1--
