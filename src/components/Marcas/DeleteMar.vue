<template>
  <div>
    <b-modal id="modal-deleteMar" centered title="Eliminar Marca">
      <div class="card-body">
        <h6 style="font-weight: 400; text-align: center" v-if="marca.doc">
          ¿Está seguro que quiere eliminar la marca "{{ marca.doc.nombreMarca }}"?
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
  name: "DeleteMar",
  data() {
    return {};
  },
  methods: {
    ...mapActions("marcas", ["removeRegistro"]),
  },
  computed: {
    ...mapState("marcas", ["marca"]),
  },
};
</script>