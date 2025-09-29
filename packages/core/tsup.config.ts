import { exec } from 'child_process';
import { promisify } from 'util';
import { defineConfig } from 'tsup';

const execAsync = promisify(exec);

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    constants: 'src/constants.ts',
    utils: 'src/utils.ts',
    responsive: 'src/responsive.ts',
    'format-detection': 'src/format-detection.ts',
    'browser-compatibility': 'src/browser-compatibility.ts',
    types: 'src/types.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
});
