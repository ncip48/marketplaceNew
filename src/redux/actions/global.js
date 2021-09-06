import {handleFetchError} from '../../helpers';

export const setGlobalLoading = payload => ({
  type: 'GLOBAL_LOADING',
  payload,
});
export const setFullscreenLoading = payload => ({
  type: 'FULLSCREEN_LOADING',
  payload,
});

export const _fetch =
  (request, useLoading = true) =>
  dispatch => {
    if (useLoading) dispatch(setFullscreenLoading(true));
    return request
      .then(res => {
        const data = res.data || res.body;
        if (data?.status == 200) {
          console.log(res?.config?.url, data);
          return data || res;
        } else {
          return handleFetchError(data?.error, res?.config?.url);
        }
      })
      .catch(err => handleFetchError(err))
      .finally(() => useLoading && dispatch(setFullscreenLoading(false)));
  };

export const _fetch_noerror =
  (request, useLoading = true) =>
  dispatch => {
    if (useLoading) dispatch(setFullscreenLoading(true));
    return request
      .then(res => {
        const data = res.data || res.body;
        console.log(res?.config?.url, data);
        return data || res;
      })
      .catch(err => handleFetchError(err))
      .finally(() => useLoading && dispatch(setFullscreenLoading(false)));
  };
