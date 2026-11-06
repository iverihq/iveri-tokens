import { node } from '@iveri/eslint-config';

export default [...node, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } }];
