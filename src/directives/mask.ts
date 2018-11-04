const maskStart = /^([^#ANX]+)/;

const format = (data: string, mask: string = '') => {
  if (!mask.length) {
    return data;
  }

  if (data.length === 1 && maskStart.test(mask)) {
    data = maskStart.exec(mask)[0] + data;
  }

  let text = '';
  let cOffset = 0;

  for (let i = 0, x = 1; x && i < mask.length; i++) {
    const c = data.charAt(i - cOffset);
    const m = mask.charAt(i);

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

const updateMask = (el, mask: string) => {
  el.dataset.mask = mask;
};

const updateValue = (el, force: boolean = false) => {
  const { value, dataset: { prevValue = '', mask } } = el;

  if (force || (value && value !== prevValue && value.length > prevValue.length)) {
    el.value = format(value, mask);

    const event = document.createEvent('HTMLEvents');
    event.initEvent('input', true, true);
    el.dispatchEvent(event);
  }

  el.dataset.prevValue = value;
};

const onInputListener = (event) => {
  updateValue(event.target);
};

export const maskDirective = {
  bind(el, binding) {
    updateMask(el, binding.value);
    updateValue(el);

    el.addEventListener('keyup', onInputListener);
  },
  unbind(el) {
    el.removeEventListener('keyup', onInputListener);
  },
  componentUpdated(el, binding) {
    if (binding.value !== binding.oldValue) {
      updateMask(el, binding.value);
    }

    updateValue(el);

    el.removeEventListener('keyup', onInputListener);
    el.addEventListener('keyup', onInputListener);
  }
};
