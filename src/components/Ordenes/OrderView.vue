<template>
    <div class="order">
        <div class="orderName" v-if="orden && orden.nombreCliente">
            {{ orden.nombreCliente}}
        </div>
        <div v-if="orden && orden.fechaOrd">
            {{ orden.fechaOrd}}
        </div>
        <div v-if="orden && orden.telefono">
            {{ orden.telefono}}
        </div>
        <div v-if="orden && typeof orden.totalOrden === 'number'">
            {{ orden.totalOrden}}
        </div>
        <a href="#" @click="showModalViewDetails = true">
            Ver detalles
        </a>
    </div>
</template>
<script>
export default {
    props: ['orden'],
    data() {
        return {
           showModalViewDetails: false
        };
    },
}
</script>
<style scoped>
.order {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid #919ca6;
    border-bottom: 1px solid #919ca6;
}
.orderName {
    font-size: 1rem;
    font-weight: bold;
}
</style>
