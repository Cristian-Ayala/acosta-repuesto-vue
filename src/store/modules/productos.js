import router from '../../router/index'
var PouchDB = require('pouchdb').default;
PouchDB.plugin(require('pouchdb-find').default);
PouchDB.plugin(require('pouchdb-quick-search'));
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
        totalRows: 0,
        optionsPagination: {
            descending: false,
            limit: 5,
            startkey: null,
            skip: 0,
            selectorFilter: {
                $gt: null
            },
        },
        paginationHelper: {
            firstDoc: null,
            lastDoc: null,
        },
        filtroCategorias: [],
        filtroMarcas: [],
        filtroNombre: "",
        filtroUPC: "",
        tempFiltroUPC: "",
        calledFrom: "",
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
                //Cuando se quiera guardar, se pondr?? en true lo que no cumpla con el formato para darle a conocer al usuario que campo est?? mal escrito
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
         * Se guarda temporalmente (en cache) por si luego no se persiste la informaci??n.
         * Si se est?? editando y no se guarda y se presiona editar a otro producto, hace rollback (undo transaction)
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
         * Se guardan los cambios del producto editado al queue de edici??n
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
                //Si no est?? en el arreglo lo agrega
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
         * Si el producto est?? en el queue de eliminados pero se decide no eliminarlo 
         * y regresa a su estado anterior. Si se edit??, se vuelve a agregar al queue de editados,
         * si no se hab??a hecho nada, entonces queda tal cual.
         * @param {vuex} state 
         * @param {*} producto 
         */
        transactionRemove(state, producto) {
            //Si el producto hab??a sido guardado, regresa al queue de guardar
            if (producto.saved) {
                state.editTransaction.push(producto);
            }

            var inTran = state.deleteTransaction.findIndex(
                (element) => element.upc === producto.upc
            );
            if (inTran < 0) {
                console.log("No se encontr?? documento");
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
        setFiltroUPC(state, upc) {
            state.tempFiltroUPC = upc;
        },
        setCalledFrom(state, calledFrom) {
            state.calledFrom = calledFrom;
        },
    },
    actions: {
        async validarDatos({
            state
        }, productoDoc) {
            try {
                if (!productoDoc.upc) {
                    throw new Error("Agregue un UPC");
                }
                var numbersOfUPCs;
                numbersOfUPCs = await state.localProductos.find({
                    selector: {
                        "upc": productoDoc.upc
                    }
                }, ).then(response => {
                    return response.docs;
                }).catch((err) => {
                    // an error occured
                    console.error(err);
                    return null;
                });
                if (!productoDoc.nombreProd) {
                    throw new Error("El nombre no puede estar vac??o");
                }
                if (!productoDoc.foto) {
                    throw new Error("Tiene que agregar una foto");
                }
                if (!productoDoc.nombreMarca) {
                    throw new Error("Tiene que agregar una Marca");
                }
                if (!productoDoc.nombreCategoria) {
                    throw new Error("Tiene que agregar una Categoria");
                }
                if (!(productoDoc.precioMayoreo > 0)) {
                    throw new Error("El precio de mayoreo no puede ser menor a 0");
                }
                if (!(productoDoc.precioPublico > 0)) {
                    throw new Error("El precio de publico no puede ser menor a 0");
                }
                if (!(productoDoc.precioTaller > 0)) {
                    throw new Error("El precio de taller no puede ser menor a 0");
                }
                return numbersOfUPCs;
            } catch (error) {
                return error;
            }
        },
        async createProducto({
            state,
            commit,
            dispatch
        }, producto) {
            if (producto.length === 1) {
                //Single add 
                try {
                    var productoDoc = producto[0].doc;
                    productoDoc.precioMayoreo = Math.round(productoDoc.precioMayoreo * 100) / 100;
                    productoDoc.precioPublico = Math.round(productoDoc.precioPublico * 100) / 100;
                    productoDoc.precioTaller = Math.round(productoDoc.precioTaller * 100) / 100;
                    var totalNumberOfUPCs;
                    totalNumberOfUPCs = await dispatch("validarDatos", productoDoc)
                    if (!(typeof totalNumberOfUPCs.length === 'number')) {
                        throw new Error(totalNumberOfUPCs);
                    }
                    if (totalNumberOfUPCs.length > 0) {
                        throw new Error("Ya existe un producto con ese UPC");
                    }
                    productoDoc._id = new Date().toISOString(); //For puchDB we need to add an _id field 
                    state.localProductos.put(productoDoc).then(() => {
                        dispatch('readProducto').then(() => commit("successNotification", {
                            "message": "Producto agregado con ??xito",
                            "tittle": "EXITO",
                            "duration": 4000
                        }));
                    }).catch((err) => {
                        commit("alertNotification", {
                            "message": "Error al guardar el producto<br>" + err,
                            "duration": 8000
                        });
                    });
                } catch (err) {
                    commit("alertNotification", {
                        "message": "Error al guardar el producto<br>" + err,
                        "duration": 4000
                    });
                }

            } else if (producto.length > 1) {
                //bulk operation for desktop
            }
        },
        readProducto({
            state,
            dispatch
        }) {
            // filtroNombre: "",
            if (state.filtroUPC.trim() !== "") {
                dispatch("readProductsUPC");
                return;
            }
            if (state.filtroNombre.trim() !== "" || state.filtroCategorias.length > 0 || state.filtroMarcas.length > 0) {
                dispatch('readProductoCategoriaMarcaNombre');
                return;
            }
            dispatch('readAllProducts');
        },
        async updateProducto({
            state,
            commit,
            dispatch
        }, producto) {
            if (producto.length === 1) {
                try {
                    var productoDoc = producto[0].doc;
                    productoDoc.precioMayoreo = Math.round(productoDoc.precioMayoreo * 100) / 100;
                    productoDoc.precioPublico = Math.round(productoDoc.precioPublico * 100) / 100;
                    productoDoc.precioTaller = Math.round(productoDoc.precioTaller * 100) / 100;
                    var totalNumberOfUPCs;
                    totalNumberOfUPCs = await dispatch("validarDatos", productoDoc)
                    if (!(typeof totalNumberOfUPCs.length === 'number')) {
                        throw new Error(totalNumberOfUPCs);
                    }
                    if (totalNumberOfUPCs.length > 0) {
                        console.log("Se verifica que los _id's sean iguales");
                        if (productoDoc._id !== totalNumberOfUPCs[0]._id) {
                            console.log("No es el mismo doc as?? que no se modifica, se arroja error que el upc ya existe");
                            throw new Error("El UPC ya existente. S??lo puede haber 1.")
                        }
                    }
                    console.log("se cambia el upc, y todo el doc se actualiza");
                    state.localProductos.put(productoDoc).then(() => {
                        dispatch('readProducto').then(() => commit("successNotification", {
                            "message": "Producto modificado con ??xito",
                            "tittle": "EXITO",
                            "duration": 4000
                        }));

                    }).catch((err) => {
                        commit("alertNotification", {
                            "message": "Error al modificar el producto<br>" + err,
                            "duration": 8000
                        });
                    });
                } catch (err) {
                    commit("alertNotification", {
                        "message": "Error al guardar el producto<br>" + err,
                        "duration": 4000
                    });
                }
            } else if (producto.length > 1) {
                //bulk operation for desktop
            }
        },
        deleteProducto({
            state,
            commit,
            dispatch
        }, producto) {
            console.log(producto);
            producto.doc._deleted = true;
            producto.doc.activoProd = false;
            state.localProductos.put(producto.doc).then(() => {
                dispatch('readProducto').then(() => commit("successNotification", {
                    "message": "Producto eliminado con ??xito",
                    "tittle": "EXITO",
                    "duration": 4000
                }));

            }).catch((err) => {
                commit("alertNotification", {
                    "message": "Error al eliminar el producto<br>" + err,
                    "duration": 8000
                });
            });
        },

        /**
         * 
         * @param {Este m??todo se encarga de hacer todas las operaciones CRUD} state 
         */
        applyAllChanges(state) {
            var message = ""; //Mensaje de notificaci??n
            filteredArrayNewProd(state.newProd).then(nuevosProductos => {
                if (nuevosProductos.length > 0) {
                    state.productos.push(...nuevosProductos)
                    if (nuevosProductos.length == 1) {
                        message += "- Se agreg?? 1 producto nuevo.<br>"
                    } else {
                        message += `- Se agregaron ${nuevosProductos.length} nuevos productos.<br>`;
                    }
                    // agregar notidicacion de exito
                }
            }).catch(err => {
                //agregar notificaci??n de error
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
                    message += "\n- Se modific?? 1 producto.<br>"
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
                    message += "\n- Se elimin?? 1 producto.<br>"
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
                // console.log("Se termin?? la replicaci??n");
                dispatch("readProducto");
                //dispatch("createIndexes");
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
        createIndexes({
            state
        }) {
            state.localProductos.createIndex({
                index: {
                    fields: ['nombreMarca', 'nombreCategoria'],
                    ddoc: "marcas_categorias"
                }
            }).then(() => {
                console.log("Index creado");
            }).catch((err) => {
                console.log(err);
            });
            state.localProductos.createIndex({
                index: {
                    fields: ['nombreMarca'],
                    ddoc: "marcas"
                }
            }).then(() => {
                console.log("Index marcas creado");
            }).catch((err) => {
                console.log(err);
            });
            state.localProductos.createIndex({
                index: {
                    fields: ['nombreCategoria'],
                    ddoc: "categorias"
                }
            }).then(() => {
                console.log("Index categorias creado");
            }).catch((err) => {
                console.log(err);
            });
        },
        readAllProducts({
            state
        }) {
            if (state.currentPage === 1) {
                state.localProductos.query('totalProd/totalProd').then((response) => {
                    state.totalRows = response.rows[0].value;
                }).catch(console.log);
            }
            let totalLimit = state.optionsPagination.skip + state.optionsPagination.limit;
            state.localProductos.find({
                "selector": {
                    "_id": {
                        ...state.optionsPagination.selectorFilter
                    }
                },
                "limit": totalLimit,
                "sort": [{
                    "_id": state.optionsPagination.descending ? "desc" : "asc"
                }],
            }).then((response) => {
                if (state.optionsPagination.descending) {
                    response.docs = response.docs.reverse();
                }
                state.paginationHelper.firstDoc = response.docs[0]._id;
                state.paginationHelper.lastDoc = response.docs[response.docs.length - 1]._id;
                state.productos = response.docs.map(el => ({
                    doc: el
                })); //para darle formato a la respuesta
            }).catch((err) => {
                console.log(err);
            });
        },
        readProductsUPC({
            state
        }) {
            console.log("Filtro de UPC");
            state.localProductos.find({
                selector: {
                    upc: state.filtroUPC
                }
            }).then(response => {
                state.totalRows = response.docs.length;
                if (response.docs.length > 0) {
                    state.productos = response.docs.map(el => ({
                        doc: el
                    })); //para darle formato a la respuesta
                } else {
                    state.productos = [];
                }
            }).catch(console.log);
        },
        readProductoCategoriaMarcaNombre({
            state
        }) {
            let selector = {};
            selector._id = {
                ...state.optionsPagination.selectorFilter
            };
            if (state.filtroNombre) {
                selector.nombreProd = {
                    "$regex": RegExp(state.filtroNombre, "i"),
                }
            }
            if (state.filtroMarcas.length > 0) {
                selector.nombreMarca = {
                    $in: state.filtroMarcas.map(marca => marca.nombreMarca)
                };
            }
            if (state.filtroCategorias.length > 0) {
                selector.nombreCategoria = {
                    $in: state.filtroCategorias.map(categoria => categoria.nombreCategoria)
                };
            }
            //Put code below on an if, it will be called just once
            //This is just to find out how many documents are in total
            //Pagination purposes
            if (state.currentPage === 1) {
                state.localProductos.find({
                    selector: selector,
                }).then((response) => {
                    state.totalRows = response.docs.length;
                    console.log(state.totalRows);
                }).catch(console.log);
            }
            //This is the actual query
            state.localProductos.find({
                "selector": selector,
                "limit": state.optionsPagination.limit,
                "sort": [{
                    "_id": state.optionsPagination.descending ? "desc" : "asc"
                }],
            }).then(function (response) {
                if (response.docs.length > 0) {
                    //condicional verificando si estan al reves y darles la vuelta
                    if (state.optionsPagination.descending) {
                        response.docs = response.docs.reverse();
                    }
                    state.paginationHelper.firstDoc = response.docs[0]._id;
                    state.paginationHelper.lastDoc = response.docs[response.docs.length - 1]._id;
                    state.productos = response.docs.map(el => ({
                        doc: el
                    })); //para darle formato a la respuesta
                } else {
                    state.productos = [];
                }
            }).catch(console.log);
        },
        // ----------------------- Start of pagination -----------------------
        lastPage({
            state,
            dispatch
        }) {
            // startkey
            state.optionsPagination.selectorFilter = {
                $gt: null
            };
            state.optionsPagination.skip = 0;
            state.optionsPagination.descending = true;
            state.currentPage = Math.ceil(state.totalRows / state.perPage);
            //numer of pages full of products
            var pagesFullofProducts = Math.trunc(state.totalRows / state.perPage);
            //calculate new limit
            var newLimit = state.totalRows - (state.perPage * pagesFullofProducts);
            state.optionsPagination.limit = newLimit; //New limit must be calculates because the last page is not full of products, so it will be less than the perPage
            dispatch("readProducto");
        },
        firstPage({
            state,
            dispatch
        }) {
            // startkey
            state.optionsPagination.selectorFilter = {
                $gt: null
            };
            state.optionsPagination.limit = state.perPage;
            state.optionsPagination.skip = 0;
            state.currentPage = 1;
            state.optionsPagination.descending = false;
            dispatch("readProducto");
        },
        nextPage({
            state,
            dispatch
        }, page) {
            // startkey
            state.optionsPagination.selectorFilter = {
                $gt: state.paginationHelper.lastDoc
            };
            state.currentPage = page;
            var lastPage = Math.ceil(state.totalRows / state.perPage);
            if (state.currentPage < lastPage) {
                state.optionsPagination.skip = 1;
                state.optionsPagination.descending = false;
                dispatch("readProducto");
            } else if (lastPage === state.currentPage) {
                dispatch("lastPage");
            }
        },
        prevPage({
            state,
            dispatch
        }, page) {
            // startkey
            state.optionsPagination.selectorFilter = {
                $lt: state.paginationHelper.firstDoc
            };
            state.currentPage = page;
            if (state.currentPage > 1) {
                state.optionsPagination.descending = true;
                state.optionsPagination.skip = 1;
                dispatch("readProducto");
            } else if (state.currentPage === 1) {
                dispatch("firstPage");
            }
        },
        setPage({
            state,
            dispatch
        }, page) {
            if (page === state.currentPage) {
                return;
            }
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
            if (producto.doc._rev) {
                dispatch("updateProducto", [producto])
            } else {
                dispatch("createProducto", [producto])
            }
        },
        aplicarFiltros({
            state,
            dispatch
        }, prod) {
            state.filtroCategorias = prod.cat;
            state.filtroMarcas = prod.mar;
            state.filtroUPC = prod.upc;
            state.filtroNombre = prod.nom;
            dispatch("firstPage");
        },
        borrarFiltros({
            state,
            dispatch
        }) {
            state.filtroCategorias = [];
            state.filtroMarcas = [];
            state.filtroUPC = "";
            state.filtroNombre = "";
            dispatch("firstPage");
        }
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

    //Verifica que la marca no est?? vacia y exista 
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