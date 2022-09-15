<script setup>
import { Form, Field, defineRule } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore, useUsersStore, useAlertStore } from '@/stores';
import { ref } from 'vue';

const haveAccount = ref(true)
const users = localStorage.getItem('vue-3-pinia-registration-login-example-users')

defineRule('userAlreadyExists', value => {
  for (let user in users) {
    if (user.firstName === value || user.username === value) {
      console.log('User with such Name already registered. Try another name.');
      return 'User with such Name already registered. Try another name.'
    }
  }
})

const schema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});
async function onSubmit(values, { setErrors }) {
  const authStore = useAuthStore()
  const { username, password } = values
  await authStore.login(username, password)
}

const schemaRegister = Yup.object().shape({
  firstName: Yup.string().required(''),
  username: Yup.string().required(''),
  password: Yup.string().required('')
    .min(6, 'Password must be at least 6 characters')
})
async function submitRegister(values) {
  const usersStore = useUsersStore()
  const alertStore = useAlertStore()
  const authStore = useAuthStore()
  const { username, password } = values
  try {
    await usersStore.register(values)
    await authStore.login(username, password)
    // await router.push('/');
    alertStore.success('Registration successful')
  } catch (err) {
    alertStore.error(err)
  }
}

</script>
  
<template>
  <div>
    <div v-if="haveAccount" class="form-container">
      <h2>Login</h2>
      <Form 
        @submit="onSubmit" 
        :validation-schema="schema"
        v-slot="{ errors }"
        >
        <div>
          <label>Username</label>
          <Field 
            name="username" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.username }" 
            />
        </div>
        <div >
          <label>Password</label>
          <Field 
            name="password" 
            type="password" 
            class="form-control"
            :class="{ 'is-invalid': errors.password }" 
            />
        </div>
        <div class="form-group">
          <button class="btn btn-primary" >Login </button>
          <button @click="haveAccount = !haveAccount">Have no account yet?</button>
        </div>
      </Form>
    </div>
    <div v-else class="form-container">
      <h2>Sign up</h2>
      <Form @submit="submitRegister" :validation-schema="schemaRegister"
        v-slot="{ errors }">
        <div>
          <label>Name</label>
          <Field 
            name="firstName" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.firstName }" 
            />
        </div>
        <div>
          <label>Username</label>
          <Field 
            name="username" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.username }" 
            />
        </div>
        <div class="form-group">
          <label>Password</label>
          <Field 
            name="password" 
            type="password" 
            class="form-control"
            :class="{ 'is-invalid': errors.password }" 
            />
          <div class="invalid-feedback">{{errors.password}}</div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary"> Sign up </button>
          <button @click="haveAccount = !haveAccount">Already have account?</button>
        </div>
      </Form>
    </div>
  </div>
</template>

