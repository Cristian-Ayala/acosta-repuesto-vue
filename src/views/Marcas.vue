<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Marcas
            </h6>
            <b-button
              v-b-modal.modalAgregarMar
              variant="success"
              v-on:click="clearData()"
            >
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
                placeholder="Buscar marca..."
                class="form-control form-control-sm border-0 no-shadow pl-4"
              />
            </div>
            <table class="table card-text table-hover">
              <thead>
                <tr>
                  <th class="onlyOnWeb">#</th>
                  <th>Nombre</th>
                  <th class="onlyOnWeb">Descripción</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody v-if="marcas">
                <tr
                  v-for="(mar, index) in marcas"
                  v-show="filtro(index) && mar.doc.activoMarca == true"
                  :key="mar.doc.nombreMarca"
                >
                  <th scope="row" class="onlyOnWeb">{{ index + 1 }}</th>
                  <td>{{ mar.doc.nombreMarca }}</td>
                  <td class="onlyOnWeb">{{ mar.doc.descripMarca }}</td>
                  <td>
                    <b-button
                      v-b-modal.modal-deleteMar
                      variant="danger"
                      v-on:click="getMarcaSelected(mar)"
                      class="btn btn-outline-danger btn-circle"
                    >
                      <i class="fas fa-times" aria-hidden="true"></i>
                    </b-button>
                    <b-button
                      v-b-modal.modal-editMar
                      variant="warning"
                      v-on:click="getMarcaSelected(mar)"
                      class="btn btn-outline-warning btn-circle"
                    >
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <b-skeleton-table
              :rows="5"
              :columns="windowWidth >= 650 ? 4 : 2"
              v-if="marcas.length === 0"
            ></b-skeleton-table>
          </div>
        </div>
      </div>
      <AgregarMar></AgregarMar>
      <DeleteMar></DeleteMar>
      <EditMar></EditMar>
    </div>
  </div>
</template>
<script>
import AgregarMar from "@/components/Marcas/AgregarMar.vue";
import DeleteMar from "@/components/Marcas/DeleteMar.vue";
import EditMar from "@/components/Marcas/EditMar.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Marcas",
  components: {
    AgregarMar,
    DeleteMar,
    EditMar,
  },
  data: () => {
    return {
      displayOption: "",
      searchDisplay: "",
      windowWidth: window.innerWidth
    };
  },
  methods: {
    ...mapMutations("marcas", ["clearData", "getMarcaSelected"]),
    filtro(index) {
      if (this.searchDisplay === "") return true;
      let marcaBusqueda = (
        this.marcas[index].doc.nombreMarca + this.marcas[index].doc.descripMarca
      ).toUpperCase();
      return marcaBusqueda.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
  },
  mounted(){
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  computed: {
    ...mapState("marcas", ["marcas", "marca"]),
  },
};
</script>
<style scoped>
.btn-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
</style>
