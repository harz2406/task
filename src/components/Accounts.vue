<template>
  <div>
    <div class="col-md-8">
    </div>
    <div>
      <h4>Google account list</h4>
        <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Id</th>
            <th scope="col">created by</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="list"
            v-for="(account, index) in accounts"
            :key="index"
            @click="viewAccount(account.googleId)"
          >
            
            <td>{{ account.viewName }}</td>
            <td>{{ account.viewId }}</td>
            <td>{{ account.createdBy }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import BaseRequestProvider from "../services/BaseRequestProvider";

export default {
  name: "account-list",
  data() {
    return {
      accounts: [],
      title: ""
    };
  },
  methods: {
    retrieveTutorials() {
      BaseRequestProvider.getAccounts()
        .then(response => {
          this.accounts = response.data.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    viewAccount(googleId) {
      this.$router.push(`/accounts/${googleId}`);
    }
  },
  mounted() {
    this.retrieveTutorials();
  }
};
</script>

<style>
.list {
  cursor: pointer;
}
</style>
