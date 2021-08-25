import router from '../../router/index'
var PouchDB = require('pouchdb').default;
export default {
    namespaced: true,
    state: {
        "categorias": [],
        "categoria": {
            "nombreCategoria": "",
            "activoCat": true,
            "descripcion": "",
        },
        "catSelected": {},
        "PouchDB": PouchDB,
        "localCategorias": null
    },
    mutations: {
        /**
         * limpiando valores de la categoria previamente seleccionada
         * @param {*} state 
         */
        clearDataCat(state) {
            state.categoria = {
                nombreCategoria: "",
                activoCat: true,
                descripcion: "",
            };
        },
        /**
         * 
         * @param {*} cat 
         */
        getCategoriaSelected(state, cat) {
            state.categoria = cat;
            state.catSelected = JSON.parse(JSON.stringify(cat));
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
    },
    actions: {
        /**
         * Crea registro con categoria
         * El nombre no tiene que ir vacío
         * @param {*} state 
         */
        createRegistro({
            state,
            dispatch,
            commit
        }) {
            if (state.categoria.nombreCategoria.trim() !== "") {
                //For puchDB we need to add an _id field 
                state.categoria._id = new Date().toISOString();
                state.localCategorias.put(state.categoria).then(() => {
                    dispatch('getAllCategorias').then(() => commit("successNotification", {
                        "message": "Categoria agregada con éxito",
                        "tittle": "EXITO",
                        "duration": 4000
                    }));

                }).catch((err) => {
                    commit("alertNotification", {
                        "message": "Error al guardar la categoria<br>" + err,
                        "duration": 4000
                    });
                });
            }
        },
        getAllCategorias({
            state,
            commit
        }) {
            state.localCategorias.allDocs({
                include_docs: true,
                descending: false
            }).then(doc => {
                state.categorias = doc.rows.filter(cat => cat.doc.activoCat);
            }).catch(err => commit("alertNotification", {
                "message": "Error al listar categorias.<br>" + err,
                "duration": 8000
            }));
        },
        edithRegistro({
            state,
            commit,
            dispatch
        }) {
            state.localCategorias.put(state.catSelected.doc).then(() => {
                dispatch("getAllCategorias").then(() => commit("successNotification", {
                    "message": "Categoria editada con éxito",
                    "tittle": "EXITO",
                    "duration": 4000
                }));
            }).catch((err) => {
                commit("alertNotification", {
                    "message": "Error al editar la categoria<br>" + err,
                    "duration": 4000
                });
            });
        },
        /**
         * Elimina un registro
         * @returns nada we :v,¿esperabas algo?
         */
        removeRegistro({
            state,
            commit,
            dispatch
        }) {
            state.categoria.doc.activoCat = false;
            state.localCategorias.put(state.categoria.doc).then(() => {
                dispatch("getAllCategorias");
                commit("successNotification", {
                    "message": "Categoria eliminada con éxito",
                    "tittle": "EXITO",
                    "duration": 4000
                });
            }).catch((err) => {
                commit("alertNotification", {
                    "message": "Error al eliminar la categoria<br>" + err,
                    "duration": 4000
                });
            });
        },
        initDbCategorias({
            state,
            dispatch
        }) {
            const remoteCategorias = new state.PouchDB(this._vm.$url + "categorias", {
                fetch: function (url, opts) {
                    return state.PouchDB.fetch(url, opts, {
                        credentials: "include"
                    });
                }
            });
            remoteCategorias.info().catch(err => {
                if (err.status === 401) {
                    console.log("no autorizado");
                    router.push({
                        path: "/login"
                    })
                }
            });

            state.localCategorias = new state.PouchDB("categorias");
            // do one way, one-off sync from the server until completion
            state.localCategorias.replicate.from(remoteCategorias).on('complete', () => {
                // console.log("Se terminó la replicación");
                dispatch("getAllCategorias");
                // then two-way, continuous, retriable sync
                state.localCategorias.sync(remoteCategorias, {
                        live: true,
                        retry: true
                    }).on('change', function (change) {
                        console.log("yo, something changed!", change);
                        dispatch("getAllCategorias");
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
        }
    }
}