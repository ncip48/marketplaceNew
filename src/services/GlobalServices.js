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
  async uploadPhoto(payload) {
    const config = await generateHeaders(['content-formdata']);
    var formData = new FormData();
    formData.append('image', {
      uri: payload.uri,
      name: payload.fileName,
      type: payload.type,
    });
    // var config = {
    //   onUploadProgress: function (progressEvent) {
    //     var percentCompleted = Math.round(
    //       (progressEvent.loaded * 100) / progressEvent.total,
    //     );
    //     console.log(percentCompleted);
    //   },
    // };
    return baseRequest.post(`/api/v1/image_upload`, formData, config);
  },
};
