<template>
  <div>
    <b-modal id="agregarProducto" centered title="Nueva Orden">
      <div class="card-body">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Nombre</label>
          <div class="col-md-9">
            <input
              type="text"
              class="form-control"
              v-model="orden.nombreCliente"
            />
          </div>
        </div>
        <div class="line"></div>
        <div>
          <div class="form-group position-relative mb-0">
            <button
              type="submit"
              style="top: -3px; left: 0"
              class="position-absolute bg-white border-0 p-0"
            >
              <i class="o-search-magnify-1 text-gray text-lg"></i>
            </button>
            <input
              type="search"
              placeholder="Buscar producto..."
              class="form-control form-control-sm border-0 no-shadow pl-4"
              v-model="prodSearch"
            />
          </div>
          <div style="overflow-y: scroll; max-height: 500px">
            <table class="table card-text table-hover">
              <thead>
                <tr>
                  <th>UPC</th>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Cantidad</th>
                  <th>Descuento</th>
                  <th>Sub-Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(prod, index) in productos"
                  v-show="filtroProd(index)"
                  :key="prod.upc"
                >
                  <th>{{ prod.upc }}</th>
                  <td>{{ prod.nombreProd }}</td>
                  <td>{{ prod.nombreMarca }}</td>
                  <td>{{ prod.nombreCategoria }}</td>
                  <td>{{ dosDecimalesProd(prod.precioUnit) }}</td>
                  <td>{{ prod.stockProd }}</td>
                  <td style="padding: 0">
                    <div class="input-group" style="transform: scale(0.9)">
                      <div
                        class="input-group-prepend"
                        style="cursor: pointer; user-select: none"
                      >
                        <span
                          class="input-group-text"
                          @click="decProducto(prod)"
                          >-</span
                        >
                      </div>
                      <input
                        type="text"
                        style="padding: 0; max-width: 3rem; text-align: center"
                        :min="0"
                        :max="prod.stockProd"
                        v-model.lazy.number="prod.cantidad"
                        step="1"
                        @input="change(prod, $event)"
                        @change="change(prod, $event)"
                        class="form-control"
                      />
                      <div
                        class="input-group-append"
                        style="cursor: pointer; user-select: none"
                      >
                        <span
                          class="input-group-text"
                          @click="incProducto(prod)"
                          >+</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      style="padding: 0; max-width: 3rem; text-align: center"
                      min="0"
                      max="100"
                      v-model.lazy.number="prod.descuento"
                      step="1"
                      class="form-control"
                    />
                  </td>
                  <td>
                    {{
                      (
                        prod.precioUnit * prod.cantidad -
                        prod.precioUnit * prod.cantidad * (prod.descuento / 100)
                      ).toFixed(2)
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h6 style="margin-top: 1rem; font-weight: 900; text-align: center">
            Total: {{ orden.totalOrden.toFixed(2) }}
          </h6>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Descripción</label>
          <div class="col-md-9">
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              v-model="orden.observacionesOrden"
            ></textarea>
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Método de pago</label>
          <div class="col-md-9">
            <input
              list="metPago"
              class="form-control"
              v-model="metPagoSelected"
            />
            <datalist id="metPago">
              <option
                v-for="(met, index) in metPago"
                :id="index"
                :data-value="met.idMetodoPago"
                :key="met.idMetodo"
              >
                {{ converterIdMetPago2MetName(met.idMetodoPago) }}
              </option>
            </datalist>
          </div>
        </div>
      </div>
      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button size="m" variant="primary" @click="ok()">
          <!-- @Click="createRegistro" -->
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
    ...mapMutations("ordenes", ["getProductoSelected","change","decProducto","incProducto"]),
  },
  computed: {
    ...mapState("ordenes", ["ordSelected", "showDetOrd", "orden","metPago"]),
    ...mapState("productos", ["productos"]),
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
.roundedBorder {
  border-radius: calc(1rem - 1px) calc(1rem - 1px) 0 0;
}
</style>