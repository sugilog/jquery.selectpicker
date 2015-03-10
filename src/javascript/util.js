jQuery.fn.selectpickerOptionsClose = function() {
  jQuery.selectpicker.widget.options.hide( this );
};

jQuery.fn.selectpickerOptionsOpen = function() {
  jQuery.selectpicker.widget.options.show( this );
};

jQuery.fn.selectpickerOptionsToggle = function() {
  jQuery.selectpicker.widget.options.toggle( this );
};

jQuery.fn.selectpickerEnable = function() {
  jQuery.selectpicker.widget.options.enable( this );
};

jQuery.fn.selectpickerDisable = function() {
  jQuery.selectpicker.widget.options.disable( this );
};

jQuery.fn.selectpickerIsDisabled = function() {
  return jQuery.selectpicker.widget.options.isDisabled( this );
};
