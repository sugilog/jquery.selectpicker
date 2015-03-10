jQuery.selectpicker = {};
jQuery.fn.selectpicker = function( options ) {
  var context = jQuery( this );
  options = options ? options : {};

  var selectpickerItems = {
    select: {
      id:   "#" + context.eq( 0 ).prop( "id" ),
      name: context.eq( 0 ).prop( "name" ),
      labels:      [],
      values:      [],
      searchWords: []
    },
    dataKey: "selectpicker_option_value",
    cssClass: {
      base:    "selectpicker_base",
      frame:   "selectpicker_frame",
      label:   "selectpicker_label",
      search:  "selectpicker_search",
      list:    "selectpicker_list",
      item:    "selectpicker_item",
      open:    "selectpicker_label_open",
      close:   "selectpicker_label_close",
      current: "selectpicker_current_pick"
    },
    scrollDuration: ( options.scrollDuration || 10 ),
    tabIndex: ( options.tabIndex || context.prop( "tabIndex" ) || 0 )
  };

  context.find( "option" ).each( function( idx, element ) {
    var label      = element.text,
        searchWord = label,
        kana       = jQuery( element ).data( "kana" );

    if ( typeof kana !== "undefined" && kana.toString().length > 0 ) {
      searchWord = label + "," + kana;
    }

    selectpickerItems.select.labels.push( label );
    selectpickerItems.select.values.push( jQuery( element ).val() );
    selectpickerItems.select.searchWords.push( searchWord );
  });

  var selectpickerWidget = {};
  selectpickerWidget.loaded = false;
  selectpickerWidget.picker = {
    baseId:  "#selectpicker_" + selectpickerItems.select.id.replace( "#", "" ),
    frameId: "#selectpicker_" + selectpickerItems.select.id.replace( "#", "" ) + "_frame",
    labelId: "#selectpicker_" + selectpickerItems.select.id.replace( "#", "" ) + "_label",
    append: function() {
      context
        .prop( "disabled", true )
        .hide()
        .after(
          jQuery( "<div>" )
            .prop( { id: this.baseId.replace( "#", "" ) } )
            .css( { position: "relative" } )
            .addClass( selectpickerItems.cssClass.base )
            .append(
              jQuery( "<div>" )
                .prop( { id: this.frameId.replace( "#", "" ) } )
                .css( { position: "absolute", zIndex: 100 } )
                .addClass( selectpickerItems.cssClass.frame )
                .append(
                  jQuery( "<div>" )
                    .prop( { id: this.labelId.replace( "#", "" ), tabIndex: selectpickerItems.tabIndex } )
                    .addClass( selectpickerItems.cssClass.label )
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
    id: selectpickerWidget.picker.frameId + "_hidden",
    append: function() {
      jQuery( selectpickerWidget.picker.frameId )
        .append(
          jQuery( "<input>" )
            .prop( {
              type: "hidden",
              name: selectpickerItems.select.name,
              id:   this.id.replace( "#", "" )
            })
        );

      this.set( jQuery( selectpickerItems.select.id ).val() );
    },
    set: function( value ) {
      if ( typeof value === "undefined" ) {
        value = jQuery( selectpickerItems.select.id ).children( ":first" ).val();
      }

      jQuery( selectpickerItems.select.id ).val( value );

      var label = jQuery( selectpickerItems.select.id ).find( ":selected" ).text()

      jQuery( this.id ).val( value );
      jQuery( selectpickerWidget.picker.labelId ).text( label );

      if ( selectpickerWidget.loaded ) {
        // XXX: fake input to make enter-key-form-submitable
        jQuery( selectpickerWidget.picker.baseId ).find( ".fakeInput" ).focus().select()

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
        base.find( self.childId ).append( self.child( option.label, option.value ) )
      });

      selectpickerWidget.options.setCurrentPick();
    },
    hide: function() {
      if ( jQuery(selectpickerWidget.form.id ).is( ":disabled" ) ) {
        return;
      }

      jQuery( selectpickerWidget.picker.frameId ).css( { zIndex: 100 } );
      jQuery( this.baseId ).hide();
      jQuery( selectpickerWidget.picker.labelId )
        .removeClass( selectpickerItems.cssClass.close )
        .addClass( selectpickerItems.cssClass.open );

      jQuery( selectpickerWidget.options.inputId ).prop( { tabIndex: 0 } );
      jQuery( selectpickerWidget.picker.labelId )
        .prop( { tabIndex: selectpickerItems.tabIndex } )
        .off( "focus.selectpicker" )
        .on(  "focus.selectpicker", function(){
          selectpickerWidget.options.show();
        })

      setTimeout( function() {
        jQuery( selectpickerWidget.picker.labelId ).off( "click.selectpicker" );
      }, 300 );
    },
    show: function() {
      jQuery( this.baseId ).show();
      jQuery( selectpickerWidget.picker.frameId ).css( { zIndex: 999 } );
      jQuery( this.inputId ).focus().select();
      jQuery( selectpickerWidget.picker.labelId )
        .removeClass( selectpickerItems.cssClass.open )
        .addClass( selectpickerItems.cssClass.close );

      selectpickerWidget.options.setCurrentPick();

      jQuery( selectpickerWidget.picker.labelId )
        .prop( { tabIndex: -1 } )
        .off( "focus.selectpicker" );

      setTimeout( function() {
        jQuery( selectpickerWidget.picker.labelId )
          .on( "click.selectpicker", function(){
            selectpickerWidget.options.hide();
          });
      }, 300 );

      jQuery( selectpickerWidget.options.inputId )
        .prop( { tabIndex: selectpickerItems.tabIndex } )
        .one( "blur.selectpicker", function() {
          selectpickerWidget.options.hide();
        });
    },
    toggle: function() {
      if ( jQuery( selectpickerWidget.picker.labelId ).hasClass( selectpickerItems.cssClass.open ) ) {
        this.show();
      }
      else {
        this.hide();
      }
    },
    disable: function() {
      this.hide();
      jQuery( selectpickerWidget.form.id ).prop( "disabled", true );
      jQuery( selectpickerWidget.picker.labelId )
        .prop( { tabIndex: -1 } )
        .css( { opacity: 0.5 } )
        .off( "focus.selectpicker" );
    },
    enable: function() {
      jQuery( selectpickerWidget.form.id ).prop( "disabled", false );
      jQuery( selectpickerWidget.picker.labelId ).css( { opacity: 1 } );
      jQuery( selectpickerWidget.picker.labelId ).on( "focus.selectpicker", function() {
        selectpickerWidget.options.show();
      });
    },
    isDisabled: function() {
      return jQuery( selectpickerWidget.form.id ).prop( "disabled" );
    },
    baseId:  selectpickerWidget.picker.frameId + "options",
    childId: selectpickerWidget.picker.frameId + "options_child",
    inputId: selectpickerWidget.picker.frameId + "options_search",
    base: function() {
      var optionsBase;

      if ( jQuery( this.baseId ).length <= 0 ) {
        optionsBase = jQuery( "<div>" ).prop( { id: this.baseId.replace( "#", "" ) } ).append( this.search() );
        jQuery( selectpickerWidget.picker.frameId ).append( optionsBase );
      }
      else {
        optionsBase = jQuery( this.baseId );
      }

      if ( optionsBase.find( this.childId ).length <= 0 ) {
        optionsBase
          .append(
            jQuery( "<ul>" )
              .prop( { id: this.childId.replace( "#", "" ) } )
              .addClass( selectpickerItems.cssClass.list )
              .on( "mouseover.selectpicker", function() {
                jQuery( selectpickerWidget.options.inputId ).off( "blur.selectpicker" )
              })
              .on( "mouseout.selectpicker", function() {
                jQuery( selectpickerWidget.options.inputId ).on( "blur.selectpicker", function() {
                  selectpickerWidget.options.hide();
                })
              })
          );
      }
      else {
        optionsBase.find( this.childId ).children().remove();
      }

      return optionsBase;
    },
    search: function() {
      return jQuery( "<input>" )
        .addClass( selectpickerItems.cssClass.search )
        .prop( {
          type: "text",
          id:   this.inputId.replace( "#", "" ),
          "autocomplete": "off"
        })
        .attr("autocomplete", "off");
        // for IE bug; attr autocomplete is not work for html attributes; only autocomplete??
    },
    child: function( label, value ) {
      return jQuery( "<li>" )
        .data( selectpickerItems.dataKey, value )
        .addClass( selectpickerItems.cssClass.item )
        .append(
          jQuery( "<a>" )
            .prop( { href: "javascript:void(0)", tabIndex: -1 } )
            .text(label)
            .on("click.selectpicker", function(){
              selectpickerWidget.form.set( jQuery( this ).closest( "li" ).data( selectpickerItems.dataKey ) );
              selectpickerWidget.options.hide();
            })
        )
    },
    find: function( query ) {
      var self = this;

      return jQuery.map( selectpickerItems.select.searchWords, function( idx, val ) {
        if ( self.matchAll( query, val ) ) {
          return {
            value: selectpickerItems.select.values[ idx ],
            label: selectpickerItems.select.labels[ idx ]
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

      jQuery( selectpickerWidget.options.childId ).find( "li" ).each( function() {
        if ( jQuery( this ).hasClass( selectpickerItems.cssClass.current ) ) {
          currentPick = jQuery( this );
          return;
        }
      });

      return currentPick;
    },
    setCurrentPick: function( currentPick ) {
      if ( typeof currentPick === "undefined" ) {
        currentPick = selectpickerWidget.options.findCurrentPick() || jQuery( selectpickerWidget.options.childId ).children( ":first" );
      }

      if ( currentPick.length != 0 ) {
        currentPick.addClass( selectpickerItems.cssClass.current );

        var scrollOption = {}
        scrollOptions.scrollTop = currentPick.offset().top - currentPick.parent().children( ":first" ).offset().top;
        currentPick.parent().animate( scrollOption, selectpickerItems.scrollDuration );
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

    jQuery( selectpickerWidget.options.inputId ).observeField( 0.2, function() {
      var query = jQuery( this ).val();
      var results = selectpickerWidget.options.find( query );
      selectpickerWidget.options.append( ( results.length == 0 ) ? { label: ( "not found for \"" + query + "\"" ), value: "" } : results );
    });

    jQuery( selectpickerWidget.options.inputId ).on( "keydown", function( event ) {
      if ( event.keyCode == "13" || event.keyCode == "38" || event.keyCode == "40" ) {
        var currentPick = selectpickerWidget.options.setCurrentPick( selectpickerWidget.options.findCurrentPick() );

        if ( event.keyCode == "13" ) {
          selectpickerWidget.form.set( currentPick.data( selectpickerItems.dataKey ) );
          selectpickerWidget.options.hide();

          return false;
        }
        else {
          var target = ( ( event.keyCode == "38" ) ? currentPick.prev() : currentPick.next() );

          if ( target.length > 0 ) {
            selectpickerWidget.options.setCurrentPick( target );
            currentPick.removeClass( selectpickerItems.cssClass.current );
          }
        }
      }
    });

    jQuery( "." + selectpickerItems.cssClass.base ).outerOff( "click.selectpicker" );
    jQuery( "." + selectpickerItems.cssClass.base ).outerOn(  "click.selectpicker", function( event ) {
      jQuery( this ).each( function() {
        jQuery( this ).prev().selectpickerOptionsClose();
      });
    });
  }
}
