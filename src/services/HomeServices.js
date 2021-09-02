import {generateHeaders, baseRequest} from './config';

export default {
  async getHome() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/homepage`, config);
  },
  // async getProduct() {
  //   const config = await generateHeaders(['content-json', 'authorization']);
  //   return baseRequest.get(`/api/v1/products`, config);
  // },
  // async getBanner() {
  //   const config = await generateHeaders(['content-json', 'authorization']);
  //   return baseRequest.get(`/api/v1/banners`, config);
  // },
};
