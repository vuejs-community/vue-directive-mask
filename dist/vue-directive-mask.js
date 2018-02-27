'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var maskStart = /^([^#ANX]+)/;

var format = function format(data) {
  var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (!mask.length) return data;

  if (data.length === 1 && maskStart.test(mask)) {
    data = maskStart.exec(mask)[0] + data;
  }

  var text = '';
  var cOffset = 0;

  for (var i = 0, x = 1; x && i < mask.length; i++) {
    var c = data.charAt(i - cOffset);
    var m = mask.charAt(i);

    switch (m) {
      case '#':
        /[0-9]/.test(c) ? text += c : x = 0;
        break;
      case 'A':
        /[a-z]/i.test(c) ? text += c : x = 0;
        break;
      case 'N':
        /[a-z0-9]/i.test(c) ? text += c : x = 0;
        break;
      case '?':
        cOffset++;
        break;
      case 'X':
        text += c;
        break;
      default:
        text += m;
        if (c && c !== m) {
          data = ' ' + data;
        }
        break;
    }
  }

  return text;
};

var updateMask = function updateMask(el, mask) {
  el.dataset.mask = mask;
};

var updateValue = function updateValue(el) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var value = el.value,
      _el$dataset = el.dataset,
      _el$dataset$prevValue = _el$dataset.prevValue,
      prevValue = _el$dataset$prevValue === undefined ? '' : _el$dataset$prevValue,
      mask = _el$dataset.mask;


  if (force || value && value !== prevValue && value.length > prevValue.length) {
    el.value = format(value, mask);

    var event = document.createEvent('HTMLEvents');
    event.initEvent('input', true, true);
    el.dispatchEvent(event);
  }

  el.dataset.prevValue = value;
};

var onInputListener = function onInputListener(event) {
  updateValue(event.target);
};

var maskDirective = {
  bind: function bind(el, _ref) {
    var value = _ref.value;

    updateMask(el, value);
    updateValue(el);

    el.addEventListener('keyup', onInputListener);
  },
  unbind: function unbind(el) {
    el.removeEventListener('keyup', onInputListener);
  },
  componentUpdated: function componentUpdated(el, _ref2) {
    var value = _ref2.value,
        oldValue = _ref2.oldValue;

    var isMaskChanged = value !== oldValue;
    if (isMaskChanged) {
      updateMask(el, value);
    }

    updateValue(el);

    el.removeEventListener('keyup', onInputListener);
    el.addEventListener('keyup', onInputListener);
  }
};

exports.default = {
  install: function install(Vue) {
    Vue.directive('mask', maskDirective);
  }
};
module.exports = exports['default'];
