<template>
  <div class="order">
    <div id="leftSide">
      <b-avatar variant="success">
          <i class="fas fa-store"></i>
      </b-avatar>
    </div>
    <div id="rigthSide">
      <div class="orderName" v-if="orden && orden.nombreCliente">
        {{ orden.nombreCliente }}
      </div>
      <div v-if="orden && orden.fechaOrd">
        {{ orden.fechaOrd }}
      </div>
      <div v-if="orden && orden.telefono">
        {{ orden.telefono }}
      </div>
      <div v-if="orden && typeof orden.totalOrden === 'number'">
        {{ orden.totalOrden }}
      </div>
      <a href="#" @click="showModalViewDetails = true"> Ver detalles </a>
    </div>
  </div>
</template>
<script>
export default {
  props: ["orden"],
  data() {
    return {
      showModalViewDetails: false,
    };
  },
};
</script>
<style scoped>
.order {
  padding: 1rem;
  display: flex;
  align-items: center;
  margin: 1rem 0;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  background-color: #fff;
  border-radius: 1rem;
}
.orderName {
  font-size: 1rem;
  font-weight: bold;
}
#leftSide {
  width: 4rem;
  text-align: center;
}
</style>
