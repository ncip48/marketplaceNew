import {generateHeaders, baseRequest} from './config';

export default {
  async createCheckout(payload) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.post(`/api/v1/orders`, {...payload}, config);
  },

  async getMyOrder() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/orders`, config);
  },

  async getMyOrderDetail(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/order/${id}`, config);
  },
};
