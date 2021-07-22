<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem; margin-bottom: 3rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Productos
            </h6>
            <b-button variant="success" v-on:click="addProd(tab)">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </b-button>
          </div>
          <div class="card-body">
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
                v-model="searchDisplay"
                placeholder="Buscar producto..."
                class="form-control form-control-sm border-0 no-shadow pl-4"
                style="width: 50%; display: inline"
              />
              <b-button
                v-b-modal.verifyModifications
                variant="success"
                style="float: right"
                v-if="applyChanges"
              >
                Aplicar Cambios
              </b-button>
            </div>

            <b-nav tabs fill>
              <b-nav-item
                v-for="cat in catActivas"
                :key="cat.nombreCat"
                :active="tab === cat.nombreCat"
                @click="tab = cat.nombreCat"
                >{{ cat.nombreCat }}</b-nav-item
              >
            </b-nav>
            <!-- Tabla para nuevos productos -->
            <table class="table card-text table-hover">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(prod, index) in newProd"
                  v-show="
                    filtro(index) &&
                    prod.nombreCategoria === tab &&
                    prod.activoProd
                  "
                  :key="index + 'prod'"
                  style="border-left: 0.5rem solid #52bb71"
                >
                  <th>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '100px', minWidth: '10px' }"
                      v-model="prod.upc"
                      class="form-control font-weight-bold"
                      :class="{ borderDanger: prod.format.upc }"
                      :readonly="prod.state === 1"
                    />
                  </th>
                  <td>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '150px', minWidth: '10px' }"
                      v-model="prod.nombreProd"
                      class="form-control"
                      :class="{ borderDanger: prod.format.nombreProd }"
                      :readonly="prod.state === 1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '150px', minWidth: '10px' }"
                      v-model="prod.nombreMarca"
                      class="form-control"
                      :class="{ borderDanger: prod.format.nombreMarca }"
                      :readonly="prod.state === 1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '100px', minWidth: '10px' }"
                      v-model="prod.precioUnit"
                      class="form-control"
                      :class="{ borderDanger: prod.format.precioUnit }"
                      :readonly="prod.state === 1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '150px', minWidth: '10px' }"
                      v-model="prod.descripcion"
                      class="form-control"
                      :readonly="prod.state === 1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '60px', minWidth: '10px' }"
                      v-model="prod.stockProd"
                      class="form-control"
                      :class="{ borderDanger: prod.format.stockProd }"
                      :readonly="prod.state === 1"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      @click="saveNewProduct(index)"
                      class="btn btn-outline-success btn-circle"
                      v-if="prod.state === 2 || prod.state === 0"
                    >
                      <i class="fas fa-save" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      @click="editNewRegistro(index)"
                      class="btn btn-outline-warning btn-circle"
                      v-if="prod.state === 1"
                    >
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      @click="removeNewRegistro(index)"
                      class="btn btn-outline-danger btn-circle"
                    >
                      <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
                <!-- --------------- Tabla de productos ---------------- -->
                <tr
                  v-for="(prod, index) in productos"
                  v-show="
                    filtro(index) &&
                    prod.nombreCategoria === tab &&
                    prod.activoProd
                  "
                  :key="prod.upc"
                  :class="{
                    editing: prod === editedProd,
                    editRow: prod === editedProd,
                    editedRow: prod.saved,
                    deleteRow: prod.delete,
                  }"
                >
                  <th>
                    {{ prod.upc }}
                  </th>
                  <td>
                    <div class="view">
                      {{ prod.nombreProd }}
                    </div>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '150px', minWidth: '10px' }"
                      v-model="prod.nombreProd"
                      class="form-control edit"
                      :class="
                        prod.format
                          ? prod.format.nombreProd
                            ? 'borderDanger'
                            : ''
                          : ''
                      "
                    />
                  </td>
                  <td>
                    <div class="view">
                      {{ prod.nombreMarca }}
                    </div>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '150px', minWidth: '10px' }"
                      v-model="prod.nombreMarca"
                      class="form-control edit"
                      :class="
                        prod.format
                          ? prod.format.nombreMarca
                            ? 'borderDanger'
                            : ''
                          : ''
                      "
                    />
                  </td>
                  <td>
                    <div class="view">${{ prod.precioUnit }}</div>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '100px', minWidth: '10px' }"
                      v-model="prod.precioUnit"
                      class="form-control edit"
                      :class="
                        prod.format
                          ? prod.format.precioUnit
                            ? 'borderDanger'
                            : ''
                          : ''
                      "
                    />
                  </td>
                  <td>
                    <div class="view">
                      {{ prod.descripcion }}
                    </div>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '150px', minWidth: '10px' }"
                      v-model="prod.descripcion"
                      class="form-control edit"
                    />
                  </td>
                  <td>
                    <div class="view">
                      {{ prod.stockProd }}
                    </div>
                    <input
                      type="text"
                      v-autowidth="{ maxWidth: '60px', minWidth: '10px' }"
                      v-model="prod.stockProd"
                      class="form-control edit"
                      :class="
                        prod.format
                          ? prod.format.stockProd
                            ? 'borderDanger'
                            : ''
                          : ''
                      "
                    />
                  </td>
                  <td>
                    <div class="view">
                      <button
                        type="button"
                        @click="editProd({ prod: prod, index: index })"
                        class="btn btn-outline-warning btn-circle"
                        v-if="!prod.delete"
                      >
                        <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        @click="removeRegistro(prod)"
                        class="btn btn-outline-danger btn-circle"
                        v-if="!prod.delete"
                      >
                        <i class="fas fa-times" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        @click="transactionRemove(prod)"
                        class="btn btn-outline-danger btn-circle"
                        v-if="prod.delete"
                      >
                        <i class="fas fa-undo" aria-hidden="true"></i>
                      </button>
                    </div>
                    <div class="edit">
                      <button
                        type="button"
                        @click="saveEditProd(index)"
                        class="btn btn-outline-success btn-circle"
                      >
                        <i class="fas fa-save" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        @click="undoEditProd()"
                        class="btn btn-outline-danger btn-circle"
                      >
                        <i class="fas fa-undo" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AgregarProd></AgregarProd>
    </div>
  </div>
