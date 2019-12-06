const maskStart = /^([^#ANX]+)/;

const getInputElement = (element) => {
  if (element.tagName.toLocaleUpperCase() !== 'INPUT') {
    const [firstElement] = el.getElementsByTagName('input');
    if (!firstElement) {
      throw new Error('[vue-directive-mask]: v-mask directive requires input');
    }

    return firstElement;
  }

  return element;
};

const format = (data: string, mask: string = '') => {
  if (!mask.length) {
    return data;
  }

  if (data.length === 1 && maskStart.test(mask)) {
    data = maskStart.exec(mask)[0] + data;
  }

  let dataOffset = 0;
  let dataOutput = '';

  loop: for (let i = 0; i < mask.length; i++) {
    const dataChar = data.charAt(i - dataOffset);
    const maskChar = mask.charAt(i);

    switch (maskChar) {
      case '#':
        /[0-9]/.test(dataChar)
          ? dataOutput += dataChar
          : break loop;
        break;
      case 'A':
        /[a-z]/i.test(dataChar)
          ? dataOutput += dataChar
          : break loop;
        break;
      case 'N':
        /[a-z0-9]/i.test(dataChar)
          ? dataOutput += dataChar
          : break loop;
        break;
      case '?':
        dataOffset++;
        break;
      case 'X':
        dataOutput += dataChar;
        break;
      default:
        dataOutput += maskChar;
        if (dataChar && dataChar !== maskChar) {
          dataOffset--;
        }
        break;
    }
  }

  return dataOutput;
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
    const inputElement = getInputElement(el);

    updateMask(el, binding.value);
    updateValue(inputElement);

    inputElement.addEventListener('keyup', onInputListener);
  },
  unbind(el) {
    const inputElement = getInputElement(el);

    inputElement.removeEventListener('keyup', onInputListener);
  },
  componentUpdated(el, binding) {
    const inputElement = getInputElement(el);

    if (binding.value !== binding.oldValue) {
      updateMask(el, binding.value);
    }

    updateValue(inputElement);

    inputElement.removeEventListener('keyup', onInputListener);
    inputElement.addEventListener('keyup', onInputListener);
  }
};
