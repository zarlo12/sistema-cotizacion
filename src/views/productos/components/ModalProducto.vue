<template>
    <div>
        <el-dialog :title="esNuevo ? 'Nuevo producto' : 'Editar producto'" :visible.sync="selectVal" @close="selectVal=false" width="45%">
        
            <el-form v-loading="loading" :model="productoFrm">
                <el-form-item label="SKU" :label-width="formLabelWidth">
                    <el-input v-model="productoFrm.sku" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Nombre" :label-width="formLabelWidth">
                    <el-input v-model="productoFrm.nombre" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Precio" :label-width="formLabelWidth">
                    <el-input type="number" v-model="productoFrm.precio" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectVal = false">Cancelar</el-button>
                <el-button type="primary" @click="guardarForm()">Guardar</el-button>
            </span>

            
        </el-dialog>
    </div>
</template>
<script>
import $ from 'jquery';
import { mapActions } from "vuex";

const formBaseProducto = {
    sku: '',
    nombre: '',
    precio: '',
    activo: true,
    fechaAlta: ''
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
            formLabelWidth: '120px'
        }
    },
    async created() {
        if(this.producto){
            this.productoFrm = $.extend(true, JSON.parse(JSON.stringify(formBaseProducto)), this.producto);
        }
    },
    computed: {
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
        ...mapActions({
            guardar: "productos/guardar",
            actualizar: "productos/actualizar",
        }),
     
        async guardarForm(){
            this.loading = true;
            try {
                if(this.productoFrm.id){
                    await this.actualizar(this.productoFrm);
                }else{
                    await this.guardar(this.productoFrm);
                }
                this.$swal.fire(
                    "Bien hecho",
                    "El producto ha sido guardado corectamente",
                    "success"
                )
                .then(() => {
                   this.selectVal = false
                });
            } catch (error) {
                console.log(error);
                this.$swal.fire("Upps!", "Ocurrió un error inesperado", "error");
            }
            this.loading = false;
        },

      
    },
}
</script>
