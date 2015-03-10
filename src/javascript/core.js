jQuery.selectpicker = {};
jQuery.fn.selectpicker = function( options ) {
  var events, config,
      context = jQuery( this );

  jQuery.selectpicker.configure( context, options );
  config = jQuery.selectpicker.config( context );

  function run() {
    jQuery.selectpicker.widget.picker.append( context );
    jQuery.selectpicker.widget.options.append( context, jQuery.selectpicker.widget.options.find( context, "" ) );
    jQuery.selectpicker.widget.form.append( context );
    jQuery.selectpicker.widget.options.hide( context );
    jQuery.selectpicker.util.enable( context );

    jQuery( config.items.selector.options.inputId ).observeField( 0.2, function() {
      var query = jQuery( this ).val(),
          results = jQuery.selectpicker.widget.options.find( context, query );

      if ( results.length === 0 ) {
        results = { label: ( "not found for \"" + query + "\"" ), value: "" };
      }

      jQuery.selectpicker.widget.options.append( context, results );
    });

    jQuery( config.items.selector.options.inputId ).on( "keydown.selectpicker", config.events.onKeydownOptions );

    jQuery( "." + config.items.cssClass.base ).outerOff( "click.selectpicker" );
    jQuery( "." + config.items.cssClass.base ).outerOn(  "click.selectpicker", config.events.onOuterClick );
  }

  events = {
    onFocusPicker: function() {
      jQuery.selectpicker.widget.options.show( context );
    },
    onClickPicker: function() {
      jQuery.selectpicker.widget.options.hide( context );
    },
    onBlurPicker: function() {
      jQuery.selectpicker.widget.options.hide( context );
    },
    onMouseoverOptions: function() {
      jQuery( config.items.selector.options.inputId ).off( "blur.selectpicker" );
    },
    onMouseoutOptions: function() {
      jQuery( config.items.selector.options.inputId ).on( "blur.selectpicker", config.events.onBlurPicker );
    },
    onClickOptions: function() {
      config.events.onSetValue( context, jQuery( this ).closest( "li" ).data( config.items.dataKey ) );
    },
    onKeydownOptions: function( event ) {
      var currentPick,
          keyCode = event.keyCode.toString();

      if ( keyCode === "13" || keyCode === "38" || keyCode === "40" ) {
        currentPick = jQuery.selectpicker.widget.options.findCurrentPick( context );
        currentPick = jQuery.selectpicker.widget.options.setCurrentPick( context, currentPick );
      };

      switch( keyCode ) {
      case "13":
        config.events.onSetValue( context, currentPick.data( config.items.dataKey ) );
        return false;
      case "38":
      case "40":
        var target = ( ( keyCode == "38" ) ? currentPick.prev() : currentPick.next() );

        if ( target.length > 0 ) {
          jQuery.selectpicker.widget.options.setCurrentPick( context, target );
          currentPick.removeClass( config.items.cssClass.current );
        }
      }
    },
    onOuterClick: function( event ) {
      jQuery( this ).each( function() {
        jQuery.selectpicker.util.optionsClose( jQuery( this ).prev() );
      });
    },
    onSetValue: function( context, pickItem ) {
      if ( jQuery.inArray( pickItem, config.items.select.values ) >= 0 ) {
        jQuery.selectpicker.widget.form.set( context, pickItem );
        jQuery.selectpicker.widget.options.hide( context );
      }
    }
  };

  config.loaded = false;
  config.events = events;

  run();
}
