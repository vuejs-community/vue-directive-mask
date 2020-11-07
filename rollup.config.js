import rollupPluginJson from '@rollup/plugin-json';
import rollupPluginTypeScript from '@wessberg/rollup-plugin-ts';

export default {
  input: './src/vue-directive-mask.ts',
  output: [
    {
      exports: 'named',
      file: 'dist/vue-directive-mask.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      exports: 'named',
      file: 'dist/vue-directive-mask.cjs.js',
      format: 'commonjs',
      sourcemap: true
    },
    {
      exports: 'named',
      file: 'dist/vue-directive-mask.umd.js',
      format: 'umd',
      name: 'VueFilterDateFormat',
      sourcemap: true
    }
  ],
  plugins: [
    rollupPluginJson(),
    rollupPluginTypeScript()
  ]
};
