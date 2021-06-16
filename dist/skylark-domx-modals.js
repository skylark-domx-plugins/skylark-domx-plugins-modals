/**
 * skylark-domx-modals - The skylark dom api extenstion library for color
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-modals/
 * @license MIT
 */
!function(r,o){var e=o.define,require=o.require,n="function"==typeof e&&e.amd,t=!n&&"undefined"!=typeof exports;if(!n&&!e){var s={};e=o.define=function(r,o,e){"function"==typeof e?(s[r]={factory:e,deps:o.map(function(o){return function(r,o){if("."!==r[0])return r;var e=o.split("/"),n=r.split("/");e.pop();for(var t=0;t<n.length;t++)"."!=n[t]&&(".."==n[t]?e.pop():e.push(n[t]));return e.join("/")}(o,r)}),resolved:!1,exports:null},require(r)):s[r]={factory:null,resolved:!0,exports:e}},require=o.require=function(r){if(!s.hasOwnProperty(r))throw new Error("Module "+r+" has not been defined");var module=s[r];if(!module.resolved){var e=[];module.deps.forEach(function(r){e.push(require(r))}),module.exports=module.factory.apply(o,e)||null,module.resolved=!0}return module.exports}}if(!e)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(r,require){r("skylark-domx-modals/modals",["skylark-langx/skylark"],function(r){"use strict";return r.attach("domx.plugins.modals",{})}),r("skylark-domx-modals/main",["./modals"],function(r){return r}),r("skylark-domx-modals",["skylark-domx-modals/main"],function(r){return r})}(e),!n){var a=require("skylark-langx-ns");t?module.exports=a:o.skylarkjs=a}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-domx-modals.js.map
