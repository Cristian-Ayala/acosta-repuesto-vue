<template>
  <div>
    <!-- inicio del modal para eliminar (mobile) -->
    <b-modal id="addEditProdMovile" :title="title" centered>
      <div v-if="newProductMobile">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">UPC:</label>
          <div class="col-md-9">
          </div>
          <div class="col-md-9 input-group">
            <input
              type="text"
              class="form-control"
              v-model="newProductMobile.upc"
            /><span class="input-group-text"><i class="fas fa-barcode"/></span>
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Nombre</label>
          <div class="col-md-9">
            <input
              type="text"
              class="form-control"
              v-model="newProductMobile.nombreProd"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Foto:</label>
          <div class="col-md-9">
            <input
              type="file"
              accept="image/x-png,image/jpeg"
              id="uploadPictures"
              @change="upload()"
              v-if="!imagePreview"
              style="color: transparent"
            />
            <div class="image-preview-container" v-if="imagePreview">
              <img class="image-preview" :src="imagePreview" alt="Picture" />
              <b-button variant="danger" @click="imagePreview = ''"
                >Quitar</b-button
              >
            </div>
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Marca</label>
          <div class="col-md-9">
            <b-dropdown
              :text="marcaDropdown"
              split
              lazy
              split-variant="outline-dark"
              variant="dark"
              class="m-2"
            >
              <b-dropdown-item
                href="#"
                v-for="marca in marcas"
                :key="marca.nombreMarca"
                @click="marcaSel(marca)"
                >{{ marca.nombreMarca }}</b-dropdown-item
              >
              <b-button
                v-b-modal.modalAgregarMar
                variant="success"
                v-on:click="clearData()"
                class="btn-circle"
                ><i class="fa fa-plus" aria-hidden="true"></i>
              </b-button>
            </b-dropdown>
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Categoria</label>
          <div class="col-md-9">
            <b-dropdown
              :text="descripcionDropdown"
              split
              lazy
              split-variant="outline-dark"
              variant="dark"
              class="m-2"
            >
              <b-dropdown-item
                href="#"
                v-for="categoria in categorias"
                :key="categoria.nombreCategoria"
                @click="catSel(categoria)"
                >{{ categoria.nombreCategoria }}</b-dropdown-item
              >
              <b-button
                v-b-modal.modal-1
                variant="success"
                v-on:click="clearDataCat()"
                class="btn-circle"
                ><i class="fa fa-plus" aria-hidden="true"></i>
              </b-button>
            </b-dropdown>
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Precio Unitario:</label>
          <div class="col-md-9">
            <input
              type="number"
              class="form-control"
              v-model="newProductMobile.precioUnit"
              min="0"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Stock:</label>
          <div class="col-md-9">
            <b-form-spinbutton
              id="decrementIncrement"
              v-model="newProductMobile.stockProd"
              min="0"
            ></b-form-spinbutton>
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
      </div>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="md" variant="danger" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="md"
          variant="success"
          @click="
            ok();
            removeRegistro(newProductMobile);
            applyAllChanges();
          "
        >
          Confirmar
        </b-button>
      </template>
    </b-modal>
    <!-- Fin del modal para eliminar (mobile) -->
    <AgregarMar></AgregarMar>
    <AgregarCat></AgregarCat>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { blobToURL, fromBlob } from "image-resize-compress";
import AgregarMar from "@/components/Marcas/AgregarMar.vue";
import AgregarCat from "@/components/Categorias/AgregarCat.vue";

export default {
  name: "AddEditProdMovile",
  props: {
    title: {
      type: String,
      default: "Editar",
      marcaDropdown: "",
      descripcionDropdown: "",
    },
  },
  components: {
    AgregarMar,
    AgregarCat,
  },
  data() {
    return {
      imagePreview: "",
    };
  },
  methods: {
    ...mapMutations("productos", ["removeRegistro", "applyAllChanges"]),
    ...mapMutations("marcas", ["clearData"]),
    ...mapMutations("categorias", ["clearDataCat"]),
    upload() {
      return new Promise((resolve, reject) => {
        const filePicker = document.getElementById("uploadPictures");

        if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
          reject("No hay imagen seleccionada");
          return;
        }
        const myFile = filePicker.files[0];

        //Options for file
        const quality = 90;
        const width = 150;
        const height = "auto";
        const format = "webp";

        fromBlob(myFile, quality, width, height, format).then((blob) => {
          // will generate a url to the converted file
          blobToURL(blob).then((url) => (this.imagePreview = url));
        });
        //console.log(myFile);//prints the file in JSON

        resolve();
      });
    },
    marcaSel(marca) {
      let cache = marca.nombreMarca;
      marca.nombreMarca = "";
      marca.nombreMarca = cache;
      this.marcaDropdown = marca.nombreMarca;
    },
    catSel(categoria) {
      let cache = categoria.nombreCategoria;
      categoria.nombreCategoria = "";
      categoria.nombreCategoria = cache;
      this.descripcionDropdown = categoria.nombreCategoria;
    },
  },
  computed: {
    ...mapState("productos", ["newProductMobile"]),
    ...mapState("marcas", ["marcas"]),
    ...mapState("categorias", ["categorias"]),
  },
};
</script>
<style scoped>
@media (max-width) {
  ::v-deep .btn-group > .btn-group:not(:first-child) > .btn,
  .btn-group > .btn:not(:first-child) {
    color: #ffffff;
    min-width: 0px;
    background-color: #343a40;
    border-color: #343a40;
    margin: 0;
    padding: 3rem !important;
  }
}
.btn-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
::v-deep .dropdown-menu.show {
  text-align: center;
}
::v-deep .b-form-spinbutton button {
  color: black !important;
}

.input-group-text {
  border-radius: 0 1rem 1rem 0;
  width: 4rem;
  justify-content: center;
}
</style>