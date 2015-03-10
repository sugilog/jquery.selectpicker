jQuery.selectpicker = {};
jQuery.fn.selectpicker = function( options ) {
  var events, config,
      context = jQuery( this );

  jQuery.selectpicker.configure( context, options );
  config = jQuery.selectpicker.config( context );

  function run() {
    jQuery.selectpicker.widget.picker.append( context );
    jQuery.selectpicker.widget.options.append( context, jQuery.selectpicker.widget.options.find( "" ) );
    jQuery.selectpicker.widget.form.append( context );
    jQuery.selectpicker.widget.options.hide( context );

    context.selectpickerEnable();

    jQuery( config.items.selector.options.inputId ).observeField( 0.2, function() {
      var query = jQuery( this ).val();
      var results = jQuery.selectpicker.widget.options.find( context, query );
      jQuery.selectpicker.widget.options.append( context, ( results.length == 0 ) ? { label: ( "not found for \"" + query + "\"" ), value: "" } : results );
    });

    jQuery( config.items.selector.options.inputId ).on( "keydown", onKeydownOptions );

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
      jQuery.selectpicker.widget.form.set( context, jQuery( this ).closest( "li" ).data( config.items.dataKey ) );
      jQuery.selectpicker.widget.options.hide( context );
    },
    onKeydownOptions: function( event ) {
      var currentPick;

      if ( event.keyCode == "13" || event.keyCode == "38" || event.keyCode == "40" ) {
        currentPick = jQuery.selectpicker.widget.options.findCurrentPick( context );
        currentPick = jQuery.selectpicker.widget.options.setCurrentPick( context, currentPick );
      };

      switch( event.keyCode ) {
      case "13":
        jQuery.selectpicker.widget.form.set( context, currentPick.data( config.items.dataKey ) );
        jQuery.selectpicker.widget.options.hide( context );

        return false;
      case "38":
      case "40":
        var target = ( ( event.keyCode == "38" ) ? currentPick.prev() : currentPick.next() );

        if ( target.length > 0 ) {
          jQuery.selectpicker.widget.options.setCurrentPick( context, target );
          currentPick.removeClass( config.items.cssClass.current );
        }
      }
    },
    onOuterClick: function( event ) {
      jQuery( this ).each( function() {
        jQuery( this ).prev().selectpickerOptionsClose();
      });
    }
  };

  config.loaded = false;
  config.events = events;

  run();
}
