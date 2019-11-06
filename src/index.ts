import { VueConstructor } from 'vue';
import { version } from '../package.json';

const maskStart = /^([^#ANX]+)/;

const getInputElement = (element: HTMLElement): HTMLInputElement => {
  if (element.tagName.toLocaleUpperCase() === 'INPUT') {
    return element as HTMLInputElement;
  }

  const inputElements = element.getElementsByTagName('input');
  if (inputElements.length === 0) {
    throw new Error('[vue-directive-mask]: v-mask directive requires input');
  }

  return inputElements[0];
};

const format = (data: string, mask: string = ''): string => {
  if (!mask.length) {
    return data;
  }

  if (data.length === 1 && maskStart.test(mask)) {
    data = maskStart.exec(mask)[0] + data;
  }

  let dataOffset = 0;
  let dataOutput = '';

  loop: for (let i = 0; i < mask.length; i++) {
    const dataChar = data.charAt(i + dataOffset);
    const maskChar = mask.charAt(i);

    switch (maskChar) {
      case '#':
        if (/[0-9]/.test(dataChar)) {
          dataOutput += dataChar;
          break;
        }

        break loop;
      case 'A':
        if (/[a-z]/i.test(dataChar)) {
          dataOutput += dataChar;
          break;
        }

        break loop;
      case 'N':
        if (/[a-z0-9]/i.test(dataChar)) {
          dataOutput += dataChar;
          break;
        }

        break loop;
      case '?':
        dataOffset++;
        break;
      case 'X':
        dataOutput += dataChar;
        break;
      default:
        dataOutput += maskChar;
        if (dataChar && dataChar !== maskChar) {
          dataOffset++;
        }
        break;
    }
  }

  return dataOutput;
};

const updateMask = (element: HTMLInputElement, mask: string): void => {
  element.dataset.mask = mask;
};

const updateValue = (element: HTMLInputElement, force: boolean = false): void => {
  const { value, dataset: { prevValue = '', mask } } = element;

  if (force || (value && value !== prevValue && value.length > prevValue.length)) {
    element.value = format(value, mask);

    const event = document.createEvent('HTMLEvents');
    event.initEvent('input', true, true);
    element.dispatchEvent(event);
  }

  element.dataset.prevValue = value;
};

const onInputListener = (event: KeyboardEvent): void => {
  updateValue(event.target as HTMLInputElement);
};

export const maskDirective = {
  bind(element: HTMLElement, binding) {
    const inputElement = getInputElement(element);

    updateMask(inputElement, binding.value);
    updateValue(inputElement);

    inputElement.addEventListener('keyup', onInputListener);
  },
  componentUpdated(element: HTMLElement, binding) {
    const inputElement = getInputElement(element);

    if (binding.value !== binding.oldValue) {
      updateMask(inputElement, binding.value);
    }

    updateValue(inputElement);

    inputElement.removeEventListener('keyup', onInputListener);
    inputElement.addEventListener('keyup', onInputListener);
  },
  unbind(element: HTMLElement) {
    const inputElement = getInputElement(element);

    inputElement.removeEventListener('keyup', onInputListener);
  }
}

export default {
  install(Vue: VueConstructor): void {
    Vue.directive('mask', maskDirective);
  },
  version
};
