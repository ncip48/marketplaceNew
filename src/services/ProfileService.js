import {generateHeaders, baseRequest} from './config';

export default {
  async getProfile() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/profiles`, config);
  },
  async updateToken(payload) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.patch(`/api/v1/profile/token`, {...payload}, config);
  },
  async updateProfile(payload) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.patch(`/api/v1/profile`, {...payload}, config);
  },
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
  async updateCart(id, payload) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.patch(`/api/v1/cart/${id}`, {...payload}, config);
  },
  async deleteCart(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.delete(`/api/v1/cart/${id}`, config);
  },
  async getFavorit() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/favourite`, config);
  },
  async deleteFavorit(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.delete(`/api/v1/favourite/${id}`, config);
  },
};
