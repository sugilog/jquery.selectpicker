jQuery.selectpicker = {};
jQuery.fn.selectpicker = function( options ) {
  var config,
      context = jQuery( this );

  jQuery.selectpicker.configure( context, options );
  config = jQuery.selectpicker.config( context );

  var selectpickerWidget = {};
  selectpickerWidget.loaded = false;
  selectpickerWidget.picker = {
    append: function() {
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
                    .prop( { id: config.items.selector.picker.labelId.replace( "#", "" ), tabIndex: config.items.tabIndex } )
                    .addClass( config.items.cssClass.label )
                )
            )
            .append(
              jQuery( "<input>" )
                .addClass( "fakeInput" )
                .prop( { type: "text", tabIndex: -1 } )
                .css( { width: 1, height: 1, border: 0, outline: 0 } )
            )
        );
    }
  };
  selectpickerWidget.form = {
    append: function() {
      jQuery( config.items.selector.picker.frameId )
        .append(
          jQuery( "<input>" )
            .prop( {
              type: "hidden",
              name: config.items.select.name,
              id:   config.items.selector.form.id.replace( "#", "" )
            })
        );

      this.set( jQuery( config.items.select.id ).val() );
    },
    set: function( value ) {
      if ( typeof value === "undefined" ) {
        value = jQuery( config.items.select.id ).children( ":first" ).val();
      }

      jQuery( config.items.select.id ).val( value );

      var label = jQuery( config.items.select.id ).find( ":selected" ).text()

      jQuery( config.items.selector.form.id ).val( value );
      jQuery( config.items.selector.picker.labelId ).text( label );

      if ( selectpickerWidget.loaded ) {
        // XXX: fake input to make enter-key-form-submitable
        jQuery( config.items.selector.picker.baseId ).find( ".fakeInput" ).focus().select()

        if ( typeof options.onPick !== "undefined" ) {
          options.onPick.apply( context, [ value, label ] );
        }
      }
      else {
        if ( typeof options.onLoad !== "undefined" ) {
          options.onLoad.apply( context, [ value, label ] );
        }

        selectpickerWidget.loaded = true;
      }
    }
  };
  selectpickerWidget.options = {
    append: function( options ) {
      var self = this,
          base = self.base();

      jQuery( options ).each( function( _, option ) {
        base.find( config.items.selector.options.childId ).append( self.child( option.label, option.value ) )
      });

      selectpickerWidget.options.setCurrentPick();
    },
    hide: function() {
      if ( jQuery(selectpickerWidget.form.id ).is( ":disabled" ) ) {
        return;
      }

      jQuery( selectpickerWidget.picker.frameId ).css( { zIndex: 100 } );
      jQuery( config.items.selector.options.baseId ).hide();
      jQuery( config.items.selector.picker.labelId )
        .removeClass( config.items.cssClass.close )
        .addClass( config.items.cssClass.open );

      jQuery( config.items.selector.options.inputId ).prop( { tabIndex: 0 } );
      jQuery( config.items.selector.picker.labelId )
        .prop( { tabIndex: config.items.tabIndex } )
        .off( "focus.selectpicker" )
        .on(  "focus.selectpicker", function(){
          selectpickerWidget.options.show();
        })

      setTimeout( function() {
        jQuery( config.items.selector.picker.labelId ).off( "click.selectpicker" );
      }, 300 );
    },
    show: function() {
      jQuery( config.items.selector.options.baseId ).show();
      jQuery( config.items.selector.picker.frameId ).css( { zIndex: 999 } );
      jQuery( config.items.selector.options.inputId ).focus().select();
      jQuery( config.items.selector.picker.labelId )
        .removeClass( config.items.cssClass.open )
        .addClass( config.items.cssClass.close );

      selectpickerWidget.options.setCurrentPick();

      jQuery( config.items.selector.picker.labelId )
        .prop( { tabIndex: -1 } )
        .off( "focus.selectpicker" );

      setTimeout( function() {
        jQuery( config.items.selector.picker.labelId )
          .on( "click.selectpicker", function(){
            selectpickerWidget.options.hide();
          });
      }, 300 );

      jQuery( config.items.selector.options.inputId )
        .prop( { tabIndex: config.items.tabIndex } )
        .one( "blur.selectpicker", function() {
          selectpickerWidget.options.hide();
        });
    },
    toggle: function() {
      if ( jQuery( config.items.selector.picker.labelId ).hasClass( config.items.cssClass.open ) ) {
        this.show();
      }
      else {
        this.hide();
      }
    },
    disable: function() {
      this.hide();
      jQuery( config.items.selector.form.id ).prop( "disabled", true );
      jQuery( config.items.selector.picker.labelId )
        .prop( { tabIndex: -1 } )
        .css( { opacity: 0.5 } )
        .off( "focus.selectpicker" );
    },
    enable: function() {
      jQuery( config.items.selector.form.id ).prop( "disabled", false );
      jQuery( config.items.selector.picker.labelId ).css( { opacity: 1 } );
      jQuery( config.items.selector.picker.labelId ).on( "focus.selectpicker", function() {
        selectpickerWidget.options.show();
      });
    },
    isDisabled: function() {
      return jQuery( config.items.selector.form.id ).prop( "disabled" );
    },
    base: function() {
      var optionsBase;

      if ( jQuery( config.items.selector.options.baseId ).length <= 0 ) {
        optionsBase = jQuery( "<div>" ).prop( {
          id: config.items.selector.options.baseId.replace( "#", "" )
        })
        .append( this.search() );

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
              .on( "mouseover.selectpicker", function() {
                jQuery( config.items.selector.options.inputId ).off( "blur.selectpicker" )
              })
              .on( "mouseout.selectpicker", function() {
                jQuery( config.items.selector.options.inputId ).on( "blur.selectpicker", function() {
                  selectpickerWidget.options.hide();
                })
              })
          );
      }
      else {
        optionsBase.find( config.items.selector.options.childId ).children().remove();
      }

      return optionsBase;
    },
    search: function() {
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
    child: function( label, value ) {
      return jQuery( "<li>" )
        .data( config.items.dataKey, value )
        .addClass( config.items.cssClass.item )
        .append(
          jQuery( "<a>" )
            .prop( { href: "javascript:void(0)", tabIndex: -1 } )
            .text(label)
            .on("click.selectpicker", function(){
              selectpickerWidget.form.set( jQuery( this ).closest( "li" ).data( config.items.dataKey ) );
              selectpickerWidget.options.hide();
            })
        )
    },
    find: function( query ) {
      var self = this;

      return jQuery.map( config.items.select.searchWords, function( idx, val ) {
        if ( self.matchAll( query, val ) ) {
          return {
            value: config.items.select.values[ idx ],
            label: config.items.select.labels[ idx ]
          };
        }
      });
    },
    matchAll: function( query, sequence ) {
      var regexes = [/.*/];

      if ( query.length > 0 ) {
        regexes = jQuery.map( query.split( /(?:\s|　)/ ), function( val ) {
          return new RegExp( val, "i" );
        });
      }

      var result = true

      jQuery.each( regexes, function( _, regex ) {
        if ( !regex.test( sequence ) ) {
          result = false
          return
        }
      });

      return result;
    },
    findCurrentPick: function() {
      var currentPick;

      jQuery( config.items.selector.options.childId ).find( "li" ).each( function() {
        if ( jQuery( this ).hasClass( config.items.cssClass.current ) ) {
          currentPick = jQuery( this );
          return;
        }
      });

      return currentPick;
    },
    setCurrentPick: function( currentPick ) {
      if ( typeof currentPick === "undefined" ) {
        currentPick = selectpickerWidget.options.findCurrentPick() || jQuery( config.items.selector.options.childId ).children( ":first" );
      }

      if ( currentPick.length != 0 ) {
        currentPick.addClass( config.items.cssClass.current );

        var scrollOption = {}
        scrollOptions.scrollTop = currentPick.offset().top - currentPick.parent().children( ":first" ).offset().top;
        currentPick.parent().animate( scrollOption, config.items.scrollDuration );
      }

      return currentPick;
    }
  };

  if ( typeof options.callWidget !== "undefined" ) {
    return selectpickerWidget.options[ options.callWidget ]();
  }
  else {
    selectpickerWidget.picker.append();
    selectpickerWidget.options.append( selectpickerWidget.options.find( "" ) );
    selectpickerWidget.form.append();
    selectpickerWidget.options.hide();

    context.selectpickerEnable();

    jQuery( config.items.selector.options.inputId ).observeField( 0.2, function() {
      var query = jQuery( this ).val();
      var results = selectpickerWidget.options.find( query );
      selectpickerWidget.options.append( ( results.length == 0 ) ? { label: ( "not found for \"" + query + "\"" ), value: "" } : results );
    });

    jQuery( config.items.selector.options.inputId ).on( "keydown", function( event ) {
      if ( event.keyCode == "13" || event.keyCode == "38" || event.keyCode == "40" ) {
        var currentPick = selectpickerWidget.options.setCurrentPick( selectpickerWidget.options.findCurrentPick() );

        if ( event.keyCode == "13" ) {
          selectpickerWidget.form.set( currentPick.data( config.items.dataKey ) );
          selectpickerWidget.options.hide();

          return false;
        }
        else {
          var target = ( ( event.keyCode == "38" ) ? currentPick.prev() : currentPick.next() );

          if ( target.length > 0 ) {
            selectpickerWidget.options.setCurrentPick( target );
            currentPick.removeClass( config.items.cssClass.current );
          }
        }
      }
    });

    jQuery( "." + config.items.cssClass.base ).outerOff( "click.selectpicker" );
    jQuery( "." + config.items.cssClass.base ).outerOn(  "click.selectpicker", function( event ) {
      jQuery( this ).each( function() {
        jQuery( this ).prev().selectpickerOptionsClose();
      });
    });
  }
}
