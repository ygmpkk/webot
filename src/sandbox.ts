import { NodeVM } from 'vm2';

const options: any = {
  console: 'inherit',
  timeout: 1000 * 60,
  eval: false,
  wasm: false,
  sandbox: {},
  require: {
    external: {
      modules: ['request', 'request-promise', 'lodash', 'moment'],
    },
    builtin: ['crypto'],
  },
};

export const sandbox = new NodeVM(options);

// /**
//  * @param context - hook conext
//  * @param context.order - borrower applied order
//  * @param context.partner - api parnter
//  * @returns Promise<{headers, body}> - response's header and body
//  */

// const rp = require('request-promise-native');
// const moment = require('moment');
// module.exports = async function(context) {
//   const { headers, body } = await rp({
//     uri: 'https://staging.api.hilyeah.cn/pi',
//     json: true,
//     resolveWithFullResponse: true,
//   });
//   return { headers, body };
// };
