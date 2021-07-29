<template>
  <div>
    <b-modal
      id="detalleOrden"
      centered
      title="Detalle Orden"
      v-model="showDetOrd"
    >
      <div class="card-body">
        <div class="row">
          <div class="column">
            <h5>Id de la orden:</h5>
            <p>{{ ordSelected.idOrden }}</p>
          </div>
          <div class="column">
            <h5>Fecha:</h5>
            <p>{{ ordSelected.fechaOrd }}</p>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <h5>Nombre del cliente:</h5>
            <p>{{ ordSelected.nombreCliente }}</p>
          </div>
          <div class="column">
            <h5>Método de pago:</h5>
            <p>{{ ordSelected.metodoPago }}</p>
          </div>
        </div>
        <div class="line"></div>
        <div>
          <b-card no-body class="text-center">
            <div class="bg-success text-light roundedBorder">
              <h4>
                <b>Productos:</b>
              </h4>
            </div>
          </b-card>
          <!-- tabla de productos -->
          <b-table
            striped
            hover
            :items="ordSelected.productos"
            :fields="headerLabels"
          ></b-table>
        </div>
        <h6 style="margin-top: 1rem; font-weight: 900; text-align: center">
          Total: {{ ordSelected.totalOrden }}
        </h6>
        <div class="line"></div>
        <div class="row">
          <div class="column">
            <h5>Descripción:</h5>
          </div>
          <div class="column">
            <p>{{ ordSelected.observacionesOrden }}</p>
          </div>
        </div>
        <div class="line"></div>
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button size="m" variant="primary" @click="ok()">
          Efectuar Cambios
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "DetalleOrden",
  data() {
    return {
      headerLabels: [
        { key: "upc", label: "UPC" },
        { key: "nombreProd", label: "Nombre" },
        { key: "nombreMarca", label: "Marca" },
        { key: "nombreCategoria", label: "Categoria" },
        { key: "precioUnit", label: "Precio unitario" },
        "cantidad",
        "descuento",
        {
          key: "total",
          label: "Total",
          formatter: (a, b, item) => {
            return (
              item.cantidad * item.precioUnit -
              item.cantidad * item.precioUnit * (item.descuento / 100)
            ).toFixed(2);
          },
        },
      ],
    };
  },
  methods: {
    ...mapMutations("ordenes", ["getProductoSelected"]),
  },
  computed: {
    ...mapState("ordenes", ["ordSelected", "showDetOrd"]),
  },
};
</script>

<style scoped>
::v-deep .modal-dialog {
  max-width: 100% !important;
  height: 100%;
  margin: 0;
  padding: 0 !important;

  overflow-y: initial !important;
}

::v-deep .modal-content {
  height: 100% !important;
}
::v-deep .modal-body {
  height: 80vh;
  overflow-y: auto;
}
::v-deep .bg-success {
  background-image: radial-gradient(
    circle farthest-corner at 50.4% 50.5%,
    #0eae57 0%,
    rgb(0 123 57) 90%
  );
}
::v-deep .modal-header {
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
}
::v-deep .modal-footer {
  box-shadow: 0.125rem -0.8rem 20px 0px rgb(0 0 0 / 10%);
}
::v-deep .modal-title {
  padding-left: 2.5rem;
}
::v-deep .bg-warning {
  background-image: radial-gradient(
    circle farthest-corner at 50.4% 50.5%,
    #ff7600fd 0%,
    #c34600 90%
  );
}
::v-deep .bg-danger {
  background-image: radial-gradient(
    circle farthest-corner at 50.4% 50.5%,
    rgb(255 0 0) 0%,
    #870223 90%
  );
}
.roundedBorder {
  border-radius: calc(1rem - 1px) calc(1rem - 1px) 0 0;
}
/* fila con 2 columnas */
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 45%;
  margin-left: 1.5rem;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>