<template>
  <div>
    <b-modal id="modal-edit" centered title="Agregar categoria">
      <div class="card-body">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Nombre</label>
          <div class="col-md-9">
            <input
            v-if="catSelected.doc"
              type="text"
              class="form-control"
              v-model="catSelected.doc.nombreCategoria"
            />
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Descripción</label>
          <div class="col-md-9">
            <textarea
            v-if="catSelected.doc"
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              v-model="catSelected.doc.descripcion"
            ></textarea>
          </div>
        </div>
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button size="m" variant="primary" @click="edithRegistro(); ok()"> Guardar </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "EditCat",
  data() {
    return {
    };
  },
  methods: {
    ...mapActions("categorias",["edithRegistro"]),
  },
  computed: {
    ...mapState("categorias",["catSelected"]),
  },
  mounted() {
  },
};
</script>