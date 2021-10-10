<template>
    <div>
        <el-dialog :title="'Cotizar crédito de '+productoFrm.nombre" :visible.sync="selectVal" @close="selectVal=false" width="45%">
        
            <el-form v-loading="loading" :model="productoFrm">
                <el-form-item label="Plazo">
                    <el-select v-model="productoFrm.plazo" @change="changePlaza" placeholder="Selecciona una semana">
                        <el-option v-for="(plazo, index) in plazos" :key="index" :label="'Semana '+plazo.semanas" :value="index+1"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <div v-if="productoFrm.plazo">
                <span><b>Abono Normal: </b> {{ formatoMonto(abonoNormal.toFixed(2)) }}</span>
                <br><br><br>
                <span><b>Abono Puntual: </b> {{ formatoMonto(abonoPuntual.toFixed(2)) }} </span>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="selectVal = false">Cerrar</el-button>
            </span>

            
        </el-dialog>
    </div>
</template>
<script>
import $ from 'jquery';
import { mapActions, mapState } from "vuex";
import {formatoMonto} from '@/constants/helpers'

const formBaseProducto = {
    plazo: [],
}
export default {
    name: 'ModalProducto',
    props:{
        value: {},
        producto:{},
    },
    data() {
        return {
            loading: false,
            productoFrm: JSON.parse(JSON.stringify(formBaseProducto)) ,
            abonoNormal: 0,
            abonoPuntual: 0,
        }
    },
    async created() {
        if(this.producto){
            this.productoFrm = $.extend(true, JSON.parse(JSON.stringify(formBaseProducto)), this.producto);
        }
    },
    computed: {
        ...mapState({
            plazos: (state) => state.plazos.plazos,
        }),
        selectVal: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },

        esNuevo(){
            return !this.producto
        }

    },
    methods: {
        formatoMonto,
        async changePlaza(val){
            const plazo = this.plazos[val-1]
            console.log("🚀 ~ changePlaza ~ plazo", plazo)
            
            plazo.tasaNormal = parseFloat(plazo.tasaNormal);
            plazo.tasaPuntual = parseFloat(plazo.tasaPuntual);
            plazo.semanas = parseFloat(plazo.semanas);
            this.productoFrm.precio = parseFloat(this.productoFrm.precio );

            // ((Precio del producto * tasa normal) + Precio del producto) / plazo
            this.abonoNormal= ((this.productoFrm.precio * plazo.tasaNormal) + this.productoFrm.precio) / plazo.semanas

            // ((Precio del producto * tasa puntual) + Precio del producto) / plazo
            this.abonoPuntual = ((this.productoFrm.precio * plazo.tasaPuntual) + this.productoFrm.precio) / plazo.semanas

        },

      
    },
}
</script>
