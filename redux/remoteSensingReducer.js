import { RECEIVE_TODOS, SAVE_USER } from "../redux/remoteSensingActions";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case RECEIVE_TODOS:
      return {
        ...state,
        batchList: payload
      };

    default:
      return state;
  }
};
