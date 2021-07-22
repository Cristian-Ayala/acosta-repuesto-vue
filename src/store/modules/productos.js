import axios from 'axios'
const urlApi = "url/productos/"

export default {
    namespaced: true,
    state: {
        productos: [{
                nombreProd: "20W50",
                activoProd: true,
                descripcion: "Lubricante para motos",
                precioUnit: 5,
                stockProd: 100,
                upc: 53260,
                nombreMarca: "Motul",
                nombreCategoria: "Lubricantes"
            }, {
                nombreProd: "System 7 Blanco",
                activoProd: true,
                descripcion: "Carcasa completa de carbono",
                precioUnit: 57.99,
                stockProd: 16,
                upc: 37842,
                nombreMarca: "BMW",
                nombreCategoria: "Cascos"
            },
            {
                nombreProd: "22 pulgadas",
                activoProd: true,
                descripcion: "Llantas para motos",
                precioUnit: 24.50,
                stockProd: 7,
                upc: 23471,
                nombreMarca: "Dunlop",
                nombreCategoria: "Llantas"
            }
        ],
        producto: {
            idMarca: null,
            nombreProd: "",
            activoProd: true,
            descripcion: "",
            idCategoria: null,
            precioUnit: null,
            stockProd: null,
            upc: null,
            nombreMarca: "",
            nombreCategoria: ""
        },
        displayOption: "",
        searchDisplay: "",
        marcas: [{
                idMarca: "0",
                nombreMarca: "Motul",
                activoMarca: true,
                descripMarca: "Generalmente vende productos de mantenimineto de motos",
            }, {
                idMarca: "1",
                nombreMarca: "BMW",
                activoMarca: true,
                descripMarca: "Motos lujosas",
            },
            {
                idMarca: "2",
                nombreMarca: "Kawasaki",
                activoMarca: true,
                descripMarca: "Fabricadas en plantas en Japón.",
            }, {
                idMarca: "3",
                nombreMarca: "Ducati",
                activoMarca: true,
                descripMarca: "Unas motos cholas que son bien caras",
            }
        ],
        categorias: [{
                idCategoria: "0",
                nombreCat: "Llantas",
                activoCat: true,
                descripcion: "Aqui estan todas las llantas",
            },
            {
                idCategoria: "1",
                nombreCat: "Cascos",
                activoCat: true,
                descripcion: "Se listan todos los cascos",
            }, {
                idCategoria: "2",
                nombreCat: "Luces Led",
                activoCat: true,
                descripcion: "Todas las luces led",
            }
        ],
        add: {},
        cacheEditProd: null,
        editedProd: null,
        editTransaction: [],
        deleteTransaction: [],
        newProd: [],
    },
    mutations: {
        /**
         * Agrega un nuevo producto al arreglo newProd para que se pueda comenzar a agregar el producto
         * @param {state de vue} state 
         * @param {categoria activa} activeTab 
         */
        addProd(state, activeTab) {
            var producto = {
                nombreProd: "",
                activoProd: true,
                descripcion: "",
                precioUnit: null,
                stockProd: null,
                upc: null,
                nombreMarca: "",
                nombreCategoria: activeTab,
                //state 0 -> created | state 1 -> saved | state 2 -> edit
                state: 0,
                //Cuando se quiera guardar, se pondrá en true lo que no cumpla con el formato para darle a conocer al usuario que campo está mal escrito
                format: {
                    nombreProd: false,
                    precioUnit: false,
                    stockProd: false,
                    upc: false,
                    nombreMarca: false,
                }
            };
            state.newProd.push(producto);
        },
        /**
         * Verifica que el formato se cumpla y guarda en el arreglo
         * @param {state de vue} state 
         * @param {index del vector} index 
         * @param {producto el nuevo} prod 
         */
        saveNewProduct(state, index) {
            let prod = state.newProd[index];
            let errores = verifyFormat(state.newProd, prod, index)

            //Verifica que no existan problemas de formato en el nuevo registro del producto
            if (errores.length === 0) {
                state.newProd[index].state = 1;
                //Notificacion si todo va bien
                this._vm.$awn.success('Formato correcto.', {
                    durations: {
                        success: 2000
                    },
                    labels: {
                        success: "Exito"
                    }
                });
            } else {
                let message = armarMensajeError(errores);
                this._vm.$awn.alert(message, {
                    durations: {
                        success: 2000
                    }
                });
            }

        },
        /**
         * 
         * @param {El estado de vue} state 
         * @param {el index del arreglo} index 
         */
        removeNewRegistro(state, index) {
            state.newProd.splice(index, 1);
        },
        editNewRegistro(state, index) {
            state.newProd[index].state = 2
        },
        /*
                Modifica el registro seleccionado
                */
        edithRegistro() {
            this.producto.idMarca = this.marcas.filter(mar => mar.nombreMarca === this.producto.nombreMarca)[0].idMarca;
            this.producto.idCategoria = this.categorias.filter(cat => cat.nombreCat === this.producto.nombreCategoria)[0].idCategoria;
            if (this.producto.upc.trim() !== "" && this.producto.stockProd > 0 && this.producto.nombreProd.trim() !== "" && this.producto.idMarca > 0 && this.producto.idCategoria > 0) {
                console.log(this.producto);
                axios.put(urlApi, JSON.stringify(this.producto), {
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(response => {
                    console.log(response.status);
                    this.getAll();
                }).catch(ex => {
                    console.log(ex)
                });
            } else {
                console.log("No se pudo editar el producto porque uno de los valores es nulo, indefinido o está vacio");
            }
        },
        /*
        creacion de nuevos registros
        (no se pueden crear registros vacios)
         */
        createRegistro: function () {
            this.producto.idMarca = this.marcas.filter(mar => mar.nombreMarca === this.producto.nombreMarca)[0].idMarca;
            this.producto.idCategoria = this.categorias.filter(cat => cat.nombreCat === this.producto.nombreCategoria)[0].idCategoria;
            if (this.producto.upc.trim() !== "" && this.producto.stockProd > 0 && this.producto.nombreProd.trim() !== "" && this.producto.idMarca > 0 && this.producto.idCategoria > 0) {
                console.log(this.producto);
                axios.post(urlApi, JSON.stringify(this.producto), {
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(response => {
                    console.log(response.status);
                    this.getAll();
                }).catch(ex => {
                    console.log(ex)
                });
            } else {
                console.log("No se pudo registrar el producto porque uno de los valores es nulo, indefinido o está vacio");
            }

        },

        /*
        eliman registros, correspondiente al id seleccionado
         */
        removeRegistro: function (state, producto) {
            //Verifica que no se haya editando
            //si se ha editado, lo quita del queue para persistir la edicion. Sino, no hace nada.
            if (producto.saved) {
                var index = state.editTransaction.findIndex(
                    (element) => element.upc === producto.upc
                );
                state.editTransaction.splice(index, 1);
            }

            //para agregar al array de productos eliminados (queue)
            var inTran = state.deleteTransaction.findIndex(
                (element) => element.upc === producto.upc
            );
            if (inTran < 0) {
                state.deleteTransaction.push(producto)
            }
            // producto.activoProd = false;
            let cachedProd = JSON.parse(JSON.stringify(producto));
            producto.delete = true;
            // Assign a value and reassign it is just for detection purposes, 
            // see more here: https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
            producto.precioUnit = "";
            producto.precioUnit = cachedProd.precioUnit;
            // this.clearData();
            let x = 0;
            if (x === 0) return;

            axios.put(urlApi + "/remove/" + this.producto.upc).then(
                response => {
                    this.getAll();
                    console.log(response.status)
                }
            ).catch(ex => {
                console.log(ex)
            });

        },
        transactionRemove(state, producto) {
            //Si el producto había sido guardado, regresa al queue de guardar
            if (producto.saved) {
                state.editTransaction.push(producto);
            }

            var inTran = state.deleteTransaction.findIndex(
                (element) => element.upc === producto.upc
            );
            if (inTran < 0) {
                console.log("No se encontró documento");
            } else {
                state.deleteTransaction.splice(inTran, 1);
            }
            producto.delete = false;
            let cachedProd = JSON.parse(JSON.stringify(producto));
            // console.log(JSON.parse(JSON.stringify(state.deleteTransaction)));
            // Assign a value and reassign it is just for detection purposes, 
            // see more here: https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
            producto.precioUnit = "";
            producto.precioUnit = cachedProd.precioUnit;
        },

        /*
        recolecta todos los datos al hacer una peticion al api
         */
        getAll() {
            axios.get(urlApi).then(
                response => {
                    var prods = response.data;
                    return prods;
                }
            ).catch(ex => {
                console.log(ex)
            })
        },

        /*
        limpiando valores de la marca previamente seleccionada
         */
        clearData: function () {
            this.producto = {
                idMarca: null,
                nombreProd: "",
                activoProd: true,
                descripcion: "",
                idCategoria: null,
                precioUnit: null,
                stockProd: null,
                upc: null,
                nombreMarca: "",
                nombreCategoria: ""
            }
        },
        getProductoSelected(prod) {
            this.producto = prod;
            // this.producto.idMarca = this.marcas.filter(mar => mar.idMarca === this.producto.idMarca)[0].nombreMarca;
            // console.log(this.marcas.filter(mar => mar.idMarca === this.producto.idMarca)[0].nombreMarca);
            // var idMar = typeof this.marcas !== 'undefined'?this.marcas.filter(mar => mar.idMarca === this.producto.idMarca)[0].nombreMarca:'';
            // this.producto.idMarca = idMar;
        },
        showEditing: function (input) {
            // Get the value from the input
            var value = input.value;
            // Get the matching `option` element from the `datalist` (which is
            // available via `input.list`)
            var option = Array.prototype.find.call(input.list.options, function (option) {
                return option.value === value;
            });
            // Get its `data-id` attribute value
            console.log(option.getAttribute("data-id"));
        },
        /**
         * Se guarda en cache el producto por si no se quiere guardar
         * 
         * Si se está editando y no se guarda y se presiona editar a otro producto, hacer rollback
         * 
         * @param {state de vuex} state 
         * @param {El producto a editar} prod 
         */
        editProd(state, obj) {
            if (state.cacheEditProd === null) {
                state.cacheEditProd = JSON.parse(JSON.stringify(obj.prod));
                state.cacheEditProd.index = obj.index;
                state.editedProd = obj.prod;
            } else {
                this.commit("productos/undoEditProd", state)
                this.commit("productos/editProd", {
                    prod: obj.prod
                })
            }
        },
        /**
         * Regresa al valor original, cacheado antes de comenzar a editar
         * @param {state de vuex} state 
         */
        undoEditProd(state) {
            state.editedProd = state.cacheEditProd;
            state.productos.splice(state.cacheEditProd.index, 1, state.cacheEditProd);
            state.editedProd = null;
            state.cacheEditProd = null;
        },
        /**
         * Se guardan los cambios del producto editado
         * 
         * @param {state de vuex} state 
         */
        saveEditProd(state, index) {
            state.editedProd.saved = true;
            let errores = verifyFormat([state.editedProd], state.editedProd, 0)

            if (errores.length === 0) {
                state.productos.splice(index, 1, state.editedProd);
                //para agregar al array de productos editados
                let inTran = state.editTransaction.findIndex(el => el.upc === state.editedProd.upc);
                //Si no está en el arreglo lo agrega
                if (inTran < 0) {
                    state.editTransaction.push(state.editedProd)
                    //Si ya existe el producto en el arreglo, lo vuelve a modificar
                } else if (inTran >= 0) {
                    state.editTransaction.splice(inTran, 1, state.editedProd);
                }
                //FINAL para agregar al array de productos editados
                state.editedProd = null;
                state.cacheEditProd = null;
                //Notificacion si todo va bien
                this._vm.$awn.success('Formato correcto.', {
                    durations: {
                        success: 2000
                    },
                    labels: {
                        success: "Exito"
                    }
                });
            } else {
                //For re-rendering
                let upc = state.editedProd.upc;
                state.editedProd.upc = 0;
                state.editedProd.upc = upc;
                //Finish re-rendering
                let message = armarMensajeError(errores);
                this._vm.$awn.alert(message, {
                    durations: {
                        success: 2000
                    }
                });
            }
        },
        applyAllChanges(state) {
            let nuevosProductos = filteredArrayNewProd(state.newProd);
            if (nuevosProductos.length != 0) {
                state.productos.push(...nuevosProductos)
            }
            let modifyProducts = filterModifyFields(state.editTransaction);
            if (modifyProducts.length != 0) {
                modifyProducts.map((prod) => {
                    let index = state.productos.findIndex((obj) => obj.upc === prod.upc);
                    state.productos.splice(index, 1, prod);
                });
                //Funcion para el endpoint y los productos a editar
            }
            let deleteProducts = filterDelete(state.deleteTransaction);
            if (deleteProducts.length != 0) {
                deleteProducts.map((prod) => {
                    let index = state.productos.findIndex((obj) => obj.upc === prod.upc);
                    state.productos.splice(index, 1);
                });
                //Funcion para el endpoint y los productos a eliminar
            }
            //limpiar arrays que contienen el queue de acciones
            state.newProd = [];
            state.editTransaction = []
            state.deleteTransaction = []
        },
    }
}



function parseToDouble(text) {
    try {
        return parseFloat(text) >= 0;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function inputBlankOrFilled(text) {
    try {
        return text.trim().length != 0;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function marcaExist(text) {
    if (text) {
        return true
    }
    //console.log(text);
    //para ver si la marca existe
    return true
}

function unicUPC(upc) {
    if (upc) {
        return true
    } //console.log(upc);
    //verifica que el upc sea unico
    return true
}

function verifyFormat(arrProd, prod, index) {
    let errores = []
    if (!prod.format) {
        prod.format = {};
    }
    //Chequeando que el campo UPC no este vacio y sea unico entre los registros
    if (!prod.saved) {
        if (!inputBlankOrFilled(prod.upc)) {
            prod.format.upc = true;
            errores.push("UPC");
        } else if (!unicUPC(prod.upc)) {
            prod.format.upc = true;
            errores.push("UPC");
        } else {
            prod.format.upc = false;
        }
    }

    //Verifica que el nombre del producto no este vacio
    if (!inputBlankOrFilled(prod.nombreProd)) {
        prod.format.nombreProd = true;
        errores.push("Nombre del producto");
    } else {
        prod.format.nombreProd = false;
    }

    //Verifica que la marca no esté vacia y exista 
    if (!inputBlankOrFilled(prod.nombreMarca)) {
        prod.format.nombreMarca = true;
        errores.push("Marca");
    } else if (!marcaExist(prod.nombreMarca)) {
        prod.format.nombreMarca = true;
        errores.push("Marca");
    } else {
        prod.format.nombreMarca = false;
    }

    //Verifica que el precio unitario del producto no este vacio
    if (!parseToDouble(prod.precioUnit)) {
        prod.format.precioUnit = true;
        errores.push("Precio unitario");
    } else {
        arrProd[index].precioUnit = parseFloat(prod.precioUnit);
        prod.format.precioUnit = false;
    }

    //Verifica que el stock del producto no este vacio
    if (!parseFloat(prod.stockProd)) {
        prod.format.stockProd = true;
        errores.push("Stock");
    } else {
        arrProd[index].stockProd = parseFloat(prod.stockProd);
        prod.format.stockProd = false;
    }

    if (errores.length > 0) {
        prod.saved = false;
    }

    return errores;
}

function armarMensajeError(errores) {
    let message = ""
    if (errores.length === 1) {
        message = "El siguiente campo presenta problemas: " + errores[0]
    } else {
        message = "Los siguientes campos presentas problemas: "
        errores.forEach((error) => {
            message += error + ", "
        });
        message = message.substring(0, message.length - 2) + ".";
    }
    return message;
}

function filteredArrayNewProd(newProd) {
    return newProd.filter((prod) => {
        if (prod.state === 1) {
            delete prod.format;
            delete prod.state;
            return true;
        }
        return false;
    });
}

function filterModifyFields(modifyProds) {
    return modifyProds.filter((prod) => {
        delete prod.format;
        delete prod.saved;
    });
}

function filterDelete(deleteProds) {
    return deleteProds.filter((prod) => {
        delete prod.format;
        delete prod.saved;
        delete prod.delete;
        return true;
    });
}