define([
  "skylark-langx/langx",
  "./modals",
  "./dialog"
],function(langx,modals,dialog){

  function confirm() {
    var options;

    options = mergeDialogOptions("confirm", ["cancel", "confirm"], ["message", "callback"], arguments);

    /**
     * overrides; undo anything the user tried to set they shouldn't have
     */
    options.buttons.cancel.callback = options.onEscape = function() {
      return options.callback.call(this, false);
    };

    options.buttons.confirm.callback = function() {
      return options.callback.call(this, true);
    };

    // confirm specific validation
    if (!langx.isFunction(options.callback)) {
      throw new Error("confirm requires a callback");
    }

    return dialog(options);
  };


  return modals.confirm = confirm;
});