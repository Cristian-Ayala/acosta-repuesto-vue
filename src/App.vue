<template>
  <div id="app">
    <InstallPrompt />
    <Header @toggleSideBar="isLeftSideBar = !isLeftSideBar" />

    <div class="d-flex align-items-stretch">
    <transition name="fade"
      ><div
        class="fondoNegro"
        v-if="isLeftSideBar"
        @click="isLeftSideBar = false"
      ></div>
    </transition>
      <transition name="side-in">
        <LeftSideBar v-if="isLeftSideBar" />
      </transition>
      <router-view />
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import LeftSideBar from "@/components/Left-SideBar.vue";
import InstallPrompt from "@/components/InstallPrompt.vue";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Header,
    LeftSideBar,
    InstallPrompt,
  },
  data() {
    return {
      isLeftSideBar: false,
    };
  },
  methods: {
    ...mapActions("marcas", ["initDB"]),
    ...mapActions("categorias", ["initDbCategorias"]),
  },
  created() {
    console.log("App.vue se instanció");
    this.initDB();
    this.initDbCategorias();
  },
};
</script>
<style scoped>
.fondoNegro {
  position: fixed;
  background: #00000059;
  height: 100%;
  width: 100%;
  z-index: 20;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>