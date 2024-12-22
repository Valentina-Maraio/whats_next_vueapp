import Vue from 'vue';
import App from './App.vue';
import store from '../store';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'


Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
  PrimeVue,
  theme: {preset: Aura}
}).$mount('#app');
