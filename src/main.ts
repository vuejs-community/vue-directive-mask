import { VueConstructor } from 'vue';
import { version } from '../package.json';
import { maskDirective } from './directives/mask';

export { maskDirective } from './directives/mask';

export default {
  install(Vue: VueConstructor): void {
    Vue.directive('mask', maskDirective);
  },
  version
};
