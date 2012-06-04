/*!
 * jquery.selectpicker
 * Copyright 2012, TAKAYUKI SUGITA (sugilog)
*/
(function($) {

$.fn.selectpicker = function(_options) {
  // prepare
  var _this = this;

  var selectpickerItems = {
    select: {
      id:   "#" + $(this).get(0).id,
      name: $(this).get(0).name,
      labels: [],
      values: [],
      searchWords: []
    },
    dataKey: "selectpicker_option_value",
    cssClass: {
      base:   "selectpicker_base",
      frame:  "selectpicker_frame",
      label:  "selectpicker_label",
      search: "selectpicker_search",
      list:   "selectpicker_list",
      item:   "selectpicker_item",
      open:   "selectpicker_label_open",
      close:  "selectpicker_label_close",
      current: "selectpicker_current_pick"
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
    baseId:  "#selectpicker_" + selectpickerItems.select.id.replace("#", ""),
    frameId: "#selectpicker_" + selectpickerItems.select.id.replace("#", "") + "_frame",
    labelId: "#selectpicker_" + selectpickerItems.select.id.replace("#", "") + "_label",
    append: function() {
      $(_this)
        .prop("disabled", true)
        .hide()
        .after(
          $("<div>")
            .prop({id: this.baseId.replace("#", "")})
            .css({position: "static"})
            .addClass(selectpickerItems.cssClass.base)
            .append(
              $("<div>")
                .prop({id: this.frameId.replace("#", "")})
                .css({position: "absolute", zIndex: 100})
                .addClass(selectpickerItems.cssClass.frame)
                .append(
                  $("<div>")
                    .prop({id: this.labelId.replace("#", "")})
                    .addClass(selectpickerItems.cssClass.label)
                )
            )
        );
    }
  };
  selectpickerWidget.form = {
    id: selectpickerWidget.picker.frameId + "_hidden",
    append: function() {
      $(selectpickerWidget.picker.frameId)
        .append(
          $("<input>")
            .prop({
              type: "hidden",
              name: selectpickerItems.select.name,
              id:   this.id.replace("#", "")
            })
        );
      this.set($(selectpickerItems.select.id).val());
    },
    set: function(value) {
      if (typeof value === "undefined") {
        value = $(selectpickerItems.select.id).children(":first").val();
      }

      $(selectpickerItems.select.id).val(value);
      $(this.id).val(value);
      $(selectpickerWidget.picker.labelId).text($(selectpickerItems.select.id).find(":selected").text());
    }
  };
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
      $(selectpickerWidget.picker.labelId).removeClass(selectpickerItems.cssClass.close);
      $(selectpickerWidget.picker.labelId).addClass(selectpickerItems.cssClass.open);
    },
    show: function() {
      $(this.baseId).show();
      $(selectpickerWidget.picker.labelId).removeClass(selectpickerItems.cssClass.open);
      $(selectpickerWidget.picker.labelId).addClass(selectpickerItems.cssClass.close);
    },
    toggle: function() {
      if ($(selectpickerWidget.picker.labelId).hasClass(selectpickerItems.cssClass.open)) {
        this.show();
      }
      else {
        this.hide();
      }
    },
    baseId:  selectpickerWidget.picker.frameId + "_options",
    childId: selectpickerWidget.picker.frameId + "_options_child",
    inputId: selectpickerWidget.picker.frameId + "_options_search",
    base: function() {
      var optionsBase;

      if ($(this.baseId).length <= 0) {
        optionsBase = $("<div>").prop({id: this.baseId.replace("#", "")}).append(this.search());
        $(selectpickerWidget.picker.frameId).append(optionsBase);
      }
      else {
        optionsBase = $(this.baseId);
      }

      if (optionsBase.find(this.childId).length <= 0) {
        optionsBase
          .append(
            $("<ul>")
              .prop({id: this.childId.replace("#", "")})
              .addClass(selectpickerItems.cssClass.list)
          );
      }
      else {
        optionsBase.find(this.childId).children().remove();
      }

      return optionsBase;
    },
    search: function() {
      return $("<input>")
        .addClass(selectpickerItems.cssClass.search)
        .prop({
          type: "text",
          id:   this.inputId.replace("#", ""),
          name: "_" + selectpickerItems.select.name,
          autocomplete: "off"
        });
    },
    child: function(label, value) {
      return $("<li>")
        .data(selectpickerItems.dataKey, value)
        .addClass(selectpickerItems.cssClass.item)
        .append(
          $("<a>")
            .prop({href: "#"})
            .text(label)
            .on("click", function(){
              selectpickerWidget.form.set($(this).closest("li").data(selectpickerItems.dataKey));
              selectpickerWidget.options.hide();
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
  selectpickerWidget.form.append();
  selectpickerWidget.options.hide();

  $(selectpickerWidget.picker.labelId).on("click", function() {
    selectpickerWidget.options.toggle();
  });

  $(selectpickerWidget.options.inputId).observeField(0.5, function() {
    var query = $(this).val();
    var results = selectpickerWidget.options.find(query);
    selectpickerWidget.options.append( (results.length == 0) ? {label: ("not found for \"" + query + "\""), value: ""} : results);
  });

// FIXME: keydown selecting: scrolling and picking
//  $(selectpickerWidget.options.inputId).keydown(function(e) {
//    if (e.keyCode == "38" || e.keyCode == "40") {
//      var currentPick;

//      $(selectpickerWidget.options.childId).find("li").each(function() {
//        if ($(this).hasClass(selectpickerItems.cssClass.current)) {
//          currentPick = $(this);
//          return;
//        }
//      });

//      if (typeof currentPick === "undefined") {
//        currentPick = $(selectpickerWidget.options.childId).children(":first");
//        currentPick.addClass(selectpickerItems.cssClass.current);
//      }

//      var target = ((e.keyCode == "38") ? currentPick.prev() : currentPick.next());

//      if (target.length > 0) {
//        target.addClass(selectpickerItems.cssClass.current);
//        currentPick.removeClass(selectpickerItems.cssClass.current);
//        target.animate({scrollTop: $(selectpickerWidget.options.childId).offset().top}, "fast");
//      }
//    }
//  });
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
