/**
 * skylark-domx-modals - The skylark dom api extenstion library for color
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-modals/
 * @license MIT
 */
define(["skylark-langx/langx","./modals","./dialog"],function(a,l,n){return l.alert=function(){var l;if((l=mergeDialogOptions("alert",["ok"],["message","callback"],arguments)).callback&&!a.isFunction(l.callback))throw new Error("alert requires callback property to be a function when provided");return l.buttons.ok.callback=l.onEscape=function(){return!a.isFunction(l.callback)||l.callback.call(this)},n(l)}});
//# sourceMappingURL=sourcemaps/alert.js.map
