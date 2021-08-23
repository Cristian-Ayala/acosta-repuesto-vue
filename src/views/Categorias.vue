<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Categorias
            </h6>
            <b-button
              v-b-modal.modal-1
              variant="success"
              v-on:click="clearDataCat()"
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
                placeholder="Buscar categorias..."
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
              <tbody>
                <tr
                  v-for="(cat, index) in categorias"
                  v-show="filtro(index) && cat.activoCat === true"
                  :key="index"
                >
                  <th scope="row" class="onlyOnWeb">{{ index + 1 }}</th>
                  <td>{{ cat.nombreCategoria }}</td>
                  <td class="onlyOnWeb">{{ cat.descripcion }}</td>
                  <td>
                    <b-button
                      v-b-modal.modal-delete
                      variant="danger"
                      v-on:click="getCategoriaSelected(cat)"
                      class="btn btn-outline-danger btn-circle"
                    >
                      <i class="fas fa-times" aria-hidden="true"></i>
                    </b-button>
                    <b-button
                      v-b-modal.modal-edit
                      variant="warning"
                      class="btn btn-outline-warning btn-circle"
                      v-on:click="getCategoriaSelected(cat)"
                    >
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AgregarCat></AgregarCat>
      <DeleteCat></DeleteCat>
      <EditCat></EditCat>
    </div>
  </div>
</template>

<script>
import AgregarCat from "@/components/Categorias/AgregarCat.vue";
import DeleteCat from "@/components/Categorias/DeleteCat.vue";
import EditCat from "@/components/Categorias/EditCat.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Categorias",
  components: {
    AgregarCat,
    DeleteCat,
    EditCat,
  },
  data: () => {
    return {
      displayOption: "",
      searchDisplay: "",
      urlApi: `http://localhost:8080/categoria`,
    };
  },
  methods: {
    ...mapMutations("categorias", ["clearDataCat", "getCategoriaSelected"]),
    filtro(valor) {
      if (this.searchDisplay === "") return true;
      let array = (
        this.categorias[valor].nombreCat + this.categorias[valor].descripcion
      ).toUpperCase();
      return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
  },
  computed: {
    ...mapState("categorias", ["categorias", "categoria"]),
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
