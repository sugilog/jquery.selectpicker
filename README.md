jquery.selectpicker
========================================

jquery plugin to change select box to searchable select box


Options
------------------------------------------------------------
- onChange
  - [function] onChange callback.
   - callback specification
     - "this" has selectpicker caller
     - "arguments" have "value" and "label" of changed (selected) item.


Example
------------------------------------------------------------

- select#select_prefecture

JavaScript:
    $("#select_prefecture").selectpicker({
      onChange: function(value, label) {
        console.log(this);
        console.log(label + ": " + value);
      }
    });


Utility Methods
------------------------------------------------------------

make enable selectpicker widget:
    $(selector).selectpickerEnable();

make disable selectpicker widget:
    $(selector).selectpickerDisable();

toggle open and close the options:
    $(selector).selectpickerOptionsToggle();


Licence
------------------------------------------------------------
jquery.selectpicker is licenced under the MIT License.
