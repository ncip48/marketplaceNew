import {generateHeaders, baseRequest} from './config';

export default {
  async getProvince() {
    const config = await generateHeaders(['content-json']);
    return baseRequest.get(`/api/v1/province`, config);
  },
  async getCities() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/cities`, config);
  },
  async getCity(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/city/${id}`, config);
  },
};
