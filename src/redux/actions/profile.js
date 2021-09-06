export const setProfileState = (name, payload) => ({
  type: 'SET_PROFILE_STATE',
  name,
  payload,
});

export const deleteAddress = id => ({
  type: 'DELETE_ADDRESS',
  payload: id,
});

export const updateAddress = payload => ({
  type: 'UPDATE_ADDRESS',
  payload,
});

export const updateCart = payload => ({
  type: 'UPDATE_CART',
  payload,
});

export const deleteCart = id => ({
  type: 'DELETE_CART',
  payload: id,
});

export const deleteFavorit = id => ({
  type: 'DELETE_FAVORIT',
  payload: id,
});
