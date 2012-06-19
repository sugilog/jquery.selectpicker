jquery.selectpicker
========================================

jquery plugin to change select box to searchable select box


Options
------------------------------------------------------------
<dl>
  <dt>onChange</dt>
  <dd>
    [function] onChange callback.

    "this" has selectpicker caller, "arguments" have "value" and "label" of changed (selected) item.
  </dd>
</dl>


example:

    $(selector_for_select).selectpicker({
      onChange: function(value, label) {
        console.log(this);
        console.log(label + ": " + value);
      }
    });


Utility Methods
------------------------------------------------------------

make enable selectpicker widget:

    $(selector_for_select).selectpickerEnable();

make disable selectpicker widget:

    $(selector_for_select).selectpickerDisable();

toggle open and close the options:

    $(selector_for_select).selectpickerOptionsToggle();


Licence
------------------------------------------------------------
jquery.selectpicker is licenced under the MIT License.
