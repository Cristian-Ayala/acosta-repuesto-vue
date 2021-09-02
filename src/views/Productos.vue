<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem; margin-bottom: 3rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Productos
            </h6>
            <b-button
              variant="success"
              v-on:click="addProd(tab)"
              v-if="windowWidth >= 1000"
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
            </b-button>
            <!-- for mobile action -->
            <b-button
              v-b-modal.addEditProdMovile
              v-if="windowWidth < 1000"
              variant="success"
              v-on:click="
                prodSelected({});
                title = 'Agregar producto';
              "
              ><i class="fa fa-plus" aria-hidden="true"></i
            ></b-button>
            <b-modal id="agregarProduc" title="BootstrapVue">
              <p class="my-4">Hello from modal!</p>
            </b-modal>
            <!-- end of mobile action -->
          </div>
          <div v-if="windowWidth < 1000" style="padding: 1rem">
            <div class="mt-3">
              <b-pagination
                v-model="currentPageLocal"
                :total-rows="totalRows"
                :per-page="perPage"
                pills
                align="center"
                aria-controls="#"
              >
              </b-pagination>
            </div>
            <b-card
              v-for="prod in productos"
              :img-src="prod.doc.foto"
              img-alt="Card image"
              img-top
              border-variant="dark"
              align="center"
              class="cardProductosMobile"
              :key="prod.upc"
            >
              <b-card-text>
                <h5>{{ prod.doc.nombreProd }}</h5>
                UPC: {{ prod.doc.upc }}<br />
                P.M.: <b>${{ prod.doc.precioMayoreo }}</b
                ><br />
                P.P.: <b>${{ prod.doc.precioPublico }}</b
                ><br />
                P.T.: <b>${{ prod.doc.precioTaller }}</b
                ><br />
                Stock: {{ prod.doc.stockProd }}<br />
                Marca: {{ prod.doc.nombreMarca }}<br />
                Categoria: {{ prod.doc.nombreCategoria }}<br />
                <!-- for mobile action -->
                <b-button
                  v-b-modal.addEditProdMovile
                  @click="
                    prodSelected(prod);
                    title = 'Editar producto';
                  "
                  class="btn btn-outline-warning btn-circle"
                  ><i class="fas fa-pencil-alt" aria-hidden="true" />
                </b-button>
                <b-button
                  v-b-modal.deleteProduc
                  @click="prodSelected(prod)"
                  class="btn btn-outline-danger btn-circle"
                  ><i class="fas fa-times" aria-hidden="true" />
                </b-button>
                <!-- end of mobile action -->
              </b-card-text>
            </b-card>
          </div>
          <div class="card-body" v-if="windowWidth >= 1000">
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
                v-for="cat in categorias"
                :key="cat.nombreCategoria"
                :active="tab === cat.nombreCategoria"
                @click="tab = cat.nombreCategoria"
                >{{ cat.nombreCategoria }}</b-nav-item
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
      <ConfirmarTransacciones></ConfirmarTransacciones>
      <EliminarProdMovil></EliminarProdMovil>
      <AddEditProdMovile :title="title"></AddEditProdMovile>
    </div>
  </div>
</template>

<script>
import ConfirmarTransacciones from "@/components/Productos/ConfirmarTransacciones.vue";
import EliminarProdMovil from "@/components/Productos/EliminarProdMovil.vue";
import AddEditProdMovile from "@/components/Productos/AddEditProdMovile.vue";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Productos",
  components: {
    ConfirmarTransacciones,
    EliminarProdMovil,
    AddEditProdMovile,
  },
  data: () => {
    return {
      displayOption: "",
      searchDisplay: "",
      urlApi: `http://localhost:8080/categoria`,
      tab: "",
      windowWidth: window.innerWidth,
      title: "Editar",
      currentPageLocal: 1,
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
      "prodSelected",
    ]),
    ...mapActions("productos", [
      "firstPage",
      "lastPage",
      "nextPage",
      "prevPage",
      "setPage",
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
      "newProductMobile",
      "currentPage",
      "perPage",
      "totalRows",
    ]),
    ...mapState("categorias", ["categorias"]),
    // funcion que evalua si hay algun dato en cache para que el boton de "Aplicar Cambios" se muestre
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
    //para setear como active el tab del inicio -------------- No funciona porque no se han traido los datos (hacer esto en el store)
    // console.log("Esto es lo que hay al mounted",this.categorias[0].doc.nombreCategoria);
    // this.tab = this.categorias[0].doc.nombreCategoria;
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  watch: {
    currentPageLocal: function (valor) {
      this.setPage(valor);
    },
  }
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
@media (max-width: 1000px) {
  .card-body {
    background-color: #f8f9fb;
    padding: 1rem;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom-left-radius: calc(1rem - 1px);
    border-bottom-right-radius: calc(1rem - 1px);
  }
  .card-body div.cardProductosMobile {
    margin: 5px;
  }
  .card.cardProductosMobile {
    border: 1px solid #7b7b7b !important;
    margin-bottom: 1rem;
  }
  .cardProductosMobile {
    width: 100%;
    display: inline-flex;
  }
  .cardProductosMobile img {
    /* width: 150px; */
    align-self: center;
  }
}
</style>