<template>
  <tr class="d-flex w-100 justify-content-between">
    <td class="imgCenter">
      <img :src="prod.doc.foto" height="50px" width="50px" />
    </td>
    <td>
      <div class="h-100">
        <p class="align-self-center" v-html="prod.highlighting.nombreProd"></p>
        <h6 style="color: #009722">${{ prod.doc.precioPublico }}</h6>
        Stock: {{ prod.doc.stockProd }}
        <div v-if="ordenDetalleProductos[prod.doc.upc] !== undefined">
            <p>Cantidad: {{ ordenDetalleProductos[prod.doc.upc].cantidad }}</p>
            <p>Subtotal: ${{ ordenDetalleProductos[prod.doc.upc].subtotal }}</p>
        </div>
      </div>
    </td>
    <td
      class="tdVerdeClick"
      v-on:click="$emit('addTmpProducts', prod.doc, true, index)"
    >
      <div class="add">
        <i
          class="fas"
          :class="
            ordenDetalleProductos[prod.doc.upc] !== undefined
              ? 'fa-check'
              : 'fa-plus'
          "
        ></i>
      </div>
    </td>
  </tr>
</template>
<script>
// import { mapState, mapMutations } from "vuex";

export default {
  name: "FindProductos",
  props: ["prod", "index", "ordenDetalleProductos"],
  //   data() {
  //     return {
  //       ordenDetalleProductos: {},
  //     };
  //   },
  //   methods: {
  //     ...mapMutations("ordenes", [
  //       "change",
  //       "decProducto",
  //       "incProducto",
  //       "filtroProd",
  //       "dosDecimalesProd",
  //     ]),
  //   },
  //   computed: {
  //     ...mapState("ordenes", [
  //       "ordSelected",
  //       "showDetOrd",
  //       "orden",
  //       "metPago",
  //       "prodSearch",
  //       "searchTotalRows",
  //       "findProductos",
  //       "currentPage",
  //     ]),
  //     ...mapState("productos", ["productos"]),
  //   },
};
</script>
<style scoped>
.imgCenter {
  align-self: center;
  border: none;
}
.tdVerdeClick {
  background-color: #28a745;
  border-radius: 0 1rem 1rem 0;
  color: #fff;
}
.add {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>