import router from '../../router/index'
var PouchDB = require('pouchdb').default;
PouchDB.plugin(require('pouchdb-find').default);
export default {
    namespaced: true,
    state: {
        productos: [],
        producto: {
            nombreProd: "",
            activoProd: true,
            stockProd: null,
            upc: null,
            nombreMarca: "",
            nombreCategoria: "",
            foto: "",
            precioTaller: 0,
            precioMayoreo: 0,
            precioPublico: 0,
        },
        add: {},
        cacheEditProd: null,
        editedProd: null,
        editTransaction: [],
        deleteTransaction: [],
        newProd: [],
        newProductMobile: {},
        PouchDB: PouchDB,
        localProductos: null,
        currentPage: 1,
        perPage: 5,
        totalRows: 100,
        optionsPagination: {
            include_docs: true,
            descending: false,
            limit: 5
        },
        paginationHelper: {
            firstDoc: null,
            lastDoc: null,
            skip: 0,
        }
    },
    mutations: {
        prodSelected(state, productoSelected) {
            // console.log(JSON.parse(JSON.stringify(productoSelected)));
            // check if empty, if it is -> set array with format
            if (!Object.keys(productoSelected).length) {
                productoSelected = {
                    doc: {
                        nombreProd: "",
                        activoProd: true,
                        stockProd: 0,
                        upc: "",
                        nombreMarca: "",
                        nombreCategoria: "",
                        foto: "",
                        precioTaller: 0,
                        precioMayoreo: 0,
                        precioPublico: 0,
                    }
                };
            }
            // state.newProductMobile = {};
            state.newProductMobile = JSON.parse(JSON.stringify(productoSelected));
            // this.commit("productos/undoEditProd", state)            
        },
        // -------------------- Here is were CRUD methods for mobile start --------------------
        /**
         * Create a new product (saves it)
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
                this.commit("productos/successNotification", {
                    message: 'Formato correcto.',
                    duration: 2000,
                    tittle: "Exito"
                })
            } else {
                let message = armarMensajeError(errores);
                this.commit("productos/alertNotification", {
                    message: message,
                    duration: 2000,
                })
            }
        },
        editNewRegistro(state, index) {
            state.newProd[index].state = 2
        },
        removeNewRegistro(state, index) {
            state.newProd.splice(index, 1);
        },
        // -------------------- Here is were CRUD methods for mobile ends --------------------

        // -------------------- Here is were CRUD methods for desktop start --------------------
        /**
         * Agrega un nuevo producto al arreglo newProd para que se pueda comenzar a agregar el producto
         * @param {state de vue} state 
         * @param {categoria activa} activeTab 
         */
        addProd(state, activeTab) {
            var producto = {
                nombreProd: "",
                activoProd: true,
                stockProd: 0,
                upc: "",
                nombreMarca: "",
                foto: "",
                precioTaller: 0,
                precioMayoreo: 0,
                precioPublico: 0,
                nombreCategoria: activeTab,
                //state 0 -> created | state 1 -> saved | state 2 -> edit
                state: 0,
                //Cuando se quiera guardar, se pondrá en true lo que no cumpla con el formato para darle a conocer al usuario que campo está mal escrito
                format: {
                    nombreProd: false,
                    stockProd: false,
                    upc: false,
                    nombreMarca: false,
                    precioTaller: false,
                    precioMayoreo: false,
                    precioPublico: false
                }
            };
            state.newProd.push(producto);
        },
        /**
         * Se selecciona un producto 
         * Se guarda temporalmente (en cache) por si luego no se persiste la información.
         * Si se está editando y no se guarda y se presiona editar a otro producto, hace rollback (undo transaction)
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
                this.commit("productos/undoEditProd")
                this.commit("productos/editProd", {
                    prod: obj.prod
                })
            }
        },
        /**
         * Undo edit transacion
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
         * Se guardan los cambios del producto editado al queue de edición
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
                this.commit("productos/successNotification", {
                    message: 'Formato correcto.',
                    duration: 2000,
                    tittle: "Exito"
                })
            } else {
                //For re-rendering
                let upc = state.editedProd.upc;
                state.editedProd.upc = 0;
                state.editedProd.upc = upc;
                //Finish re-rendering
                let message = armarMensajeError(errores);
                this.commit("productos/alertNotification", {
                    message: message,
                    duration: 2000,
                })
            }
        },
        /**
         * Agrega al queue de eliminar producto
         * eliman registros, correspondiente al id seleccionado
         * @param {*} state 
         * @param {*} producto 
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
            producto.upc = "";
            producto.upc = cachedProd.upc;
        },
        /**
         * Undo delete transacion
         * Si el producto está en el queue de eliminados pero se decide no eliminarlo 
         * y regresa a su estado anterior. Si se editó, se vuelve a agregar al queue de editados,
         * si no se había hecho nada, entonces queda tal cual.
         * @param {vuex} state 
         * @param {*} producto 
         */
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
            producto.upc = "";
            producto.upc = cachedProd.upc;
        },
        // -------------------- Here is were CRUD methods for desktop ends --------------------

        successNotification(state, {
            message,
            duration,
            tittle
        }) {
            this._vm.$awn.success(message, {
                durations: {
                    success: duration
                },
                labels: {
                    success: tittle
                }
            });
        },
        alertNotification(state, {
            message,
            duration
        }) {
            this._vm.$awn.alert(message, {
                durations: {
                    success: duration
                }
            });
        },
        marcaSelected(state, marca) {
            state.newProductMobile.doc.nombreMarca = marca;
        },
        categoriaSelected(state, categoria) {
            state.newProductMobile.doc.nombreCategoria = categoria;
        },
        fotoSelected(state, foto) {
            state.newProductMobile.doc.foto = foto;
        },

    },
    actions: {
        createProducto({
            state,
            commit,
            dispatch
        }, producto) {
            if (producto.length === 1) {
                //Single add 
                console.log(producto[0].doc)
                var productoDoc = producto[0].doc;
                productoDoc.precioMayoreo = Math.round(productoDoc.precioMayoreo * 100) / 100;
                productoDoc.precioPublico = Math.round(productoDoc.precioPublico * 100) / 100;
                productoDoc.precioTaller = Math.round(productoDoc.precioTaller * 100) / 100;
                productoDoc._id = new Date().toISOString(); //For puchDB we need to add an _id field 
                state.localProductos.put(productoDoc).then(() => {
                    dispatch('readProducto').then(() => commit("successNotification", {
                        "message": "Producto agregado con éxito",
                        "tittle": "EXITO",
                        "duration": 4000
                    }));

                }).catch((err) => {
                    commit("alertNotification", {
                        "message": "Error al guardar el producto<br>" + err,
                        "duration": 8000
                    });
                });
            } else if (producto.length > 1) {
                //bulk operation for desktop
            }
        },
        readProducto({
            state
        }) {
            state.localProductos.allDocs(state.optionsPagination).then(response => {
                state.totalRows = response.total_rows;
                if (response.rows.length > 0) {
                    //condicional verificando si estan al reves y darles la vuelta
                    if (state.optionsPagination.descending) {
                        response.rows = response.rows.reverse();
                    }
                    state.paginationHelper.firstDoc = response.rows[0].id;
                    state.paginationHelper.lastDoc = response.rows[response.rows.length - 1].id;
                    // console.log(response);
                    state.productos = response.rows;

                }
            }).catch(console.log);
        },
        updateProducto({
            state,
            commit,
            dispatch
        }, producto) {
            if (producto.length === 1) {
                //Single add 
                console.log(producto[0].doc)
                var productoDoc = producto[0].doc;
                productoDoc.precioMayoreo = Math.round(productoDoc.precioMayoreo * 100) / 100;
                productoDoc.precioPublico = Math.round(productoDoc.precioPublico * 100) / 100;
                productoDoc.precioTaller = Math.round(productoDoc.precioTaller * 100) / 100;
                state.localProductos.put(productoDoc).then(() => {
                    dispatch('readProducto').then(() => commit("successNotification", {
                        "message": "Producto modificado con éxito",
                        "tittle": "EXITO",
                        "duration": 4000
                    }));

                }).catch((err) => {
                    commit("alertNotification", {
                        "message": "Error al modificar el producto<br>" + err,
                        "duration": 8000
                    });
                });
            } else if (producto.length > 1) {
                //bulk operation for desktop
            }
        },
        // deleteProducto({
        //     state,
        //     commit,
        //     dispatch
        // }, producto) {
        //     console.log("metodo delete");
        // },

        /**
         * 
         * @param {Este método se encarga de hacer todas las operaciones CRUD} state 
         */
        applyAllChanges(state) {
            var message = ""; //Mensaje de notificación
            filteredArrayNewProd(state.newProd).then(nuevosProductos => {
                if (nuevosProductos.length > 0) {
                    state.productos.push(...nuevosProductos)
                    if (nuevosProductos.length == 1) {
                        message += "- Se agregó 1 producto nuevo.<br>"
                    } else {
                        message += `- Se agregaron ${nuevosProductos.length} nuevos productos.<br>`;
                    }
                    // agregar notidicacion de exito
                }
            }).catch(err => {
                //agregar notificación de error
                console.log(err);
            });
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
        initDbProductos({
            state,
            dispatch
        }) {
            const remoteProductos = new state.PouchDB(this._vm.$url + "productos", {
                fetch: function (url, opts) {
                    return state.PouchDB.fetch(url, opts, {
                        credentials: "include"
                    });
                }
            });
            remoteProductos.info().catch(err => {
                if (err.status === 401) {
                    console.log("no autorizado");
                    router.push({
                        path: "/login"
                    }).catch(() => {});
                }
            });

            state.localProductos = new state.PouchDB("productos");
            // do one way, one-off sync from the server until completion
            state.localProductos.replicate.from(remoteProductos).on('complete', () => {
                // console.log("Se terminó la replicación");
                dispatch("readProducto");
                // then two-way, continuous, retriable sync
                state.localProductos.sync(remoteProductos, {
                        live: true,
                        retry: true
                    }).on('change', function (change) {
                        console.log("yo, something changed!", change);
                        dispatch("readProducto");
                    }).on('paused', function (info) {
                        console.log("replication was paused, usually because of a lost connection", info);
                    }).on('active', function (info) {
                        console.log("replication was resumed", info);
                    }).on('denied', function (err) {
                        console.log("a document failed to replicate (e.g. due to permissions)", err);
                    })
                    .on('complete', function (info) {
                        console.log("Completado", info);
                    }).on('error', function (err) {
                        console.log("totally unhandled error (shouldn't happen)", err);
                    });
            })
        },
        // ----------------------- Start of pagination -----------------------
        lastPage({
            state,
            dispatch
        }) {
            state.optionsPagination.skip = 0;
            state.optionsPagination.descending = true;
            state.optionsPagination.startkey = null;
            state.currentPage = Math.ceil(state.totalRows / state.perPage);
            //numer of pages full of products
            var pagesFullofProducts = Math.trunc(state.totalRows / state.perPage);
            //calculate new limit
            var newLimit = state.totalRows - (state.perPage * pagesFullofProducts);
            state.optionsPagination.limit = newLimit;
            dispatch("readProducto");
        },
        firstPage({
            state,
            dispatch
        }) {
            state.optionsPagination.skip = 0;
            state.currentPage = 1;
            state.optionsPagination.descending = false;
            state.optionsPagination.startkey = null;
            dispatch("readProducto");
        },
        nextPage({
            state,
            dispatch
        }, page) {
            state.currentPage = page;
            var lastPage = Math.ceil(state.totalRows / state.perPage);
            if (state.currentPage < lastPage) {
                state.optionsPagination.skip = 1;
                state.optionsPagination.descending = false;
                state.optionsPagination.startkey = state.paginationHelper.lastDoc;
                dispatch("readProducto");
            } else if (lastPage === state.currentPage) {
                dispatch("lastPage");
            }
        },
        prevPage({
            state,
            dispatch
        }, page) {
            state.currentPage = page;
            if (state.currentPage > 1) {
                state.optionsPagination.descending = true;
                state.optionsPagination.skip = 1;
                state.optionsPagination.startkey = state.paginationHelper.firstDoc;
                dispatch("readProducto");
            } else if (state.currentPage === 1) {
                dispatch("firstPage");
            }
        },
        setPage({
            state,
            dispatch
        }, page) {
            state.optionsPagination.limit = state.perPage;
            if (page === 1) {
                dispatch("firstPage");
            } else if (page < state.currentPage) {
                dispatch("prevPage", page);
            } else if (page > state.currentPage) {
                dispatch("nextPage", page);
            }
        },
        // ----------------------- End of pagination -----------------------
        /**
         * Called from AddEditProdMovile when clicked on "confirmar" 
         * Decides whether the transaction belongs to a new product (creates it)
         * or if the product has to be updated
         * @param {vuex} param0 
         * @param {product} producto 
         */
        confirmation({
            dispatch
        }, producto) {
            console.log("Confirmation: ", producto);
            //Verify in confirmation is for update o create new
            if (producto.id) {
                dispatch("updateProducto", [producto])
            } else {
                dispatch("createProducto", [producto])
            }
        },
        // createIndexs({
        //     state,
        //     dispatch
        // }){

        // }
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
    return new Promise((resolve, reject) => {
        try {
            let res = newProd.filter((prod) => {
                if (prod.state === 1) {
                    delete prod.format;
                    delete prod.state;
                    return true;
                }
                return false;
            });
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
}

function filterModifyFields(modifyProds) {
    return new Promise((resolve, reject) => {
        try {
            let res = modifyProds.filter((prod) => {
                delete prod.format;
                delete prod.saved;
                return true;
            });
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
}

function filterDelete(deleteProds) {
    return new Promise((resolve, reject) => {
        try {
            let res = deleteProds.filter((prod) => {
                delete prod.format;
                delete prod.saved;
                delete prod.delete;
                return true;
            });
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
}