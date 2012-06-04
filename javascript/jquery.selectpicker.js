/*!
 * jquery.selectpicker
 * Copyright 2012, TAKAYUKI SUGITA (sugilog)
*/
(function($) {
//var selectpicker = { };

$.fn.selectpicker = function(_options) {
  // prepare
  var _this = this;

  var selectpickerItems = {
    select: {
      id:   $(this).get(0).id,
      name: $(this).get(0).name,
      selected: $(this).find(":selected"),
      labels: [],
      values: [],
      searchWords: []
    }
  };

  $(this).find("option").each(function(idx, val) {
    var label = val.text;
    var searchWord = label;
    var kana = $(val).data("kana");

    if (kana.length > 0) {
      searchWord = label + "," + kana;
    }

    selectpickerItems.select.labels.push(label);
    selectpickerItems.select.values.push($(val).val());
    selectpickerItems.select.searchWords.push(searchWord);
  });

  var selectpickerWidget = {};
  selectpickerWidget.picker = {
    baseId:  "#selectpicker_" + selectpickerItems.select.id,
    labelId: "#selectpicker_" + selectpickerItems.select.id + "_label",
    append: function() {
      $(_this)
        .prop("disabled", true)
        .hide()
        .after(
          $("<div>")
            .prop({id: this.baseId.replace("#", "")})
            .append(
              $("<div>")
                .prop({id: this.labelId.replace("#", "")})
                .text(selectpickerItems.select.selected.text())
            )
        );
    }
  }
  selectpickerWidget.options = {
    append: function(options) {
      var that = this;
      var base = that.base();

      $(options).each(function(_, val) {
        base.find(that.childId).append(that.child(val.label, val.value))
      });
    },
    hide: function() {
      $(this.baseId).hide();
    },
    show: function() {
      $(this.baseId).show();
    },
    toggle: function() {
      $(this.baseId).toggle();
    },
    baseId:  selectpickerWidget.picker.baseId + "_options",
    childId: selectpickerWidget.picker.baseId + "_options_child",
    inputId: selectpickerWidget.picker.baseId + "_options_search",
    base: function() {
      var optionsBase;

      if ($(this.baseId).length <= 0) {
        optionsBase = $("<div>").prop({id: this.baseId.replace("#", "")}).append(this.search());
        $(selectpickerWidget.picker.baseId).append(optionsBase);
      }
      else {
        optionsBase = $(this.baseId);
      }

      if (optionsBase.find(this.childId).length <= 0) {
        optionsBase
          .append(
            $("<ul>").prop({id: this.childId.replace("#", "")}).css({"list-style-type": "none"})
          );
      }
      else {
        optionsBase.find(this.childId).children().remove();
      }

      return optionsBase;
    },
    search: function() {
      return $("<input>")
        .prop({
          type: "text",
          id:   this.inputId.replace("#", ""),
          name: selectpickerItems.select.name, autocomplete: "off"
        });
    },
    child: function(label, value) {
      return $("<li>")
        .css({
          width: "200px",
          height: "20px"
        })
        .data({selectpicker_option_value: value})
        .append(
          $("<a>")
            .css({display: "block", width: "100%", height: "100%", "text-decoration": "none"})
            .prop({href: "#"})
            .text(label)
            .one("click", function(){
              // FIXME: set value
              alert($(this).text());
            })
        )
    },
    find: function(query) {
      var regex = new RegExp(query);

      return $(selectpickerItems.select.searchWords).map(function(idx, val){
        if (regex.test(val)) {
          return {
            value: selectpickerItems.select.values[idx],
            label: selectpickerItems.select.labels[idx]
          };
        }
      }).toArray();
    }
  };

  selectpickerWidget.picker.append();
  selectpickerWidget.options.append(selectpickerWidget.options.find(""));
  selectpickerWidget.options.hide();

  $(selectpickerWidget.picker.labelId).on("click", function() {
    selectpickerWidget.options.toggle();
  });

  $(selectpickerWidget.options.inputId).observeField(0.5, function() {
    var query = $(this).val();
    var results = selectpickerWidget.options.find(query);
    selectpickerWidget.options.append( (results.length == 0) ? {label: ("not found for \"" + query + "\"")} : results);
  });
}


if (typeof $.fn.observeField === "undefined") {
  // jquery.observe_field
  // https://github.com/splendeo/jquery.observe_field
  $.fn.observeField = function(frequency, callback) {
    frequency = frequency * 1000; // translate to milliseconds
    return this.each(function(){
      var _this = $(this);
      var prev = _this.val();
      var check = function() {
        var val = _this.val();
        if(prev != val){
          prev = val;
          _this.map(callback); // invokes the callback on $this
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
      _this.bind('keyup click mousemove', reset); //mousemove is for selects
    });
  };
}

})(jQuery);
