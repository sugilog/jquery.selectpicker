jQuery.fn.selectpickerOptionsClose = function() {
  this.selectpicker( { callWidget: "hide" } );
};
jQuery.fn.selectpickerOptionsOpen = function() {
  this.selectpicker( { callWidget: "show" } );
};
jQuery.fn.selectpickerOptionsToggle = function() {
  this.selectpicker( { callWidget: "toggle" } );
};
jQuery.fn.selectpickerEnable = function() {
  this.selectpicker( { callWidget: "enable" } );
};
jQuery.fn.selectpickerDisable = function() {
  this.selectpicker( { callWidget: "disable" } );
};
jQuery.fn.selectpickerIsDisabled = function() {
  return this.selectpicker( { callWidget: "isDisabled" } );
};