</template>

<script>
import AgregarProd from "@/components/Productos/AgregarProd.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Productos",
  components: {
    AgregarProd,
  },
  data: () => {
    return {
      displayOption: "",
      searchDisplay: "",
      urlApi: `http://localhost:8080/categoria`,
      tab: "",
      catActivas: [],
    };
  },
  methods: {
    ...mapMutations("productos", [
      "clearData",
      "removeRegistro",
      "editProd",
      "saveEditProd",
      "undoEditProd",
      "transactionRemove",
      "addProd",
      "removeNewRegistro",
      "saveNewProduct",
      "editNewRegistro",
    ]),

    filtro(valor) {
      if (this.searchDisplay.trim() === "") return true;
      let array = (
        this.productos[valor].nombreProd +
        this.productos[valor].descripcion +
        this.productos[valor].precioUnit +
        this.productos[valor].stockProd +
        this.productos[valor].upc
      ).toUpperCase();
      return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
  },
  computed: {
    ...mapState("productos", [
      "productos",
      "producto",
      "cacheEditProd",
      "editedProd",
      "newProd",
      "deleteTransaction",
      "editTransaction",
      "numeroDeEditados",
    ]),
    ...mapState("categorias", ["categorias"]),

    applyChanges: function () {
      let nuevosProductos = this.newProd.filter((prod) => prod.state === 1);
      if (nuevosProductos.length > 0) {
        return true;
      }

      if (this.deleteTransaction.length > 0) {
        return true;
      }

      if (this.editTransaction.length > 0) {
        return true;
      }

      return false;
    },
  },
  /*
    hook para inicializar los valores de la tabla
     */
  mounted() {
    //para setear como active el tab del inicio
    this.tab = this.categorias[0].nombreCat;
    this.catActivas = this.categorias.filter((cat) => cat.activoCat);
    // this.productos = this.productos.forEach((prod) => (prod.edit = false));
    //this.getAll();
  },
};
</script>
<style scoped>
.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  color: #ffffff !important;
  background-color: #e84b63 !important;
}
.nav-tabs .nav-link:hover {
  color: #e10d2d;
  background-color: #f1f1f1;
}
tr:hover input.form-control {
  background-color: #ececec !important;
}
tr input.form-control {
  /* border: thin; */
  height: auto;
}
thead {
  text-align: center;
}
/* .inputDanger {
  border-color: red;
}
.inputSuccess {
  border-color: #28a745;
} */
th input,
td input {
  display: inline-block;
}
.btn-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
.deleteRow {
  border-left: 0.5rem solid #df4b4b !important;
}
.editRow {
  border-left: 0.5rem solid #ffc107;
}
.editedRow {
  border-left: 0.5rem solid #4b99e8;
}
/* Onclick edit-> show inputs intead of text */
.edit {
  display: none;
}
.editing .edit {
  display: block;
}
.editing .view {
  display: none;
}
.borderDanger {
  border-color: #dc3545 !important;
}
</style>