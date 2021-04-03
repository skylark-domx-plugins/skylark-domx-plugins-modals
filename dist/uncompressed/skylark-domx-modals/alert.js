define([
	"skylark-langx/langx",
	"./modals",
  "./dialog"
],function(langx,modals,dialog){

  function alert() {
    var options;

    options = mergeDialogOptions("alert", ["ok"], ["message", "callback"], arguments);

    if (options.callback && !langx.isFunction(options.callback)) {
      throw new Error("alert requires callback property to be a function when provided");
    }

    /**
     * overrides
     */
    options.buttons.ok.callback = options.onEscape = function() {
      if (langx.isFunction(options.callback)) {
        return options.callback.call(this);
      }
      return true;
    };

    return dialog(options);
  };


  return modals.alert = alert;
});