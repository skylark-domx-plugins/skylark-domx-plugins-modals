define([
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "./modals"
],function(langx,browser,eventer,noder,geom,$,plugins,modals){


  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = plugins.Plugin.inherit({
    klassName: "Modal",

    pluginName : "domx.modal",

    options : {
      backdrop: true,
      keyboard: true,
      show: true
    },

    _construct : function(element,options) {
      plugins.Plugin.prototype._construct.call(this,element,options);

      this.$container               = $(options.container || document.body)
      this.$element            = $(element)
      this.$dialog             = this.$element.find('.modal-dialog')
      if (!this.$container.is("body")) {
        this.$element.css("position","absolute");
      }
      //this.$container.append(this.$element);
      this.$backdrop           = null
      this.isShown             = null
      this.originalBodyPad     = null
      this.scrollbarWidth      = 0
      this.ignoreBackdropClick = false

      if (this.options.remote) {
        this.$element
          .find('.modal-content')
          .load(this.options.remote, langx.proxy(function () {
            this.$element.trigger('loaded.modal')
          }, this))
      }
    },

    toggle : function (_relatedTarget) {
      return this.isShown ? this.hide() : this.show(_relatedTarget)
    },

    show : function (_relatedTarget) {
      var that = this
      var e    = eventer.create('show.modal', { relatedTarget: _relatedTarget })

      this.$element.trigger(e)

      if (this.isShown || e.isDefaultPrevented()) return

      this.isShown = true

      this.checkScrollbar()
      this.setScrollbar()
      this.$container.addClass('modal-open')

      this.escape()
      this.resize()

      this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', langx.proxy(this.hide, this))

      this.$dialog.on('mousedown.dismiss.modal', function () {
        that.$element.one('mouseup.dismiss.modal', function (e) {
          if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
        })
      })

      this.backdrop(function () {
        var transition = browser.support.transition && that.$element.hasClass('fade')

        if (!noder.isChildOf(that.$element[0],that.$container[0])) {
          that.$element.appendTo(that.$container) // don't move modals dom position
        }

        that.$element
          .show()
          .scrollTop(0)

        that.adjustDialog()

        if (transition) {
          that.$element[0].offsetWidth // force reflow
        }

        that.$element.addClass('in')

        that.enforceFocus()

        var e = eventer.create('shown.modal', { relatedTarget: _relatedTarget })

        transition ?
          that.$dialog // wait for modal to slide in
            .one('transitionEnd', function () {
              that.$element.trigger('focus').trigger(e)
            })
            .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
          that.$element.trigger('focus').trigger(e)
      })
    },

    hide : function (e) {
      if (e) e.preventDefault()

      e = eventer.create('hide.modal')

      this.$element.trigger(e)

      if (!this.isShown || e.isDefaultPrevented()) return

      this.isShown = false

      this.escape()
      this.resize()

      $(document).off('focusin.modal')

      this.$element
        .removeClass('in')
        .off('click.dismiss.modal')
        .off('mouseup.dismiss.modal')

      this.$dialog.off('mousedown.dismiss.modal')

      browser.support.transition && this.$element.hasClass('fade') ?
        this.$element
          .one('transitionEnd', langx.proxy(this.hideModal, this))
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        this.hideModal()
    },

    enforceFocus : function () {
      $(document)
        .off('focusin.modal') // guard against infinite focus loop
        .on('focusin.modal', langx.proxy(function (e) {
          if (document !== e.target &&
              this.$element[0] !== e.target &&
              !this.$element.has(e.target).length) {
            this.$element.trigger('focus')
          }
        }, this))
    },

    escape : function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keydown.dismiss.modal', langx.proxy(function (e) {
          e.which == 27 && this.hide()
        }, this))
      } else if (!this.isShown) {
        this.$element.off('keydown.dismiss.modal')
      }
    },

    resize : function () {
      if (this.isShown) {
        $(window).on('resize.modal', langx.proxy(this.handleUpdate, this))
      } else {
        $(window).off('resize.modal')
      }
    },

    hideModal : function () {
      var that = this
      this.$element.hide()
      this.backdrop(function () {
        that.$container.removeClass('modal-open')
        that.resetAdjustments()
        that.resetScrollbar()
        that.$element.trigger('hidden.modal')
      })
    },

    removeBackdrop : function () {
      this.$backdrop && this.$backdrop.remove()
      this.$backdrop = null
    },

    backdrop : function (callback) {
      var that = this
      var animate = this.$element.hasClass('fade') ? 'fade' : ''

      if (this.isShown && this.options.backdrop) {
        var doAnimate = browser.support.transition && animate

        this.$backdrop = $(document.createElement('div'))
          .addClass('modal-backdrop ' + animate)
          .appendTo(this.$container)

        if (!this.$container.is("body")) {
          this.$backdrop.css("position","absolute");
        }


        this.$element.on('click.dismiss.modal', langx.proxy(function (e) {
          if (this.ignoreBackdropClick) {
            this.ignoreBackdropClick = false
            return
          }
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus()
            : this.hide()
        }, this))

        if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

        this.$backdrop.addClass('in')

        if (!callback) return

        doAnimate ?
          this.$backdrop
            .one('transitionEnd', callback)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
          callback()

      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in')

        var callbackRemove = function () {
          that.removeBackdrop()
          callback && callback()
        }
        browser.support.transition && this.$element.hasClass('fade') ?
          this.$backdrop
            .one('transitionEnd', callbackRemove)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
          callbackRemove()

      } else if (callback) {
        callback()
      }
    },

    // these following methods are used to handle overflowing modals

    handleUpdate : function () {
      this.adjustDialog()
    },

    adjustDialog : function () {
      var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

      this.$element.css({
        paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
        paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
      })
    },

    resetAdjustments : function () {
      this.$element.css({
        paddingLeft: '',
        paddingRight: ''
      })
    },

    checkScrollbar : function () {
      var fullWindowWidth = window.innerWidth
      if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect()
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
      this.scrollbarWidth = this.measureScrollbar()
    },

    setScrollbar : function () {
      var bodyPad = parseInt((this.$container.css('padding-right') || 0), 10)
      this.originalBodyPad = document.body.style.paddingRight || ''
      if (this.bodyIsOverflowing) this.$container.css('padding-right', bodyPad + this.scrollbarWidth)
    },

    resetScrollbar : function () {
      this.$container.css('padding-right', this.originalBodyPad)
    },

    measureScrollbar : function () { // thx walsh
      var scrollDiv = document.createElement('div')
      scrollDiv.className = 'modal-scrollbar-measure'
      this.$container.append(scrollDiv)
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      this.$container[0].removeChild(scrollDiv)
      return scrollbarWidth
    }

  });  


  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  plugins.register(Modal);


  return modals.Modal = Modal;

});
