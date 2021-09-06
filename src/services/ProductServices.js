import {generateHeaders, baseRequest} from './config';

export default {
  async getProductPaginate(page) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/products?page=${page}`, config);
  },
  async getAllProduct() {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/products/all`, config);
  },
  async getDetailProduct(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.get(`/api/v1/product/${id}`, config);
  },
  async addFavorite(payload) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.post(`/api/v1/favourite`, {...payload}, config);
  },
  async removeFavorite(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.delete(`/api/v1/favourite/${id}`, config);
  },
  async removeFavoriteByProduct(id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.delete(`/api/v1/favourite_product/${id}`, config);
  },
  async addCart(payload, id) {
    const config = await generateHeaders(['content-json', 'authorization']);
    return baseRequest.post(`/api/v1/cart/${id}`, {...payload}, config);
  },
};
