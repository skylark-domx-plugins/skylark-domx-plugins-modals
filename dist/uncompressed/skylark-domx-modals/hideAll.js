define([
    "skylark-domx-1uery",
	"./modals"
],function($,modals){
	
  return modals.hideAll = function() {
    $(".modals").modal("hide");

    return modals;
  };

})