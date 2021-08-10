<template>
  <div id="app">
    <Header @toggleSideBar="isLeftSideBar = !isLeftSideBar"></Header>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <transition name="fade"
      ><div class="fondoNegro" v-if="isLeftSideBar" @click="isLeftSideBar = false"></div>
    </transition>

    <div class="d-flex align-items-stretch">
      <transition name="side-in">
        <LeftSideBar v-if="isLeftSideBar"></LeftSideBar>
      </transition>
      <router-view />
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import LeftSideBar from "@/components/Left-SideBar.vue";

export default {
  name: "App",
  components: {
    Header,
    LeftSideBar,
  },
  data() {
    return {
      isLeftSideBar: false,
    };
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