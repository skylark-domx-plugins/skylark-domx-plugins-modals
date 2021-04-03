/**
 * skylark-domx-modals - The skylark dom api extenstion library for color
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-modals/
 * @license MIT
 */
define(["skylark-langx/langx","./modals","./dialog"],function(c,n,a){return n.confirm=function(){var n;if((n=mergeDialogOptions("confirm",["cancel","confirm"],["message","callback"],arguments)).buttons.cancel.callback=n.onEscape=function(){return n.callback.call(this,!1)},n.buttons.confirm.callback=function(){return n.callback.call(this,!0)},!c.isFunction(n.callback))throw new Error("confirm requires a callback");return a(n)}});
//# sourceMappingURL=sourcemaps/confirm.js.map
