const maskStart = /^([^#ANX]+)/;

const format = (data, mask = '') => {
  if (!mask.length) {
    return data;
  }

  if (data.length === 1 && maskStart.test(mask)) {
    data = maskStart.exec(mask)[0] + data;
  }

  let text = '';
  let cOffset = 0;

  for (let i = 0, x = 1; x && i < mask.length; i++) {
    let c = data.charAt(i - cOffset);
    let m = mask.charAt(i);

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

const updateMask = (element, mask) => {
  element.dataset.mask = mask;
};

const updateValue = (element, force = false) => {
  const { value, dataset: { prevValue = '', mask } } = element;

  if (force || (value && value !== prevValue && value.length > prevValue.length)) {
    element.value = format(value, mask);

    const event = document.createEvent('HTMLEvents');
    event.initEvent('input', true, true);
    element.dispatchEvent(event);
  }

  element.dataset.prevValue = value;
};

const onInputListener = (event) => {
  updateValue(event.target);
};

export default {
  install(Vue) {
    Vue.directive('mask', {
      bind(element, binding) {
        updateMask(element, binding.value);
        updateValue(element);

        element.addEventListener('keyup', onInputListener);
      },
      componentUpdated(element, binding) {
        if (binding.value !== binding.oldValue) {
          updateMask(element, binding.value);
        }

        updateValue(element);

        element.removeEventListener('keyup', onInputListener);
        element.addEventListener('keyup', onInputListener);
      },
      unbind(element) {
        element.removeEventListener('keyup', onInputListener);
      }
    });
  }
};
