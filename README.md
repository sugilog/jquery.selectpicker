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
</dl>


example:

    $(selector_for_select).selectpicker({
      onPick: function(value, label) {
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
