import {generateHeaders, baseRequest} from './config';

export default {
  async getAddress() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/profile/address`, config);
  },
  async addAddress(payload) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.post(`/api/v1/profile/address`, {...payload}, config);
  },
  async editAddress(payload, id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.patch(
      `/api/v1/profile/address/${id}`,
      {...payload},
      config,
    );
  },
  async deleteAddress(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.delete(`/api/v1/profile/address/${id}`, config);
  },
  async getCart() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/cart`, config);
  },
  async getFavorit() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/favourite`, config);
  },
};
