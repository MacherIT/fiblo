import axios from 'axios';
import moment from 'moment';

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
      return 1;
      // COINMARKETCAP
      // if (data && data[0] && data[0].price_ars) {
      //   return parseFloat(data[0].price_ars);
      // }
    });
  },
  getArsAtDate(atDate) {
    return axios({
      method: 'GET',
      url: `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${moment(atDate).format(
        'DD-MM-YYYY',
      )}`,
      // url: 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=ARS',
    }).then(({ data }) => {
      // COINGECKO
      if (
        data &&
        data.market_data &&
        data.market_data.current_price &&
        data.market_data.current_price.ars
      ) {
        return parseFloat(data.market_data.current_price.ars);
      }
      return 1;
      // COINMARKETCAP
      // if (data && data[0] && data[0].price_ars) {
      //   return parseFloat(data[0].price_ars);
      // }
    });
  },
};
