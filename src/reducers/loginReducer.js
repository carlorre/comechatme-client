const loginReducer = (state = null, action) => {
  switch (action.type) {
    case 'NEWUSER':
      return action.username;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export default loginReducer;
