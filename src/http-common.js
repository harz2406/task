import axios from "axios";

export default axios.create({
  baseURL: "https://services.metricsamsi.com/v1.0/dealers",
  headers: {
    "Content-type": "application/json"
  }
});
