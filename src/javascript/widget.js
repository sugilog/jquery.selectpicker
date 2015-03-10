jQuery.selectpicker.widget = {};

jQuery.selectpicker.widget.picker = {
  append: function( context ) {
    var config = jQuery.selectpicker.config( context );

    context
      .prop( "disabled", true )
      .hide()
      .after(
        jQuery( "<div>" )
          .prop( { id: config.items.selector.picker.baseId.replace( "#", "" ) } )
          .css( { position: "relative" } )
          .addClass( config.items.cssClass.base )
          .append(
            jQuery( "<div>" )
              .prop( { id: config.items.selector.picker.frameId.replace( "#", "" ) } )
              .css( { position: "absolute", zIndex: 100 } )
              .addClass( config.items.cssClass.frame )
              .append(
                jQuery( "<div>" )
                  .prop( {
                    id: config.items.selector.picker.labelId.replace( "#", "" ),
                    tabindex: config.items.tabindex
                  })
                  .addClass( config.items.cssClass.label )
              )
          )
          .append(
            jQuery( "<input>" )
              .addClass( "fakeInput" )
              .prop( { type: "text", tabindex: -1 } )
              .css( { width: 1, height: 1, border: 0, outline: 0 } )
          )
      );
  }
};

jQuery.selectpicker.widget.form = {
  append: function( context ) {
    var config = jQuery.selectpicker.config( context );

    jQuery( config.items.selector.picker.frameId )
      .append(
        jQuery( "<input>" )
          .prop( {
            type: "hidden",
            name: config.items.select.name,
            id:   config.items.selector.form.id.replace( "#", "" )
          })
      );

    jQuery.selectpicker.widget.form.set( context, jQuery( config.items.select.id ).val() );
  },
  set: function( context, value ) {
    var label,
        config = jQuery.selectpicker.config( context );

    if ( typeof value === "undefined" ) {
      value = jQuery( config.items.select.id ).children( ":first" ).val();
    }

    jQuery( config.items.select.id ).val( value );
    label = config.items.select.labels[ config.items.select.values.indexOf( value ) ];

    jQuery( config.items.selector.form.id ).val( value );
    jQuery( config.items.selector.picker.labelId ).text( label );

    if ( config.loaded ) {
      // XXX: fake input to make enter-key-form-submitable
      jQuery( config.items.selector.picker.baseId ).find( ".fakeInput" ).focus().select()
      config.items.callback.onPick.apply( context, [ value, label ] );
    }
    else {
      config.items.callback.onLoad.apply( context, [ value, label ] );
      config.loaded = true;
    }
  },
  get: function( context ) {
    var config = jQuery.selectpicker.config( context );
    return jQuery( config.items.selector.form.id ).val();
  }
};

