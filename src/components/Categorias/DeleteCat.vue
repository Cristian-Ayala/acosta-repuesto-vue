<template>
  <div>
    <b-modal id="modal-delete" centered title="Agregar categoria">
      <div class="card-body">
        <h6 style="font-weight: 400; text-align: center" v-if="categoria.doc">
          ¿Está seguro que quiere eliminar la categoria "{{
            categoria.doc.nombreCategoria
          }}"?
        </h6>
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="m"
          variant="primary"
          @click="
            removeRegistro();
            ok();
          "
        >
          Eliminar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AgregarCat",
  data() {
    return {};
  },
  methods: {
    ...mapActions("categorias", ["removeRegistro"]),
  },
  computed: {
    ...mapState("categorias", ["categoria"]),
  },
};
</script>