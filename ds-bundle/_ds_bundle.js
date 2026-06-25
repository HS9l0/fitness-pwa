// @ds-bundle name="FitnessPWA" version="1.0.0" globalName="FitnessPWA"
"use strict";
var FitnessPWA = (() => {
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

  // node_modules/react/cjs/react-jsx-runtime.production.js
  var require_react_jsx_runtime_production = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      function jsxProd(type, config, maybeKey) {
        var key = null;
        void 0 !== maybeKey && (key = "" + maybeKey);
        void 0 !== config.key && (key = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        config = maybeKey.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== config ? config : null,
          props: maybeKey
        };
      }
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = jsxProd;
      exports.jsxs = jsxProd;
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_jsx_runtime_production();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react/cjs/react.production.js
  var require_react_production = __commonJS({
    "node_modules/react/cjs/react.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      var ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function() {
        },
        enqueueReplaceState: function() {
        },
        enqueueSetState: function() {
        }
      };
      var assign = Object.assign;
      var emptyObject = {};
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      function ComponentDummy() {
      }
      ComponentDummy.prototype = Component.prototype;
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
      pureComponentPrototype.constructor = PureComponent;
      assign(pureComponentPrototype, Component.prototype);
      pureComponentPrototype.isPureReactComponent = true;
      var isArrayImpl = Array.isArray;
      function noop() {
      }
      var ReactSharedInternals = { H: null, A: null, T: null, S: null };
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function ReactElement(type, key, props) {
        var refProp = props.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== refProp ? refProp : null,
          props
        };
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        return ReactElement(oldElement.type, newKey, oldElement.props);
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      var userProvidedKeyEscapeRegex = /\/+/g;
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback)
          return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + invokeCallback
          )), array.push(callback)), 1;
        invokeCallback = 0;
        var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ctor = payload._result;
          ctor = ctor();
          ctor.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 1, payload._result = moduleObject;
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 2, payload._result = error;
            }
          );
          -1 === payload._status && (payload._status = 0, payload._result = ctor);
        }
        if (1 === payload._status) return payload._result.default;
        throw payload._result;
      }
      var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      };
      var Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = Children;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(size) {
          return ReactSharedInternals.H.useMemoCache(size);
        }
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key;
        if (null != config)
          for (propName in void 0 !== config.key && (key = "" + config.key), config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          for (var childArray = Array(propName), i = 0; i < propName; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        return ReactElement(element.type, key, props);
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        var propName, props = {}, key = null;
        if (null != config)
          for (propName in void 0 !== config.key && (key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === props[propName] && (props[propName] = childrenLength[propName]);
        return ReactElement(type, key, props);
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(render) {
        return { $$typeof: REACT_FORWARD_REF_TYPE, render };
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        return {
          $$typeof: REACT_LAZY_TYPE,
          _payload: { _status: -1, _result: ctor },
          _init: lazyInitializer
        };
      };
      exports.memo = function(type, compare) {
        return {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return ReactSharedInternals.H.useCacheRefresh();
      };
      exports.use = function(usable) {
        return ReactSharedInternals.H.use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return ReactSharedInternals.H.useActionState(action, initialState, permalink);
      };
      exports.useCallback = function(callback, deps) {
        return ReactSharedInternals.H.useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        return ReactSharedInternals.H.useContext(Context);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(value, initialValue) {
        return ReactSharedInternals.H.useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        return ReactSharedInternals.H.useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return ReactSharedInternals.H.useEffectEvent(callback);
      };
      exports.useId = function() {
        return ReactSharedInternals.H.useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        return ReactSharedInternals.H.useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        return ReactSharedInternals.H.useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return ReactSharedInternals.H.useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return ReactSharedInternals.H.useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return ReactSharedInternals.H.useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return ReactSharedInternals.H.useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return ReactSharedInternals.H.useTransition();
      };
      exports.version = "19.2.7";
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_production();
      } else {
        module.exports = null;
      }
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Badge: () => Badge,
    BottomNav: () => BottomNav,
    Button: () => Button,
    Card: () => Card,
    DrumPicker: () => DrumPicker,
    ExerciseCard: () => ExerciseCard,
    FitTheme: () => FitTheme,
    IosToggle: () => IosToggle,
    ProgressBar: () => ProgressBar,
    RestTimer: () => RestTimer,
    ScreenHeader: () => ScreenHeader,
    SegmentedControl: () => SegmentedControl,
    SetRow: () => SetRow,
    SettingsRow: () => SettingsRow,
    SettingsSection: () => SettingsSection,
    SettingsSheet: () => SettingsSheet,
    StatStrip: () => StatStrip,
    StreakWeek: () => StreakWeek,
    WorkoutHeader: () => WorkoutHeader,
    tokens: () => tokens
  });

  // src/components/FitTheme.tsx
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
  function FitTheme({ children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        style: {
          fontFamily: "system-ui, 'Segoe UI', sans-serif",
          background: "var(--bg, #080d14)",
          color: "var(--text, #e2eaf6)",
          minHeight: "100%"
        },
        children
      }
    );
  }

  // src/components/Button.tsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
  function Button({
    variant = "primary",
    children,
    onClick,
    disabled,
    pulsing,
    type = "button",
    className = ""
  }) {
    const base = variant === "primary" ? "btn-primary" : "btn-ghost";
    const pulseClass = pulsing ? "btn-pulse" : "";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type,
        className: [base, pulseClass, className].filter(Boolean).join(" "),
        onClick,
        disabled,
        style: pulsing ? { animation: "btn-pulse 1.8s ease-in-out infinite" } : void 0,
        children
      }
    );
  }

  // src/components/Card.tsx
  var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
  function Card({ children, className = "", style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: ["card", className].filter(Boolean).join(" "), style, children });
  }

  // src/components/Badge.tsx
  var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
  function Badge({ children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "badge", children });
  }

  // src/components/ScreenHeader.tsx
  var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
  function ScreenHeader({ badge, title, subtitle }) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "screen-header", children: [
      badge && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Badge, { children: badge }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h1", { children: title }),
      subtitle && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { children: subtitle })
    ] });
  }

  // src/components/StatStrip.tsx
  var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
  function StatStrip({ stats }) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "home-stats", children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "home-stat", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "home-stat-num", children: s.value }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "home-stat-lbl", children: s.label })
    ] }, i)) });
  }

  // src/components/StreakWeek.tsx
  var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
  function StreakWeek({ days }) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "streak-row", children: days.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: ["streak-dot", d.state === "done" ? "done" : d.state === "today" ? "today" : ""].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dot", children: d.state === "done" ? "\u2713" : "" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "day-lbl", children: d.label })
    ] }, i)) });
  }

  // src/components/ProgressBar.tsx
  var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
  function ProgressBar({ current, total, label }) {
    const pct = total > 0 ? Math.min(100, current / total * 100) : 0;
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "sets-progress", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "sets-progress-bar", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "sets-progress-fill", style: { width: `${pct}%` } }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "sets-progress-txt", children: [
        current,
        " / ",
        total,
        label ? ` ${label}` : ""
      ] })
    ] });
  }

  // src/components/SetRow.tsx
  var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
  var CheckIcon = () => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("polyline", { points: "20 6 9 17 4 12" }) });
  function SetRow({
    setNumber,
    reps = "",
    weight = "",
    unit = "kg",
    done = false,
    skipped = false,
    onCheck,
    onSkip,
    onRepsChange,
    onWeightChange,
    lastHint
  }) {
    const rowClass = ["set-row", done ? "done" : "", skipped ? "skipped" : ""].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: rowClass, children: [
      lastHint && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "set-last-hint", children: lastHint }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "set-row-top", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "set-num", children: setNumber }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "set-fields", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "set-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "div",
              {
                className: ["set-val", weight === "" ? "empty" : ""].filter(Boolean).join(" "),
                onClick: () => !done && !skipped && onWeightChange?.(""),
                children: weight !== "" ? weight : unit
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "set-field-lbl", children: unit })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "set-sep", children: "\xD7" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "set-field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "div",
              {
                className: ["set-val", reps === "" ? "empty" : ""].filter(Boolean).join(" "),
                onClick: () => !done && !skipped && onRepsChange?.(""),
                children: reps !== "" ? reps : "reps"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "set-field-lbl", children: "reps" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "set-row-foot", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { className: "set-skip-btn", onClick: onSkip, disabled: done || skipped, children: "Skip" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { className: "set-check-btn", onClick: onCheck, disabled: done || skipped, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(CheckIcon, {}) })
      ] })
    ] });
  }

  // src/components/ExerciseCard.tsx
  var import_react = __toESM(require_react(), 1);
  var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
  var ChevronIcon = () => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("svg", { className: "ex-chevron", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("polyline", { points: "9 18 15 12 9 6" }) });
  function ExerciseCard({
    number,
    name,
    muscles,
    meta,
    defaultOpen = false,
    complete = false,
    children
  }) {
    const [open, setOpen] = (0, import_react.useState)(defaultOpen);
    const cardClass = [
      "exercise-card",
      open ? "open" : "",
      complete ? "ex-complete" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cardClass, children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "ex-header", onClick: () => setOpen((o) => !o), children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "ex-num", children: number }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "ex-info", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "ex-name", children: name }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "ex-muscles", children: muscles })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "ex-meta", children: meta }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ChevronIcon, {})
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "ex-body-outer", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "ex-body", children }) })
    ] });
  }

  // src/components/WorkoutHeader.tsx
  var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
  var BackIcon = () => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("polyline", { points: "15 18 9 12 15 6" }) });
  function WorkoutHeader({ title, subtitle, elapsed, onBack }) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "workout-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "workout-header-left", children: [
        onBack && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { className: "wkt-back-btn", onClick: onBack, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(BackIcon, {}),
          " Back"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h2", { children: title }),
        subtitle && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: subtitle })
      ] }),
      elapsed !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "wkt-timer-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "timer", children: elapsed }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "timer-lbl", children: "elapsed" })
      ] })
    ] });
  }

  // src/components/RestTimer.tsx
  var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
  var RADIUS = 35;
  var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  function RestTimer({
    seconds,
    totalSeconds,
    onSkip,
    onAdd,
    addIncrement = 30
  }) {
    const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;
    const dashOffset = CIRCUMFERENCE * (1 - progress);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const display = `${mins > 0 ? `${mins}:` : ""}${String(secs).padStart(mins > 0 ? 2 : 1, "0")}`;
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "rest-overlay", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "rest-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "rest-lbl", children: "REST" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "rest-arc-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("svg", { className: "rest-arc-svg", viewBox: "0 0 80 80", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { className: "rest-arc-bg", cx: "40", cy: "40", r: RADIUS }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "circle",
            {
              className: "rest-arc-fill",
              cx: "40",
              cy: "40",
              r: RADIUS,
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: dashOffset,
              transform: "rotate(-90 40 40)",
              style: { transition: "stroke-dashoffset 0.95s linear" }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "rest-arc-inner", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "rest-count", children: display }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "rest-btns", children: [
        onAdd && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("button", { className: "rest-btn-add", onClick: () => onAdd(addIncrement), children: [
          "+",
          addIncrement,
          "s"
        ] }),
        onSkip && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: "rest-btn-skip", onClick: onSkip, children: "Skip" })
      ] })
    ] }) });
  }

  // src/components/BottomNav.tsx
  var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
  function BottomNav({ items, onSelect }) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "nav",
      {
        id: "bottom-nav",
        style: {
          display: "flex",
          background: "#0c1520",
          borderTop: "1px solid var(--border)",
          height: "calc(var(--nav-h) + var(--safe-bottom, 0px))",
          paddingBottom: "var(--safe-bottom, 0px)",
          flexShrink: 0
        },
        children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "button",
          {
            className: ["nav-btn", item.active ? "active" : ""].filter(Boolean).join(" "),
            onClick: () => onSelect?.(item.id),
            children: [
              item.icon,
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { children: item.label })
            ]
          },
          item.id
        ))
      }
    );
  }

  // src/components/IosToggle.tsx
  var import_react2 = __toESM(require_react(), 1);
  var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
  function IosToggle({ checked, onChange, label }) {
    const id = (0, import_react2.useId)();
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { className: "ios-toggle", htmlFor: id, "aria-label": label, children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "input",
        {
          id,
          type: "checkbox",
          checked,
          onChange: (e) => onChange(e.target.checked)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "ios-track" })
    ] });
  }

  // src/components/SegmentedControl.tsx
  var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
  function SegmentedControl({ options, value, onChange }) {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "unit-seg", children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "button",
      {
        className: ["unit-seg-btn", opt === value ? "active" : ""].filter(Boolean).join(" "),
        onClick: () => onChange(opt),
        children: opt
      },
      opt
    )) });
  }

  // src/components/DrumPicker.tsx
  var import_react3 = __toESM(require_react(), 1);
  var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
  function DrumPicker({ title, columns, onChange, onDone, onCancel }) {
    const scrollRefs = (0, import_react3.useRef)([]);
    (0, import_react3.useEffect)(() => {
      columns.forEach((col, ci) => {
        const el = scrollRefs.current[ci];
        if (!el) return;
        const idx = col.items.indexOf(col.value);
        if (idx < 0) return;
        el.scrollTop = idx * 44;
      });
    }, []);
    const handleScroll = (ci) => {
      const el = scrollRefs.current[ci];
      if (!el) return;
      const idx = Math.round(el.scrollTop / 44);
      const val = columns[ci].items[Math.min(idx, columns[ci].items.length - 1)];
      if (val !== void 0) onChange(ci, val);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "drum-sheet", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "drum-backdrop", onClick: onCancel }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "drum-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "drum-hdr", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("button", { className: "drum-cancel-btn", onClick: onCancel, children: "Cancel" }),
          title && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "drum-hdr-title", children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("button", { className: "drum-done-btn", onClick: onDone, children: "Done" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: ["drum-body", columns.length === 1 ? "drum-body-single" : ""].filter(Boolean).join(" "), children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "drum-band" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "drum-fade" }),
          columns.map((col, ci) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: ["drum-col", col.narrow ? "drum-col-frac" : ""].filter(Boolean).join(" "), children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            "div",
            {
              className: "drum-scroll",
              ref: (el) => {
                scrollRefs.current[ci] = el;
              },
              onScroll: () => handleScroll(ci),
              children: col.items.map((item, ii) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "drum-item", children: item }, ii))
            }
          ) }, ci))
        ] }),
        columns.some((c) => c.label) && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "drum-lbl-row", children: columns.map((col, ci) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "drum-col-lbl", children: col.label ?? "" }, ci)) })
      ] })
    ] });
  }

  // src/components/SettingsSheet.tsx
  var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
  function SettingsRow({ label, children, onClick }) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "settings-row", onClick, children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "settings-row-label", children: label }),
      children
    ] });
  }
  function SettingsSection({ label, children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "settings-section-label", children: label }),
      children
    ] });
  }
  function SettingsSheet({ open, title = "Settings", onClose, children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: ["settings-sheet", open ? "open" : ""].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "settings-backdrop", onClick: onClose }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "settings-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "settings-panel-hdr", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "settings-panel-title", children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { className: "settings-done-btn", onClick: onClose, children: "Done" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "settings-body", children })
      ] })
    ] });
  }

  // src/tokens.ts
  var tokens = {
    bg: "var(--bg)",
    surface: "var(--surface)",
    surfaceRaised: "var(--surface-raised)",
    border: "var(--border)",
    accent: "var(--accent)",
    accent2: "var(--accent-2)",
    accentBlue: "var(--accent-blue)",
    text: "var(--text)",
    textMuted: "var(--text-muted)",
    textDim: "var(--text-dim)",
    radius: "var(--radius)",
    radiusSm: "var(--radius-sm)"
  };
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
