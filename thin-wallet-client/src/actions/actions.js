import * as types from './actionsType';

export const updateNonce = data => ({
    type: types.UPDATE_NONCE,
    payload: { data },
});

export const updateState = data => ({
    type: types.UPDATE_STATE,
    payload: { data },
})
