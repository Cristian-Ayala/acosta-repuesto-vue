<template>
  <div>
    <b-modal id="modal-editMar" centered title="Editar Marca">
      <div class="card-body">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Nombre</label>
          <div class="col-md-9">
            <input
              v-if="marSelected.doc"
              type="text"
              class="form-control"
              v-model="marSelected.doc.nombreMarca"
            />
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Descripción</label>
          <div class="col-md-9">
            <textarea
              v-if="marSelected.doc"
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              v-model="marSelected.doc.descripMarca"
            ></textarea>
          </div>
        </div>
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="m"
          variant="primary"
          @click="
            edithRegistro();
            ok();
          "
        >
          Guardar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "EditMar",
  data() {
    return {};
  },
  methods: {
    ...mapActions("marcas", ["edithRegistro"]),
  },
  computed: {
    ...mapState("marcas", ["marSelected"]),
  },
  mounted() {},
};
</script>