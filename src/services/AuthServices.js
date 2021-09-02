import {generateHeaders, baseRequest} from './config';

export default {
  async loginAction(payload) {
    const config = await generateHeaders(['content-json']);
    return baseRequest.post(`/api/v1/auth/login`, {...payload}, config);
  },
};