jQuery.selectpicker.widget.options = {
  append: function( context, options ) {
    var base = jQuery.selectpicker.widget.options.base( context ),
        config = jQuery.selectpicker.config( context );

    jQuery( options ).each( function( _, option ) {
      base.find( config.items.selector.options.childId ).append( jQuery.selectpicker.widget.options.child( context, option.label, option.value ) )
    });

    jQuery.selectpicker.widget.options.setCurrentPick( context );
  },
  hide: function( context ) {
    var config = jQuery.selectpicker.config( context );

    if ( jQuery(jQuery.selectpicker.widget.form.id ).is( ":disabled" ) ) {
      return;
    }

    jQuery( config.items.selector.picker.frameId ).css( { zIndex: 100 } );
    jQuery( config.items.selector.options.baseId ).hide();
    jQuery( config.items.selector.picker.labelId )
      .removeClass( config.items.cssClass.close )
      .addClass( config.items.cssClass.open );

    jQuery( config.items.selector.options.inputId ).prop( { tabindex: 0 } );
    jQuery( config.items.selector.picker.labelId )
      .prop( { tabindex: config.items.tabindex } )
      .off( "focus.selectpicker" )
      .on(  "focus.selectpicker", config.events.onFocusPicker );

    setTimeout( function() {
      jQuery( config.items.selector.picker.labelId ).off( "click.selectpicker" );
    }, 300 );
  },
  show: function( context ) {
    var config = jQuery.selectpicker.config( context );

    jQuery( config.items.selector.options.baseId ).show();
    jQuery( config.items.selector.picker.frameId ).css( { zIndex: 999 } );
    jQuery( config.items.selector.options.inputId ).focus().select();
    jQuery( config.items.selector.picker.labelId )
      .removeClass( config.items.cssClass.open )
      .addClass( config.items.cssClass.close );

    jQuery.selectpicker.widget.options.setCurrentPick( context );

    jQuery( config.items.selector.picker.labelId )
      .prop( { tabindex: -1 } )
      .off( "focus.selectpicker" );

    setTimeout( function() {
      jQuery( config.items.selector.picker.labelId ).on( "click.selectpicker", config.events.onClickPicker );
    }, 300 );

    jQuery( config.items.selector.options.inputId )
      .prop( { tabindex: config.items.tabindex } )
      .one( "blur.selectpicker", config.events.onBlurPicker );
  },
  toggle: function( context ) {
    var config = jQuery.selectpicker.config( context );

    if ( jQuery( config.items.selector.picker.labelId ).hasClass( config.items.cssClass.open ) ) {
      jQuery.selectpicker.widget.options.show( context );
    }
    else {
      jQuery.selectpicker.widget.options.hide( context );
    }
  },
  disable: function( context ) {
    var config = jQuery.selectpicker.config( context );

    jQuery.selectpicker.widget.options.hide( context );
    jQuery( config.items.selector.form.id ).prop( "disabled", true );

    setTimeout( function() {
      jQuery( config.items.selector.picker.labelId )
        .css( { opacity: 0.5 } )
        .prop( { tabindex: -1 } )
        .off( "focus.selectpicker" );
    }, 0 );
  },
  enable: function( context ) {
    var config = jQuery.selectpicker.config( context );

    jQuery( config.items.selector.form.id ).prop( "disabled", false );
    jQuery( config.items.selector.picker.labelId )
      .css( { opacity: 1 } )
      .off( "focus.selectpicker" )
      .on(  "focus.selectpicker", config.events.onFocusPicker );
  },
  isDisabled: function( context ) {
    var config = jQuery.selectpicker.config( context );
    return jQuery( config.items.selector.form.id ).prop( "disabled" );
  },
  base: function( context ) {
    var optionsBase,
        config = jQuery.selectpicker.config( context );

    if ( jQuery( config.items.selector.options.baseId ).length <= 0 ) {
      optionsBase = jQuery( "<div>" ).prop( {
        id: config.items.selector.options.baseId.replace( "#", "" )
      })
      .append( jQuery.selectpicker.widget.options.search( context ) );

      jQuery( config.items.selector.picker.frameId ).append( optionsBase );
    }
    else {
      optionsBase = jQuery( config.items.selector.options.baseId );
    }

    if ( optionsBase.find( config.items.selector.options.childId ).length <= 0 ) {
      optionsBase
        .append(
          jQuery( "<ul>" )
            .prop( { id: config.items.selector.options.childId.replace( "#", "" ) } )
            .addClass( config.items.cssClass.list )
            .on( "mouseover.selectpicker", config.events.onMouseoverOptions )
            .on( "mouseout.selectpicker", config.events.onMouseoutOptions )
        );
    }
    else {
      optionsBase.find( config.items.selector.options.childId ).children().remove();
    }

    return optionsBase;
  },
  search: function( context ) {
    var config = jQuery.selectpicker.config( context );

    return jQuery( "<input>" )
      .addClass( config.items.cssClass.search )
      .prop( {
        type: "text",
        id:   config.items.selector.options.inputId.replace( "#", "" ),
        "autocomplete": "off"
      })
      .attr( "autocomplete", "off" );
      // for IE bug; attr autocomplete is not work for html attributes; only autocomplete??
  },
  child: function( context, label, value ) {
    var config = jQuery.selectpicker.config( context );

    return jQuery( "<li>" )
      .data( config.items.dataKey, value )
      .addClass( config.items.cssClass.item )
      .append(
        jQuery( "<a>" )
          .prop( { href: "javascript:void(0)", tabindex: -1 } )
          .text( label )
          .on( "click.selectpicker", config.events.onClickOptions )
      )
  },
  find: function( context, query ) {
    var config = jQuery.selectpicker.config( context );

    return jQuery.map( config.items.select.searchWords, function( val, idx ) {
      if ( jQuery.selectpicker.widget.options.matchAll( context, query, val ) ) {
        return {
          value: config.items.select.values[ idx ],
          label: config.items.select.labels[ idx ]
        };
      }
    });
  },
  matchAll: function( context, query, sequence ) {
    var result,
        regexes = [/.*/],
        config = jQuery.selectpicker.config( context );

    if ( query.length > 0 ) {
      regexes = jQuery.map( query.split( /(?:\s|　)/ ), function( val ) {
        return new RegExp( val, "i" );
      });
    }

    result = true

    jQuery.each( regexes, function( _, regex ) {
      if ( !regex.test( sequence ) ) {
        result = false
        return
      }
    });

    return result;
  },
  findCurrentPick: function( context ) {
    var currentPick,
        config = jQuery.selectpicker.config( context );

    jQuery( config.items.selector.options.childId ).find( "li" ).each( function() {
      if ( jQuery( this ).hasClass( config.items.cssClass.current ) ) {
        currentPick = jQuery( this );
        return;
      }
    });

    return currentPick;
  },
  setCurrentPick: function( context, currentPick ) {
    var scrollOption = {},
        config = jQuery.selectpicker.config( context );

    if ( typeof currentPick === "undefined" ) {
      currentPick = jQuery.selectpicker.widget.options.findCurrentPick( context ) || jQuery( config.items.selector.options.childId ).children( ":first" );
    }

    if ( currentPick.length != 0 ) {
      currentPick.addClass( config.items.cssClass.current );

      scrollOption.scrollTop = currentPick.offset().top - currentPick.parent().children( ":first" ).offset().top;
      currentPick.parent().animate( scrollOption, config.items.scrollDuration );
    }

    return currentPick;
  }
};
