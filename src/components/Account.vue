<template>
  <div>
    <div class="col-md-8">
    </div>
    <div>
      <div class="d-flex justify-content-between py-2">
        <h4>Account Info</h4>
        <b-button v-b-modal.modal-form @click="currentMode='add';resetModal()">Create</b-button>
      </div>
      
        <table class="table">
        <thead>
          <tr>
            <th scope="col">Option name</th>
            <th scope="col">Option value</th>
            <th scope="col">Platform name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(account, index) in currentAccount"
            :key="index"
          >
            <td>{{ account.optionName }}</td>
            <td>{{ account.optionValue }}</td>
            <td>{{ account.platformName }}</td>
            <td><button type="button" class="btn btn-default" @click="showModal(account)">Edit</button> <button type="button" class="btn btn-danger" @click="deleteModal(account.rooftopGoogleOptionId, index)">Delete</button></td>
          </tr>
        </tbody>
      </table>

       <b-modal
        id="modal-alert"
        ref="alert-modal"
        title="Alert!"
        @ok="deleteAccount"
      >
          Are you sure about removing this record?
      </b-modal>

      <b-modal
        id="modal-form"
        ref="my-modal"
        title="Account details"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <b-form ref="accountInfoForm" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Dot digital id"
            label-for="dot-input"
            v-bind:invalid-feedback="dotDigitalId=== true ? 'Dot digital id is required' : ''"
            :state="idState"
            v-if="currentMode==='add'"
            required
          >
            <b-form-input
              id="dot-input"
              v-model="currentState.dotDigitalId"
              :state="idState"
              required
            >
            </b-form-input>
            <b-form-invalid-feedback v-if="idState===true" :state="dotDigitalId">
              Invalid dot digital id.
            </b-form-invalid-feedback>
          </b-form-group>

            <b-form-group
              label="Option name"
              label-for="name-input"
              v-bind:invalid-feedback="Option === true ? 'Option name is required' : ''"
              :state="nameState"
              required
            >
            <b-form-input
              id="name-input"
              v-model="currentState.optionName"
              :state="nameState"
              required
            >
            </b-form-input>
            <b-form-invalid-feedback v-if="nameState===true" :state="Option">
              Name already exists.
            </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              label="Option value"
              label-for="value-input"
              invalid-feedback="Option value is required"
              :state="valueState"
              required
            >
            <b-form-input
              id="value-input"
              v-model="currentState.optionValue"
              :state="valueState"
              required
            ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Platform name"
              label-for="platform-input"
              invalid-feedback="Platform name is required"
              :state="platformState"
              required
            >
            <b-form-input
              id="feedback-input"
              v-model="currentState.platformName"
              :state="platformState"
              required
            ></b-form-input>
            </b-form-group>
          
        </b-form>
      </b-modal>
    </div>
    
  </div>
</template>

<script>
import BaseRequestProvider from "../services/BaseRequestProvider";

export default {
  name: "tutorial",
  data() {
    return {
      currentAccount: [],
      message: '',
      currentMode: '',
      nameState: null,
      idState: null,
      valueState: null,
      platformState: null,
      Option: true,
      currentId: '',
      currentIdIndex: null,
      dotDigitalId: true,
      currentState : {
        googleId: this.$route.params.id,
        dotDigitalId: 0,
        optionName: '',
        optionValue: '',
        platformName: '',
      }
    };
  },
  methods: {
    getAccount(id) {
      BaseRequestProvider.get(id)
        .then(response => {
          this.currentAccount = response.data.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    showModal(account) {
      this.currentMode = 'edit';
      this.nameState = null;
      this.idState = null;
      this.valueState = null;
      this.platformState = null;
      this.dotDigitalId = true;
      this.Option = true;
      this.currentId = account.rooftopGoogleOptionId;
      this.currentState = {
        googleId: account.googleId,
        dotDigitalId: account.googleId,
        optionName: account.optionName,
        optionValue: account.optionValue,
        platformName: account.platformName
      }
      this.$refs['my-modal'].show()
    },

    handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },

    resetModal() {
        this.nameState = null;
        this.idState = null;
        this.valueState = null;
        this.platformState = null;
        this.dotDigitalId = true;
        this.Option = true;
        this.currentState = {
        googleId: this.$route.params.id,
        dotDigitalId: '',
        optionName: '',
        optionValue: '',
        platformName: '',
      }
    },

    hideModal() {
      this.$refs['my-modal'].hide()
    },

    handleSubmit() {
      this.nameState = this.currentState.optionName!==''??false
      this.idState = this.currentState.dotDigitalId!==''??false
      this.valueState = this.currentState.optionValue!==''??false
      this.platformState = this.currentState.platformName!==''??false
      if(this.nameState && this.idState && this.valueState && this.platformState) {
        if(this.currentMode==='edit') {
          this.updateAccount()
        } else {
          this.createAccount()
        }
      }
    },

    createAccount() {
      BaseRequestProvider.create(this.currentState)
        .then(response => {
          console.log(response.data);
          this.getAccount(this.$route.params.id);
          this.hideModal()
          this.makeToast('Record added successfully', 'Success', 'success')
        })
        .catch((error) => {
          if(error.response.status === 422) {
            error.response.data.data.forEach(details => {
              if(details.field === 'dotDigitalId') {
              this.dotDigitalId = false;
              this.idState = false;
            } else if (details.field === 'Option') {
              this.Option = false;
              this.optionName = false;
            }
            });
            return;
          }
          this.makeToast('Please try again', 'Unexpected Error', 'danger')
        });
    },

    updateAccount() {
      BaseRequestProvider.update(this.currentId, this.currentState)
        .then(response => {
          console.log(response.data);
          this.getAccount(this.$route.params.id);
          this.hideModal()
          this.makeToast('Record updated successfully', 'Success', 'success')
        })
        .catch((error) => {
          console.log(error);
          this.makeToast('Please try again with updated values', 'Unexpected Error', 'danger')
        });
    },

    deleteModal(id, index) {
      this.currentId = id;
      this.currentIdIndex = index;
      this.$refs['alert-modal'].show()
    },

    spliceRow() {
      this.currentAccount.splice(this.currentIdIndex, 1);
      this.currentId = null;
      this.currentIdIndex = null;
    },

    deleteAccount() {
      BaseRequestProvider.delete(this.currentId)
        .then(response => {
          console.log(response.data);
          this.spliceRow();
          this.makeToast('Record deleted successfully', 'Success', 'success')
        })
        .catch(e => {
          console.log(e);
          this.makeToast('Unexpected Error', '', 'danger')
        });
    },
    
    makeToast(message, title='' ,variant = null) {
      if(message==='') return;
        this.$bvToast.toast(message, {
          title: title,
          autoHideDelay: 5000,
          variant: variant,
          solid: true,
        })
      },
  },
  mounted() {
    this.message = '';
    this.getAccount(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>
