const ApiRestUrl = "url/productos/"

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
            "idMetodoPago": 0,
            "nombreCliente": "",
            "observacionesOrden": "",
            "totalOrden": 0
        },
        searchDisplay: "",
        urlApi: `${ApiRestUrl}orden`,
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
        metPago: [{"name":"Tarjeta de Crédito"}, {"name":"Tarjeta de Débito"}, {"name":"Efectivo"}, {"name":"Credito Fiscal"},{"name":"Criptomoneda"}],
        metPagoSelected: "",
        detalleOrden: [],
        activaOrd: [],
        prodSearch: "",
        // Esto va a servir para construir objetos ordenes
        productosObject: [],
        i: 0,
        j: 0,
        showDetOrd: false,
        delay: 700,
        clicks: 0,
        timer: null,
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
            //Creando objeto para orden
            this.orden.idMetodoPago = this.metPago.filter(metPag => metPag.nombrePago === this.metPagoSelected)[0].idMetodoPago;                

        },
    restartObject: function () {
            console.log("Me llamaron?")
            this.i++;
            this.j = 0;
            this.productosObject = [];
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
            this.i = 0;
            this.j = 0;
            this.metPagoSelected = "";
            this.ordSelected = {};
            this.productosObject = [];
            this.orden = {
                "idMetodoPago": 0,
                "nombreCliente": "",
                "observacionesOrden": "",
                "totalOrden": 0
            }
        },
        getProductoSelected(prod) {
            this.producto = prod;
        },
        filtro(valor) {
            if (this.searchDisplay === "") return true;
            let array = (this.ordenes[valor].idOrden + this.ordenes[valor].observacionesOrden + this.ordenes[valor].totalOrden + this.ordenes[valor].nombreCliente).toUpperCase();
            return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
        },
        filtroProd(state,valor) {
            let x=0;
            if (x == 0) return true;
            if (state.prodSearch === "") return true;
            let array = (this.marcas.filter(mar => mar.idMarca === this.productos[valor].idMarca)[0].nombreMarca + this.categorias.filter(cat => cat.idCategoria === this.productos[valor].idCategoria)[0].nombreCat + this.productos[valor].nombreProd + this.productos[valor].descripcion + this.productos[valor].precioUnit + this.productos[valor].stockProd + this.productos[valor].upc).toUpperCase();
            return array.indexOf(this.prodSearch.toUpperCase()) >= 0;
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
        converterIdMetPago2MetName: function (idMetodoPago) {
            return this.metPago.filter(met => met.idMetodoPago === idMetodoPago)[0].nombrePago;
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
    },
}