import router from '../../router/index'
var PouchDB = require('pouchdb').default;
export default {
    namespaced: true,
    state: {
        ordenes: [{
            "nombrePago": "Tarjeta de débito",
            "idOrden": 1,
            "fechaOrd": "25/Enero/2021",
            "metodoPago": "Criptomoneda",
            "nombreCliente": "Cristian Ayala",
            "observacionesOrden": "No tiene moto pero viene a comprar",
            "totalOrden": 155.97,
            "productos": [{
                nombreProd: "20W50",
                activoProd: true,
                descripcion: "Lubricante para motos",
                idCategoria: 3,
                precioUnit: 5,
                stockProd: 100,
                upc: 53260,
                nombreMarca: "Motul",
                nombreCategoria: "Lubricantes",
                cantidad: 3,
                descuento: 0
            }, {
                nombreProd: "System 7 Blanco",
                activoProd: true,
                descripcion: "Carcasa completa de carbono",
                idCategoria: 1,
                precioUnit: 57.99,
                stockProd: 16,
                upc: 37842,
                nombreMarca: "BMW",
                nombreCategoria: "Cascos",
                cantidad: 5,
                descuento: 50
            }]
        }],
        orden: {
            "nombreCliente": "",
            "observacionesOrden": "",
            "totalOrden": 0
        },
        searchDisplay: "",
        marcas: [{
                nombreMarca: "Motul",
                activoMarca: true,
                descripMarca: "Generalmente vende productos de mantenimineto de motos",
            }, {
                nombreMarca: "BMW",
                activoMarca: true,
                descripMarca: "Motos lujosas",
            },
            {
                nombreMarca: "Kawasaki",
                activoMarca: true,
                descripMarca: "Fabricadas en plantas en Japón.",
            }, {
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
        ordSelected: {},
        productos: [{
            nombreProd: "20W50",
            activoProd: true,
            descripcion: "Lubricante para motos",
            idCategoria: 3,
            precioUnit: 5,
            stockProd: 100,
            upc: 53260,
            nombreMarca: "Motul",
            nombreCategoria: "Lubricantes",
            cantidad: 0,
            descuento: 0
        }, {
            nombreProd: "System 7 Blanco",
            activoProd: true,
            descripcion: "Carcasa completa de carbono",
            idCategoria: 1,
            precioUnit: 57.99,
            stockProd: 16,
            upc: 37842,
            nombreMarca: "BMW",
            nombreCategoria: "Cascos",
            cantidad: 0,
            descuento: 0
        }],
        metPago: [{
            "name": "Tarjeta de Crédito"
        }, {
            "name": "Tarjeta de Débito"
        }, {
            "name": "Efectivo"
        }, {
            "name": "Credito Fiscal"
        }, {
            "name": "Criptomoneda"
        }],
        detalleOrden: [],
        activaOrd: [],
        prodSearch: "",
        findProductos: [],
        searchTotalRows: 0,
        showDetOrd: false,
        delay: 700,
        clicks: 0,
        timer: null,
        currentPage: 1,
        skipPagination: 0,
        localOrdenes: null,
        "PouchDB": PouchDB,
    },
    mutations: {
        /*
        creacion de nuevos registros
        (no se pueden crear registros vacios)
         */
        createRegistro: function () {
            //minizar el paquete de enviada de los productos
            this.detalleOrden = this.productos.map(obj => {
                let objet = {
                    "precioUnit": obj.precioUnit,
                    "upc": obj.upc,
                    "cantidadProd": obj.cantidad,
                    "descuento": obj.descuento,
                    "stockProd": obj.stockProd
                };
                return objet;
            });
            this.detalleOrden = this.detalleOrden.filter(obj => obj.cantidadProd > 0);
        },
        formatDate: function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
        },

        /*
        limpiando valores de la marca previamente seleccionada
         */
        clearData() {
            this.ordSelected = {};
            this.orden = {
                "nombreCliente": "",
                "observacionesOrden": "",
                "totalOrden": 0
            }
        },
        filtro(valor) {
            if (this.searchDisplay === "") return true;
            let array = (this.ordenes[valor].idOrden + this.ordenes[valor].observacionesOrden + this.ordenes[valor].totalOrden + this.ordenes[valor].nombreCliente).toUpperCase();
            return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
        },
        filtroProd(state, valor) {
            let x = 0;
            if (x == 0) return true;
            if (state.prodSearch === "") return true;
            let array = (this.marcas.filter(mar => mar.idMarca === this.productos[valor].idMarca)[0].nombreMarca + this.categorias.filter(cat => cat.idCategoria === this.productos[valor].idCategoria)[0].nombreCat + this.productos[valor].nombreProd + this.productos[valor].descripcion + this.productos[valor].precioUnit + this.productos[valor].stockProd + this.productos[valor].upc).toUpperCase();
            return array.indexOf(this.prodSearch.toUpperCase()) >= 0;
        },
        doubleClick: function () {
            const btndetOrd = document.getElementById("btnDetOrden");
            btndetOrd.click()
        },
        converterIdCat2CatName: function (idCat) {
            return idCat;
            //return this.categorias.filter(cat => cat.idCategoria === idCat)[0].nombreCat;
        },
        converterIdMar2MarName: function (idMarca) {
            return idMarca;
            // return this.marcas.filter(mar => mar.idMarca === idMarca)[0].nombreMarca;
        },
        enforceMinMax(produ) {
            console.log("key up event, cant: ", produ.cantidad, " stock: ", produ.stockProd)
            if (parseInt(produ.cantidad) < 0) {
                produ.cantidad = 0;
            }
            if (produ.cantidad > produ.stockProd) {
                console.log("Es mayor")
                produ.cantidad = produ.stockProd;
            }
        },
        change(prod, e) {
            let item = e.target.value.replace(/[^\d]/g, '');
            if (item < prod.stockProd) {
                e.target.value = item;
            } else {
                e.target.value = prod.stockProd;
            }
        },
        //decrementar cantidad del producto a valores no negativos
        decProducto(produ) {
            if (produ.cantidad > 1) {
                produ.cantidad--;
            } else {
                produ.cantidad = null;
            }
            // produ.subtotal = this.subtotal(produ.cantidad, produ.precio);
        },
        //incrementar cantidad del producto 
        incProducto(produ) {
            if (parseInt(produ.cantidad) >= parseInt(produ.stockProd)) {
                produ.cantidad = produ.stockProd - 1;
            }
            produ.cantidad++;
            // produ.subtotal = this.subtotal(produ.cantidad, produ.precio);
        },
        calcularTotal() {
            this.orden.totalOrden = 0;
            this.productos.forEach(prod => {
                this.orden.totalOrden += ((prod.precioUnit * prod.cantidad) - (prod.precioUnit * prod.cantidad * (prod.descuento / 100)));
            });
        },
        primerosDigitos(idOrden) {
            try {
                return idOrden.substring(0, 5);
            } catch (error) {
                return idOrden;
            }
        },
        dosDecimalesProd(precio) {
            try {
                return precio.toFixed(2);
            } catch (error) {
                return precio;
            }
        },
        clickRow(state, ord) {
            state.clicks++;
            if (state.clicks === 1) {
                state.ordSelected = ord;
                state.showDetOrd = false;
                state.timer = setTimeout(() => {
                    state.clicks = 0;
                }, state.delay);
            } else {
                clearTimeout(state.timer);
                state.showDetOrd = true;
                state.clicks = 0;
            }
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
        }
    },
    actions: {
        initDbOrdenes({
            state,
            dispatch
        }) {
            console.log(state, PouchDB);
            dispatch("searchProductos")
            const remoteOrdenes = new state.PouchDB(this._vm.$url + "ordenes", {
                fetch: function (url, opts) {
                    return state.PouchDB.fetch(url, opts, {
                        credentials: "include"
                    });
                }
            });
            remoteOrdenes.info().catch(err => {
                if (err.status === 401) {
                    console.log("no autorizado");
                    router.push({
                        path: "/login"
                    }).catch(() => {});
                }
            });

            state.localOrdenes = new state.PouchDB("ordenes");
            // do one way, one-off sync from the server until completion
            state.localOrdenes.replicate.from(remoteOrdenes).on('complete', () => {
                // console.log("Se terminó la replicación");
                dispatch("readAllOrdenes"); // Get all de ordenes
                //dispatch("createIndexes");
                // then two-way, continuous, retriable sync
                state.localOrdenes.sync(remoteOrdenes, {
                        live: true,
                        retry: true
                    }).on('change', function (change) {
                        console.log("yo, something changed!", change);
                        dispatch("readAllOrdenes"); // Get all de ordenes
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
        async createRegistroOrdenes({ state, commit }, orden) {
            console.log(orden);
            //For puchDB we need to add an _id field 
            return state.localOrdenes.put(orden).then((result) => {
                console.log("created", result);
                commit("successNotification", {
                    "message": "Marca agregada con éxito",
                    "tittle": "EXITO",
                    "duration": 4000
                })
            }).catch((err) => {
                commit("alertNotification", {
                    "message": "Error al guardar la marca<br>" + err,
                    "duration": 4000
                });
                console.error("error trying insert order", err);
            });
        },
        readAllOrdenes({ state }) {
            return state.localOrdenes.allDocs({
                include_docs: true,
                descending: false
            }).then((result) => {
                console.log("read", result);
                state.ordenes = result.rows;
            }).catch((err) => {
                console.error("error trying read all orders", err);
            }
            );
        },
        searchProductos({
            state
        }, searchProduct) {
            // console.log("This is the state from Ordenes :B\n", this.state.productos.localProductos);
            this.state.productos.localProductos.search({
                query: searchProduct,
                fields: ['nombreProd', 'upc'],
                include_docs: true,
                highlighting: true,
                limit: 10,
                skip: state.skipPagination,
                mm: '33%'
            }).then(function (res) {
                state.findProductos = res.rows;
                state.searchTotalRows = res.total_rows;
                // console.log(res);
            }).catch(function (err) {
                console.err(err);
            });
        },
        paginationNavPlugin({
            state,
            dispatch
        }, {prevOrNext, searchProduct}) {
            if (prevOrNext === "prev") {
                if (state.currentPage > 1) {
                    state.currentPage--;
                    state.skipPagination = state.skipPagination - 10;
                    dispatch("searchProductos", searchProduct);
                }
            } else {
                let totalPages = Math.ceil(state.searchTotalRows / 10);
                if (state.currentPage < totalPages) {
                    state.currentPage++;
                    state.skipPagination = state.skipPagination + 10;
                    dispatch("searchProductos", searchProduct);
                }
            }
        }
    }
}