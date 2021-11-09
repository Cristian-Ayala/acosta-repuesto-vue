import router from '../../router/index'
import axios from "axios";

var PouchDB = require('pouchdb').default;
PouchDB.plugin(require('pouchdb-authentication').default);
// PouchDB.plugin(require('pouchdb-find').default);
var axios1 = axios.create({
    withCredentials: true,
});
var remoteUsuarios;
const remotedb = async (url) => {
    remoteUsuarios = await new PouchDB(url + "marcas", {
        skip_setup: true
    });
}
export default {
    namespaced: true,
    state: {
        "localUsuarios": null,
        "PouchDB": PouchDB,
        "usuario": {},
        "usuarios": [],
        "showModalEdit": false
    },
    mutations: {
        clearData(state) {
            state.usuario = {}
        },
        setUser(state, user) {
            state.usuario = user;
        },
        setModalEditShow(state, value) {
            console.log("Click");
            state.showModalEdit = value;
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
            remoteUsuarios.signUp(state.usuario.nickname, state.usuario.password).then(() => {
                dispatch('getAll').then(() => commit("successNotification", {
                    "message": "Usuario creado con éxito",
                    "tittle": "EXITO",
                    "duration": 4000
                }))
            }).catch((err) => {
                console.log(JSON.stringify(err));
                let mensaje = "";
                if (err.error === "conflict") {
                    mensaje = "El usuario ya existe.";
                } else if (err.error === "forbidden") {
                    mensaje = "Existen caracteres que no son válidos en el usuario."
                }

                commit("alertNotification", {
                    "message": "Error al crear usuario<br>" + mensaje,
                    "duration": 4000
                });
            });
        },
        getAll({
            state
        }) {
            axios1({
                    method: "GET",
                    url: `https://www.couchdb.me/_users/_all_docs/`,
                })
                .then((res) => {
                    if (res.status === 200) {
                        state.usuarios = res.data.rows.filter(usr => usr.id.includes('org'));
                    }
                })
                .catch((error) => {
                    console.log(JSON.stringify(error));
                });
            // remoteUsuarios.logIn('useradmin', 'password').then((response) => {
            //     console.log(JSON.stringify(response));
            // }).catch(function (err) {
            //     console.log(JSON.stringify(err));
            //     if (err.name === 'unauthorized' || err.name === 'forbidden') {
            //         // name or password incorrect
            //         commit("alertNotification", {
            //             "message": "Nombre o contra erroneos.<br>" + err,
            //             "duration": 4000
            //         })
            //     } else {
            //         // cosmic rays, a meteor, etc.
            //         commit("alertNotification", {
            //             "message": "Saber que p2.<br>" + err,
            //             "duration": 4000
            //         })
            //     }
            // });
        },
        editRegistro({
            state,
            commit,
            dispatch
        }) {
            if (state.usuario.password) {
                remoteUsuarios.changePassword(state.usuario.id.substring(17), state.usuario.password).then(res => {
                    console.log(JSON.stringify(res));
                    commit("clearData");
                    dispatch("getAll").then(() => commit("successNotification", {
                        "message": "Contraseña modificada con éxito",
                        "tittle": "EXITO",
                        "duration": 4000
                    }));
                }).catch((err) => {
                    console.log(JSON.stringify(err));
                    let mensajeError = "";
                    if (err.name === 'not_found') {
                        // typo, or you don't have the privileges to see this user
                        mensajeError = "Contraseña no valida o no tiene permisos de edición."
                    } else {
                        // some other error
                        mensajeError = JSON.stringify(err);
                    }
                    commit("alertNotification", {
                        "message": "Error al editar la contraseña<br>" + mensajeError,
                        "duration": 4000
                    });

                });
            } else {
                remoteUsuarios.changeUsername(state.usuario.id.substring(17), state.usuario.nombre).then(res => {
                    console.log(JSON.stringify(res));
                    commit("clearData");
                    dispatch("getAll").then(() => commit("successNotification", {
                        "message": "Nombre de usuario editado con éxito",
                        "tittle": "EXITO",
                        "duration": 4000
                    }));
                }).catch((err) => {
                    console.log(JSON.stringify(err));
                    let mensajeError = "";
                    if (err.name === 'not_found') {
                        // typo, or you don't have the privileges to see this user
                        mensajeError = "Nombre de usuario no valido o no tiene permisos de edición."
                    } else if (err.taken) {
                        // auth error, make sure that 'batman' isn't already in DB
                        mensajeError = "Asegurese que el usuario sea único."
                    } else {
                        // some other error
                        mensajeError = JSON.stringify(err);
                    }
                    commit("alertNotification", {
                        "message": "Error al editar el nombre de usuario<br>" + mensajeError,
                        "duration": 4000
                    });

                });
            }
        },
        removeRegistro({
            state,
            commit,
            dispatch
        }) {
            remoteUsuarios.deleteUser(state.usuario.id.substring(17)).then(res => {
                console.log(JSON.stringify(res));
                commit("clearData");
                dispatch("getAll").then(() => commit("successNotification", {
                    "message": "Nombre de usuario eliminado con éxito",
                    "tittle": "EXITO",
                    "duration": 4000
                }));
            }).catch((err) => {
                commit("alertNotification", {
                    "message": "Error al eliminar el usuario<br>" + JSON.stringify(err),
                    "duration": 4000
                });
            });
        },
        initDBUsuarios({
            dispatch
        }) {
            remotedb(this._vm.$url).then(() => {
                remoteUsuarios.info().then(() => {
                    dispatch("getAll");
                }).catch(err => {
                    if (err.status === 401) {
                        console.log("no autorizado");
                        router.push({
                            path: "/login"
                        }).catch(() => {});
                    }
                });
            }).catch(console.log);
            // state.localUsuarios = new state.PouchDB("usuarios");
            // // do one way, one-off sync from the server until completion
            // state.localUsuarios.replicate.from(remoteUsuarios).on('complete', () => {
            //     // console.log("Se terminó la replicación");
            //     dispatch("getAll");
            //     // then two-way, continuous, retriable sync
            //     state.localUsuarios.sync(remoteUsuarios, {
            //             live: true,
            //             retry: true
            //         }).on('change', function (change) {
            //             console.log("yo, something changed!", change);
            //             dispatch("getAll");
            //         }).on('paused', function (info) {
            //             console.log("replication was paused, usually because of a lost connection", info);
            //         }).on('active', function (info) {
            //             console.log("replication was resumed", info);
            //         }).on('denied', function (err) {
            //             console.log("a document failed to replicate (e.g. due to permissions)", err);
            //         })
            //         .on('complete', function (info) {
            //             console.log("Completado", info);
            //         }).on('error', function (err) {
            //             console.log("totally unhandled error (shouldn't happen)", err);
            //         });
            // }).on('error', console.log.bind(console));
        }
    }
}