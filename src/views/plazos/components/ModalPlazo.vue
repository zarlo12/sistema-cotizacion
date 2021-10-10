<template>
    <div>
        <el-dialog :title="esNuevo ? 'Nuevo plazo' : 'Editar plazo'" :visible.sync="selectVal" @close="selectVal=false" width="45%">
        
            <el-form v-loading="loading" :model="plazoForm">
                <el-form-item label="Semanas" :label-width="formLabelWidth">
                    <el-input type="number" v-model.number="plazoForm.semanas" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Tasa normal" :label-width="formLabelWidth">
                    <el-input type="number" v-model.number="plazoForm.tasaNormal" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Tasa puntual" :label-width="formLabelWidth">
                    <el-input type="number" v-model.number="plazoForm.tasaPuntual" autocomplete="off"></el-input>
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

const formBasePlazo = {
    semanas: '',
    tasaNormal: '',
    tasaPuntual: '',
    activo: true,
    fechaAlta: ''
}
export default {
    name: 'ModalPlazo',
    props:{
        value: {},
        plazo:{},
    },
    data() {
        return {
            loading: false,
            plazoForm: JSON.parse(JSON.stringify(formBasePlazo)) ,
            formLabelWidth: '120px'
        }
    },
    async created() {
        if(this.plazo){
            this.plazoForm = $.extend(true, JSON.parse(JSON.stringify(formBasePlazo)), this.plazo);
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
            return !this.plazo
        }

    },
    methods: {
        ...mapActions({
            guardar: "plazos/guardar",
            actualizar: "plazos/actualizar",
        }),
     
        async guardarForm(){
            this.loading = true;
            try {
                if(this.plazoForm.id){
                    await this.actualizar(this.plazoForm);
                }else{
                    await this.guardar(this.plazoForm);
                }
                this.$swal.fire(
                    "Bien hecho",
                    "El plazo ha sido guardado corectamente",
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
