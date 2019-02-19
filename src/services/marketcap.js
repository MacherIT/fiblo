import axios from 'axios';

export default {
  getArs() {
    return axios({
      method: 'GET',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=ARS',
      // url: 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=ARS',
    }).then(({ data }) => {
      // COINGECKO
      if (data && data.ethereum && data.ethereum.ars) {
        return parseFloat(data.ethereum.ars);
      }
      // COINMARKETCAP
      // if (data && data[0] && data[0].price_ars) {
      //   return parseFloat(data[0].price_ars);
      // }
    });
  },
};
