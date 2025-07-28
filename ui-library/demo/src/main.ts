import { createApp } from 'vue';
import App from './App.vue';
import '../theme/index.css';
import { BaseButton } from '../../index';

createApp(App).component('BaseButton', BaseButton).mount('#app');
