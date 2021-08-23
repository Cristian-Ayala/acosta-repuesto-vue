var PouchDB = require('pouchdb').default;
PouchDB.plugin(require('pouchdb-find').default);
export default {
    namespaced: true,
    state: {
        "marcas": [],
        "marca": {
            "nombreMarca": "",
            "activoMarca": true,
            "descripMarca": "",
        },
        "marSelected": {},
        "localMarca": null,
        "PouchDB": PouchDB,
    },
    mutations: {
        clearData(state) {
            state.marca = {
                nombreMarca: "",
                activoMarca: true,
                descripMarca: "",
            };
        },
        getMarcaSelected(state, mar) {
            state.marca = mar;
            state.marSelected = JSON.parse(JSON.stringify(mar));
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
        createRegistro({
            state,
            dispatch,
            commit
        }) {
            if (state.marca.nombreMarca.trim() !== "") {
                //For puchDB we need to add an _id field 
                state.marca._id = new Date().toISOString()
                state.localMarca.put(state.marca).then(() => {

                    dispatch('getAll').then(() => commit("successNotification", {
                        "message": "Marca agregada con éxito",
                        "tittle": "EXITO",
                        "duration": 4000
                    }));

                }).catch((err) => {
                    commit("alertNotification", {
                        "message": "Error al guardar la marca<br>" + err,
                        "duration": 4000
                    });
                });
            } else {
                commit("alertNotification", {
                    "message": "Por favor, introduce un nombre para la marca",
                    "duration": 4000
                });
            }
        },
        getAll({
            state,
            commit
        }) {
            /**
             * Does not matter if all docs are retived even if they are deleted (activoMarca = false)
             * Because it's handled in marcas component
             */
            state.localMarca.allDocs({
                include_docs: true,
                descending: false
            }).then(doc => {
                state.marcas = doc.rows.filter(marca => marca.doc.activoMarca);
            }).catch(err => commit("alertNotification", {
                "message": "Error al listar marcas.<br>" + err,
                "duration": 4000
            }));
        },
        edithRegistro({
            state,
            commit,
            dispatch
        }) {
            state.localMarca.put(state.marSelected.doc).then(() => {
                dispatch("getAll").then(() => commit("successNotification", {
                    "message": "Marca editada con éxito",
                    "tittle": "EXITO",
                    "duration": 4000
                }));
            }).catch((err) => {
                commit("alertNotification", {
                    "message": "Error al editar la marca<br>" + err,
                    "duration": 4000
                });
            });
        },
        removeRegistro({
            state,
            commit,
            dispatch
        }) {
            state.marca.doc.activoMarca = false;
            state.localMarca.put(state.marca.doc).then(() => {
                dispatch("getAll");
                commit("successNotification", {
                    "message": "Marca eliminada con éxito",
                    "tittle": "EXITO",
                    "duration": 4000
                });
            }).catch((err) => {
                commit("alertNotification", {
                    "message": "Error al eliminar la marca<br>" + err,
                    "duration": 4000
                });
            });
        },
        initDB({
            state,
            dispatch
        }) {
            // console.log(this._vm.$url, " Es el url a la que hacer fetch");
            const remoteMarca = new state.PouchDB(this._vm.$url + "marcas", {
                headers: {
                    'Authorization': 'Basic Credentials'
                }
            });

            state.localMarca = new state.PouchDB("marcas");
            // do one way, one-off sync from the server until completion
            state.localMarca.replicate.from(remoteMarca).on('complete', () => {
                // console.log("Se terminó la replicación");
                dispatch("getAll");
                // then two-way, continuous, retriable sync
                state.localMarca.sync(remoteMarca, {
                        live: true,
                        retry: true
                    }).on('change', function (change) {
                        console.log("yo, something changed!", change);
                        dispatch("getAll");
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