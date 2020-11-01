'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, '__esModule', { value: true });

const hash_sum_1 = __importDefault(require('hash-sum'));
const IS_SETUP_RE = /export function setup/;

function loader(source) {
  const loaderContex = this,
    { resourcePath } = loaderContex,
     //@ TODO: this regexp could be nicer
    { index } = source.match(/(?<=export.*)\r?\n/),
    id = hash_sum_1.default(resourcePath),
    isSetup = IS_SETUP_RE.test(source),
    code = isSetup
      ? `const ctx = useSSRContext();
        ctx._registeredComponents.push(${JSON.stringify(id)});`
      : ` beforeCreate: function() {
          const ctx = useSSRContext();
          ctx._registeredComponents.push(${JSON.stringify(id)})
        },`;

  return (
    'import { useSSRContext } from "vue";\n' +
    [source.slice(0, index + 1), code, source.slice(index + 1)].join(' ')
  );
}

exports.default = loader;
