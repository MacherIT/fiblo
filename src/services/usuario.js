export default {
  login(email, password) {
    return window.App.$http({
      method: 'POST',
      url: '/api/usuarios/login',
      body: { email, password },
    }).then(res => {
      localStorage.setItem('@fibloST:usuario', res.data.token);
      return res;
    });
  },
  logout() {
    localStorage.removeItem('@fibloST:usuario');
  },
};
