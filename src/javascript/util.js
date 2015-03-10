jQuery.selectpicker.util = {
  change: function( context, pickItem ) {
    var config = jQuery.selectpicker.config( context );
    config.events.onSetValue( context, pickItem );
  },
  deselect: function( context, deselectItem ) {
    var current = jQuery.selectpicker.widget.form.get( context ),
        config = jQuery.selectpicker.config( context );

    if ( current === deselectItem ) {
      config.events.onSetValue( context, "" );
    };
  },
  optionsClose: function( context ) {
    jQuery.selectpicker.widget.options.hide( context );
  },
  optionsOpen: function( context ) {
    jQuery.selectpicker.widget.options.show( context );
  },
  optionsToggle: function( context ) {
    jQuery.selectpicker.widget.options.toggle( context );
  },
  enable: function( context ) {
    jQuery.selectpicker.widget.options.enable( context );
  },
  disable: function( context ) {
    jQuery.selectpicker.widget.options.disable( context );
  },
  isDisabled: function( context ) {
    return jQuery.selectpicker.widget.options.isDisabled( context );
  }
}

jQuery.fn.selectpickerOptionsClose = function() {
  if ( window.console ) {
    window.console.log( "DEPRECATED: use jQuery.selectpicker.util.optionsClose" );
  }

  jQuery.selectpicker.util.optionsClose( this );
};

jQuery.fn.selectpickerOptionsOpen = function() {
  if ( window.console ) {
    window.console.log( "DEPRECATED: use jQuery.selectpicker.util.optionsOpen" );
  }

  jQuery.selectpicker.util.optionsOpen( this );
};

jQuery.fn.selectpickerOptionsToggle = function() {
  if ( window.console ) {
    window.console.log( "DEPRECATED: use jQuery.selectpicker.util.optionsToggle" );
  }

  jQuery.selectpicker.util.optionsToggle( this );
};

jQuery.fn.selectpickerEnable = function() {
  if ( window.console ) {
    window.console.log( "DEPRECATED: use jQuery.selectpicker.util.enable" );
  }

  jQuery.selectpicker.util.enable( this );
};

jQuery.fn.selectpickerDisable = function() {
  if ( window.console ) {
    window.console.log( "DEPRECATED: use jQuery.selectpicker.util.disable" );
  }

  jQuery.selectpicker.util.disable( this );
};

jQuery.fn.selectpickerIsDisabled = function() {
  if ( window.console ) {
    window.console.log( "DEPRECATED: use jQuery.selectpicker.util.isDisabled" );
  }

  jQuery.selectpicker.util.isDisabled( this );
};

