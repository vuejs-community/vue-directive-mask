# @vuejs-community/vue-directive-mask
Simple mask input directive for Vue.js

## Installation

install from npm
```bash
$ npm install @vuejs-community/vue-directive-mask
```
and register in you Vue app
```js
import Vue from 'vue';
import VueDirectiveMask from '@vuejs-community/vue-directive-mask';

Vue.use(VueDirectiveMask);
```

## Usage

```html
<template>
  <div>
    <!-- Russian date format -->
    <input type="text" v-mask="'##.##.####'">
    <!-- Russian phone format -->
    <input type="tel" v-mask="'+7 (###) ###-##-##'">
  </div>
</template>
```

## Format Options

| Key | Type                    |
| --- | ----------------------- |
| `#` | Number                  |
| `A` | Latin letter            |
| `N` | Number and latin letter |
| `X` | Any                     |

## License

MIT © [Vue.js Community](https://github.com/vuejs-community)
