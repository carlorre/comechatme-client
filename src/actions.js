export const newUser = (username) => ({
  type: 'NEWUSER',
  username,
});

export const logout = () => ({
  type: 'LOGOUT',
});
