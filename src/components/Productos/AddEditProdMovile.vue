<template>
  <div>
    <!-- inicio del modal para eliminar (mobile) -->
    <b-modal id="addEditProdMovile" :title="title" centered>
      <div v-if="newProductMobile">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">UPC:</label>
          <div class="col-md-9"></div>
          <div class="col-md-9 input-group" v-if="newProductMobile.doc">
            <input
              type="text"
              class="form-control"
              v-model="newProductMobile.doc.upc"
            /><span
              class="input-group-text"
              v-b-modal.barCode
              @click="showBarcode = !showBarcode"
              ><i class="fas fa-barcode"
            /></span>
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Nombre</label>
          <div class="col-md-9" v-if="newProductMobile.doc">
            <input
              type="text"
              class="form-control"
              v-model="newProductMobile.doc.nombreProd"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Foto:</label>
          <div class="col-md-9" v-if="newProductMobile.doc">
            <input
              type="file"
              accept="image/x-png,image/jpeg,image/webp"
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
          <div class="col-md-9" v-if="newProductMobile.doc">
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
                :key="marca.doc.nombreMarca"
                @click="marcaSel(marca.doc)"
                >{{ marca.doc.nombreMarca }}</b-dropdown-item
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
          <div class="col-md-9" v-if="newProductMobile.doc">
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
                :key="categoria.doc.nombreCategoria"
                @click="catSel(categoria.doc)"
                >{{ categoria.doc.nombreCategoria }}</b-dropdown-item
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
          <label class="col-md-3 form-control-label">Precio Mayorista:</label>
          <div class="col-md-9" v-if="newProductMobile.doc">
            <input
              type="number"
              class="form-control"
              v-model="newProductMobile.doc.precioMayoreo"
              min="0"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Precio Público:</label>
          <div class="col-md-9" v-if="newProductMobile.doc">
            <input
              type="number"
              class="form-control"
              v-model="newProductMobile.doc.precioPublico"
              min="0"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Precio Taller:</label>
          <div class="col-md-9" v-if="newProductMobile.doc">
            <input
              type="number"
              class="form-control"
              v-model="newProductMobile.doc.precioTaller"
              min="0"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-------------------------------------------- -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Stock:</label>
          <div class="col-md-9" v-if="newProductMobile.doc">
            <b-form-spinbutton
              id="decrementIncrement"
              v-model="newProductMobile.doc.stockProd"
              min="0"
              max="1000000"
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
            confirmation(newProductMobile);
          "
        >
          Confirmar
        </b-button>
      </template>
    </b-modal>
    <!-- Fin del modal para eliminar (mobile) -->
    <AgregarMar></AgregarMar>
    <AgregarCat></AgregarCat>
    <UPCReader></UPCReader>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { blobToURL, fromBlob } from "image-resize-compress";
import AgregarMar from "@/components/Marcas/AgregarMar.vue";
import AgregarCat from "@/components/Categorias/AgregarCat.vue";
import UPCReader from "@/components/Productos/UPCReader.vue";
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
    UPCReader,
  },
  data() {
    return {
      imagePreview: "",
      showBarcode: false,
    };
  },
  methods: {
    ...mapMutations("productos", ["removeRegistro", "applyAllChanges"]),
    ...mapActions("productos", [
      "confirmation",
    ]),
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
  mounted() {},
  watch: {
    newProductMobile: {
      // This will let Vue know to look inside the array
      handler() {
        if (this.newProductMobile.doc) {
          if (this.newProductMobile.doc.nombreCategoria) {
            this.descripcionDropdown = this.newProductMobile.doc.nombreCategoria;
          }else{
            this.descripcionDropdown = "";
          }
          if (this.newProductMobile.doc.nombreMarca) {
            this.marcaDropdown = this.newProductMobile.doc.nombreMarca;
          }else{
            this.marcaDropdown = ""
          }
          if (this.newProductMobile.doc.foto) {
            this.imagePreview = this.newProductMobile.doc.foto;
          }else{
            this.imagePreview = ""
          }
        }
      },
    },
    // barcode() {
    //   this.newProductMobile = this.barcode;
    // },
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
/* .dropdown .btn-group{
display: inline-flex;
} */
.dropdown-toggle::after {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}
::v-deep div.dropdown button.dropdown-toggle {
  color: #ffffff;
  min-width: auto;
  padding: 0.4rem 1.8rem;
  text-transform: none;
  font-weight: 300;
  margin-bottom: 0;
  background-image: none;
  background-size: 0 2px, 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom, 50% calc(100% - 1px);
  background-color: #343a40;
  transition: background 0s ease-out;
  float: none;
  box-shadow: none;
  border-radius: 0 1rem 1rem 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 100%;
}

::v-deep div.dropdown.b-dropdown.m-2.btn-group {
  display: inline-flex;
}
</style>

