export default {
  login(email, password, callback) {
    return window.App.$http({
      method: 'POST',
      url: '/api/usuarios/login',
      body: { email, password },
    }).then(
      res => {
        localStorage.setItem('@fibloST:usuario', res.data.token);
        callback(null, res);
      },
      error => {
        callback(error, null);
      },
    );
  },
  logout() {
    localStorage.removeItem('@fibloST:usuario');
  },
};
