jQuery.selectpicker.configure = function( context, options ) {
  var name, tokens,
      config = {},
      noop = function(){};

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
          frameId = "#selectpicker_" + id + "_frame";

      return {
        select: {
          id:   "#" + id,
          name: name,
        },
        dataKey: "selectpicker_option_value",
        scrollDuration: ( options.scrollDuration || 10 ),
        tabIndex: ( options.tabIndex || context.prop( "tabIndex" ) || 0 ),
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
