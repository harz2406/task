import http from "../http-common";
import { AUTH_KEY} from '../common';

class BaseRequestProvider {
  getAccounts() {
    return http.get(`/Accounts/Google?apiKey=${AUTH_KEY}`);
  }

  get(id) {
    return http.get(`/Options/${id}?apiKey=${AUTH_KEY}`);
  }

  create(data) {
    return http.post(`/Options?apiKey=${AUTH_KEY}`, data);
  }

  update(id, data) {
    return http.patch(`Options/${id}?apiKey=${AUTH_KEY}`, data);
  }

  delete(id) {
    return http.delete(`/Options/${id}?apiKey=${AUTH_KEY}`);
  }
}

export default new BaseRequestProvider();
