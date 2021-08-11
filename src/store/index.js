import Vue from 'vue'
import Vuex from 'vuex'
import categorias from "./modules/categorias.js";
import productos from "./modules/productos.js";
import marcas from "./modules/marcas.js";
import ordenes from "./modules/ordenes.js";
import VueQuagga from 'vue-quaggajs';

Vue.use(Vuex)
// register component 'v-quagga'
Vue.use(VueQuagga);


export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    categorias,
    productos,
    marcas,
    ordenes,
  }
})