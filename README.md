jquery.selectpicker
========================================

jquery plugin to change select box to searchable select box


Options
------------------------------------------------------------
<dl>
  <dt>onPick</dt>
  <dd>
    [function] onPick callback.

    <dl>
      <dt>this</dt>
      <dd>
        [jQuery object] selectpicker caller
      </dd>
      <dt>arguments</dt>
      <dd>
        "value" and "label" of changed (selected) item.
      </dd>
    </dl>
  </dd>
  <dt>onLoad</dt>
  <dd>
    [function] onLoad callback.

    <dl>
      <dt>this</dt>
      <dd>
        [jQuery object] selectpicker caller
      </dd>
      <dt>arguments</dt>
      <dd>
        "value" and "label" of changed (selected) item.
      </dd>
    </dl>
  </dd>
  <dt>scrollDuration</dt>
  <dd>
    [Number or String] duration; like 10, 100 or "fast", .. (default: 10)
  </dd>
  <dt>tabindex</dt>
  <dd>
    [Number] overwrite tabindex, .. (default: jQuery(this).prop("tabindex") or 0)
    ( allow tabIndex )
  </dd>
</dl>


example:

    jQuery(selector_for_select).selectpicker({
      onPick: function(value, label) {
        console.log(this);
        console.log(label + ": " + value);
      }
    });


Utility Methods
------------------------------------------------------------

change picked item:

    jQuery.selectpicker.util.change( jQuery( selector_for_select ), value );  

make enable selectpicker widget:

    jQuery.selectpicker.util.enable( jQuery( selector_for_select ) );  

make disable selectpicker widget:

    jQuery.selectpicker.util.disable( jQuery( selector_for_select ) );  

toggle open and close the options:

    jQuery.selectpicker.util.optionsToggle( jQuery( selector_for_select ) );  

check selectpicker disable or not:

    jQuery.selectpicker.util.isDisabled( jQuery( selector_for_select ) );  


### Deprecated Methods

make enable selectpicker widget:

    jQuery(selector_for_select).selectpickerEnable();

make disable selectpicker widget:

    jQuery(selector_for_select).selectpickerDisable();

toggle open and close the options:

    jQuery(selector_for_select).selectpickerOptionsToggle();

check selectpicker disable or not:

    jQuery(selector_for_select).selectpickerIsDisabled();

Licence
------------------------------------------------------------
jquery.selectpicker is licenced under the MIT License.
