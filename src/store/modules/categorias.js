export default {
    namespaced: true,
    state: {
        "categorias": [{
                "idCategoria": "0",
                "nombreCategoria": "Llantas",
                "activoCat": true,
                "descripcion": "Aqui estan todas las llantas",
            },
            {
                "idCategoria": "1",
                "nombreCategoria": "Cascos",
                "activoCat": true,
                "descripcion": "Se listan todos los cascos",
            },
            {
                "idCategoria": "2",
                "nombreCategoria": "Luces Led",
                "activoCat": true,
                "descripcion": "Todas las luces led",
            },
            {
                "idCategoria": "3",
                "nombreCategoria": "Lubricantes",
                "activoCat": true,
                "descripcion": "Para todo tipos de motor",
            },
        ],
        "categoria": {
            "idCategoria": "0",
            "nombreCategoria": "",
            "activoCat": true,
            "descripcion": "",
        },
        "catSelected": {}
    },
    mutations: {
        /**
         * limpiando valores de la categoria previamente seleccionada
         * @param {*} state 
         */
         clearDataCat(state) {
            state.categoria = {
                idCategoria: null,
                nombreCategoria: "",
                activoCat: true,
                descripcion: "",
            };
        },
        /**
         * Crea registro con categoria
         * El nombre no tiene que ir vacío
         * @param {*} state 
         */
        createRegistro: function (state) {
            if (state.categoria.nombreCategoria.trim() !== "") {
                console.log(state.categoria);
                state.categorias.push(state.categoria)
            }
            if (state.categoria.nombreCategoria.trim() === "cambiar por if de arriba") {
                // 
                //     .post(urlApi, JSON.stringify(state.categoria), {
                //         headers: {
                //             "content-type": "application/json",
                //         },
                //     })
                //     .then((response) => {
                //         console.log(response.status);
                //         this.getAll();
                //     })
                //     .catch((ex) => {
                //         console.log(ex);
                //     });
                return;
            }
        },
        /**
         * 
         * @param {*} cat 
         */
        getCategoriaSelected(state, cat) {
            state.categoria = cat;
            state.catSelected = JSON.parse(JSON.stringify(cat));
        },
        /**
         * Elimina un registro
         * @returns nada we :v,¿esperabas algo?
         */
        removeRegistro: function (state) {
            state.categoria.activoCat = false;
        },
        edithRegistro(state, catSelected) {
            var index = state.categorias.findIndex(element => element.idCategoria === catSelected.idCategoria);
            state.categorias.splice(index, 1, catSelected);            
        },
    }
}