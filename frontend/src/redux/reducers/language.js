const initialState = {
    lang: localStorage.getItem("lang") || "eng",
};

export default function languageReducer(state = initialState, action) {
  switch (action.type) {
    case "set_language":
      localStorage.setItem("lang", action.payload);
      return {
        ...state,
        lang: action.payload,
      };
    default:
      return state;
  }
}
