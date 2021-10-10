<template>
  <div class="app-container" v-loading="loading">
   
    <div>
      <h2>PLAZOS</h2>
    </div>
    <div class="filter-wrap">
      <div class="filter-container">
        <!-- <el-input v-model="busqueda" placeholder="" style="width: 400px;" class="filter-item" >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <b @click="busqueda = ''" style="color:red;font-size: 22px;margin-left: 11px;cursor:pointer;">X</b>
       -->
        <el-button @click="plazosSelected = null; modalPlazo=true;" class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" >
         Agregar nuevo
        </el-button>
      </div>
    </div>

    <br><br><br><br>
    <el-table
      :data="listaTabla"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
     
      <el-table-column label="Semanas" width="110">
        <template slot-scope="scope" >
          {{ scope.row.semanas }}
        </template>
      </el-table-column>
      <el-table-column label="Tasa normal" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tasaNormal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tasa puntual" align="center">
        <template slot-scope="scope">
          {{ scope.row.tasaPuntual }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Acciones"
        width="180">
        <template slot-scope="scope">
          <el-button @click="handleEditar(scope.row)" size="small" plain>Editar</el-button>
          <el-button @click="handleEliminar(scope.row.id)" type="danger" plain size="small">Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <ModalPlazo v-if="modalPlazo" v-model="modalPlazo" :plazo="plazosSelected" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { limpiarTextoTrimp } from "@/constants/helpers";

import Pagination from '@/components/Pagination'
import ModalPlazo from './components/ModalPlazo'


export default {
  name: 'Plazos',
  components: { Pagination, ModalPlazo },
  data() {
    return {

      page: 1,
      currentPage: 1,
      perPage: 10,
      numberOfPages: 1,

      
      list: null,
      busqueda: '',
      loading: true,
      modalPlazo: false,
      plazosSelected: null
    }
  },
  async created() {
    if (!Object.keys(this.plazos).length) {
      await this.lista();
    }
    this.loading=false;
  },
  computed: {
    ...mapState({
      plazos: (state) => state.plazos.plazos,
    }),

    listaTabla() {
      let lista = [];
      const plazos = JSON.parse(JSON.stringify(this.plazos));
      
      if (!Object.keys(this.plazos).length) {
        return [];
      }
      this.loading=true;
      for (const i in plazos) {
        let item = plazos[i];
        //item.id = i;
       
        lista.push(item)
      }


      if(this.busqueda){
        const strBuscar = limpiarTextoTrimp(this.busqueda);
      
        lista= lista.filter(function (v) {
          return limpiarTextoTrimp(v.sku).includes(strBuscar) ||
          limpiarTextoTrimp(v.nombre).includes(strBuscar)
        });
      }

      const from = this.page * this.perPage - this.perPage;
      const to = this.page * this.perPage;
      this.numberOfPages = Math.ceil(lista.length / this.perPage);
      this.loading=false;
      return lista.slice(from, to);
    },
  },
  methods: {
    ...mapActions({
      lista: "plazos/lista",
      actualizar: "plazos/actualizar",
    }),
   
   async handleEliminar(id){
      const result = await this.$swal({
        title: "¿Eliminar este plazo?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        showCloseButton: true,
        showLoaderOnConfirm: false,
      });
      if(result.isConfirmed){
        this.loading = true;
        await this.actualizar({
          id: id,
          activo: false,
        });
        this.loading = false;
      }
   },

   handleEditar(datos){
     this.plazosSelected = datos;
     this.modalPlazo=true;
   }

  }
}
</script>
