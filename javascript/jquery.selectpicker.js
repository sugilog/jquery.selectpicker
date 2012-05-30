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
      labels: [],
      values: []
    },
    input: {},
  };

  selectpickerItems.input.id = "#selectpicker_" + selectpickerItems.select.id;

  $(this).find("option").each(function(idx, val) {
    selectpickerItems.select.labels.push(val.text);
    selectpickerItems.select.values.push($(val).val());
  });


  var selectpickerWidget = {
    append: function() {
      $(_this)
        .prop("disabled", true)
        .hide()
        .after(
          $("<input>").prop({type: "text", id: selectpickerItems.input.id.replace("#", ""), name: selectpickerItems.select.name, autocomplete: "off"})
        );
    },
    appendOptions: function(options) {
      var optionsBase;

      console.log(this.options.id);
      if ($(this.options.id).length <= 0) {
        optionsBase = $("<ul>").prop({id: this.options.id.replace("#", "")}).css({"list-style-type": "none"});
        $(selectpickerItems.input.id).after(optionsBase);
      }
      else {
        optionsBase = $(this.options.id);
        optionsBase.children().remove();
      }

      var that = this;
      $(options).each(function(_, val) {
        optionsBase.append(that.options.child(val.label, val.value))
      });
    },
    options: {
      id:    selectpickerItems.input.id + "_options",
      child: function(label, value) {
        return $("<li>")
          .css({width: "200px", height: "20px"})
          .data({selectpicker_option_value: value})
          .append(
            $("<a>").css({display: "block", width: "100%", height: "100%", "text-decoration": "none"}).prop({href: "#"}).text(label)
          )
      }
    }
  };

  selectpickerWidget.append();

  $(selectpickerItems.input.id).observeField(0.5, function(){
    var query = $(this).val();
    var regex = new RegExp(query);

    var results = $(selectpickerItems.select.labels).map(function(idx, val){
      if (regex.test(val)) {
        return {value: selectpickerItems.select.values[idx], label: val};
      }
    }).toArray();

    selectpickerWidget.appendOptions(results);
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
