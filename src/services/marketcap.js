import axios from "axios";
import moment from "moment";

import fiblo from "./fiblo";

const getNetVer = () =>
  new Promise((resolve, reject) => {
    fiblo.getNetworkVersion((error, netVer) => {
      if (error) {
        console.error(error);
        resolve(-1);
      } else {
        resolve(netVer);
      }
    });
  });

export default {
  async getArs() {
    const netVer = await getNetVer();
    const currency = netVer != 31 && netVer != 33 ? "ethereum" : "bitcoin";

    return axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=ARS`
    }).then(({ data }) => {
      if (data && data[currency] && data[currency].ars) {
        return parseFloat(data[currency].ars);
      }
      return 1;
    });
  },
  async getArsAtDate(atDate) {
    const netVer = await getNetVer();
    const currency = netVer != 31 && netVer != 33 ? "ethereum" : "bitcoin";

    return axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/${currency}/history?date=${moment(
        atDate
      ).format("DD-MM-YYYY")}`
    }).then(({ data }) => {
      if (
        data &&
        data.market_data &&
        data.market_data.current_price &&
        data.market_data.current_price.ars
      ) {
        return parseFloat(data.market_data.current_price.ars);
      }
      return 1;
    });
  }
};
