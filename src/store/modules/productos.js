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
                nombreCategoria: "Lubricantes",
                foto: "data:image/webp;base64,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"
            }, {
                nombreProd: "System 7 Blanco",
                activoProd: true,
                descripcion: "Carcasa completa de carbono",
                precioUnit: 57.99,
                stockProd: 16,
                upc: 37842,
                nombreMarca: "BMW",
                nombreCategoria: "Cascos",
                foto: "data:image/webp;base64,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"
            },
            {
                nombreProd: "22 pulgadas",
                activoProd: true,
                descripcion: "Llantas para motos",
                precioUnit: 24.50,
                stockProd: 7,
                upc: 23471,
                nombreMarca: "Dunlop",
                nombreCategoria: "Llantas",
                foto: "data:image/webp;base64,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"
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
            nombreCategoria: "",
            foto: ""
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
        newProductMobile: {},
    },
    mutations: {
        prodSelected(state, productoSelected) {
            // check if empty, if it is -> set array with format
            if (!Object.keys(productoSelected).length) {
                productoSelected = {
                    nombreProd: "",
                    activoProd: true,
                    descripcion: "",
                    precioUnit: 0,
                    stockProd: 0,
                    upc: null,
                    nombreMarca: "",
                    nombreCategoria: "",
                    foto: ""
                };
            }
            state.newProductMobile = productoSelected;
            // this.commit("productos/undoEditProd", state)            
        },
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
            var message = ""; //Mensaje de notificación
            let nuevosProductos = filteredArrayNewProd(state.newProd);
            if (nuevosProductos.length > 0) {
                state.productos.push(...nuevosProductos)
                if (nuevosProductos.length == 1) {
                    message += "- Se agregó 1 producto nuevo.<br>"
                } else {
                    message += `- Se agregaron ${nuevosProductos.length} productos.<br>`;
                }
            }
            let modifyProducts = filterModifyFields(state.editTransaction);
            if (modifyProducts.length != 0) {
                modifyProducts.map((prod) => {
                    let index = state.productos.findIndex((obj) => obj.upc === prod.upc);
                    state.productos.splice(index, 1, prod);
                });
                //Funcion para el endpoint y los productos a editar

                if (modifyProducts.length == 1) {
                    message += "\n- Se modificó 1 producto.<br>"
                } else {
                    message += `- Se modificaron ${modifyProducts.length} productos.<br>`;
                }
            }
            let deleteProducts = filterDelete(state.deleteTransaction);
            if (deleteProducts.length > 0) {
                deleteProducts.map((prod) => {
                    let index = state.productos.findIndex((obj) => obj.upc === prod.upc);
                    state.productos.splice(index, 1);
                });
                //Funcion para el endpoint y los productos a eliminar

                if (deleteProducts.length == 1) {
                    message += "\n- Se eliminó 1 producto.<br>"
                } else {
                    message += `- Se eliminaron ${deleteProducts.length} productos.<br>`;
                }
            }
            this._vm.$awn.success(message, {
                durations: {
                    success: 2000
                },
                labels: {
                    success: "Exito"
                }
            });
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
        return true;
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