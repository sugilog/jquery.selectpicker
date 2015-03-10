/*!
 * jquery.selectpicker v0.1.3
 *
 * Copyright (c) Takayuki Sugita, https://github.com/sugilog/jquery.selectpicker
 * Released under the MIT License
*/

( function() {
"use strict";
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

jQuery.selectpicker.configure = function( context, options ) {
  var name, tokens,
      config = {};

  options = jQuery.extend( {}, options );

  name = jQuery.selectpicker.config.contextName( context );
  config.items = jQuery.selectpicker.config.items( context, options );
  tokens = jQuery.selectpicker.config.tokens( context, options );

  jQuery.each( tokens, function( key, value ) {
    config.items.select[ key ] = value;
  });

  jQuery.selectpicker.config.configs = jQuery.extend(
    {},
    jQuery.selectpicker.config.configs
  );

  jQuery.selectpicker.config.configs[ name ] = config;
};

jQuery.selectpicker.config = function( context ) {
  var name = jQuery.selectpicker.config.contextName( context );
  return jQuery.selectpicker.config.configs[ name ];
};

jQuery.extend(
  jQuery.selectpicker.config,
  {
    contextName: function( context ) {
      return context.prop( "name" );
    },
    items: function( context, options ) {
      var name = jQuery.selectpicker.config.contextName( context ),
          id   = context.eq( 0 ).prop( "id" ),
          frameId = "#selectpicker_" + id + "_frame",
          noop = function(){};

      return {
        select: {
          id:   "#" + id,
          name: name,
        },
        dataKey: "selectpicker_option_value",
        scrollDuration: ( options.scrollDuration || 10 ),
        tabindex: ( options.tabindex || options.tabIndex || context.prop( "tabindex" ) || 0 ),
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
        selector: {
          picker: {
            baseId:  "#selectpicker_" + id,
            frameId: frameId,
            labelId: "#selectpicker_" + id + "_label",
          },
          form: {
            id: frameId + "_hidden",
          },
          options: {
            baseId:  frameId + "options",
            childId: frameId + "options_child",
            inputId: frameId + "options_search",
          }
        },
        callback: {
          onPick: options.onPick || noop,
          onLoad: options.onLoad || noop
        }
      };
    },
    tokens: function( context, options ) {
      var map = {
        labels:      [],
        values:      [],
        searchWords: []
      };

      context.find( "option" ).each( function( _, element ) {
        var label      = element.text,
            searchWord = label,
            kana       = jQuery( element ).data().kana;

        if ( typeof kana !== "undefined" && kana.toString().length > 0 ) {
          searchWord = label + "," + kana;
        }

        map.labels.push( label );
        map.values.push( jQuery( element ).val() );
        map.searchWords.push( searchWord );
      });

      return map;
    }
  }
);

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
    label = jQuery( config.items.select.id ).find( ":selected" ).text()

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

jQuery.selectpicker.util = {
  change: function( context, pickItem ) {
    var config = jQuery.selectpicker.config( context );
    config.events.onSetValue( context, pickItem );
  },
  deselect: function( context, deselectItem ) {
    var current,
        config = jQuery.selectpicker.config( context );

    current = jQuery.selectpicker.widget.options.findCurrentPick( context );

    if ( current.length === 0 ) {
      return
    }

    current = current.data( config.items.dataKey );

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


if ( typeof jQuery.fn.observeField === "undefined" ) {
  // jquery.observe_field
  // https://github.com/splendeo/jquery.observe_field
  jQuery.fn.observeField = function(frequency, callback) {
    frequency = frequency * 1000; // translate to milliseconds
    return this.each(function(){
      var self = jQuery(this);
      var prev = self.val();
      var check = function() {
        var val = self.val();
        if(prev != val){
          prev = val;
          self.map(callback); // invokes the callback on jQuery this
        }
      };
      var reset = function() {
        if(ti){
          clearInterval(ti);
          ti = setInterval(check, frequency);
        }
      };
      check();
      var ti = setInterval(check, frequency); // invoke check periodically
      // reset counter after user interaction
      self.bind('keyup click mousemove', reset); //mousemove is for selects
    });
  };
}

if ( typeof jQuery.fn.outerOn === "undefined" && typeof jQuery.fn.outerOff === "undefined" ) {
  jQuery.fn.outerOn = function() {
    var args = jQuery( arguments ).toArray(),
        self = this,
        handleEvent = ( args.shift() + [ ".outer" + "_" + self.eq( 0 ).prop( "id" ) ].join() ),
        selector    = "body";

    if ( typeof args[ 0 ] !== "function" ) {
      selector = args.shift();
    }

    var callback = args.shift();

    jQuery( selector ).on( handleEvent, function( event ) {
      if ( jQuery( event.target ).closest( self ).length === 0 ) {
        callback.apply( self, [ event ] );
      }
    });
  };

  jQuery.fn.outerOff = function() {
    var args = jQuery( arguments ).toArray(),
        self = this,
        handleEvent = ( args.shift() + [ ".outer" + "_" + self.eq( 0 ).prop( "id" ) ].join() ),
        selector    = "body";

    if ( typeof args[ 0 ] !== "undefined" ) {
      selector = args.shift();
    }

    jQuery( selector ).off( handleEvent );
  }
}
})();