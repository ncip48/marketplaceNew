export const setProfileState = (name, payload) => ({
  type: 'SET_PROFILE_STATE',
  name,
  payload,
});

export const deleteAddress = (id) => ({
  type: 'DELETE_ADDRESS',
  payload: id,
});

export const updateAddress = (payload) => ({
  type: 'UPDATE_ADDRESS',
  payload,
});
