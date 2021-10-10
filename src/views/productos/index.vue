<template>
  <div class="app-container" v-loading="loading">
   
    <div>
      <h2>PRODUCTOS</h2>
    </div>
    <div class="filter-wrap">
      <div class="filter-container">
        <el-input v-model="busqueda" placeholder="Buscar por SKU o nombre" style="width: 400px;" class="filter-item" >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <b @click="busqueda = ''" style="color:red;font-size: 22px;margin-left: 11px;cursor:pointer;">X</b>
      
        <el-button @click="productoSelected = null; modalProducto=true;" class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" >
         Agregar nuevo
        </el-button>
      </div>
    </div>

    <br><br>
    <el-table
      :data="listaProductos"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
     
      <el-table-column label="SKU" width="110">
        <template slot-scope="scope" >
          {{ scope.row.sku }}
        </template>
      </el-table-column>
      <el-table-column label="Nombre" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nombre }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Precio" align="center">
        <template slot-scope="scope">
          {{ formatoMonto(scope.row.precio) }}
        </template>
      </el-table-column>
      <el-table-column label="Cotización de crédito" align="center">
        <template slot-scope="scope">
          <el-button @click="handleCotizacion(scope.row)" type="success" plain size="small">Cotizar</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Acciones"
        width="180" >
        <template slot-scope="scope">
          <el-button @click="handleEditar(scope.row)" size="small" plain>Editar</el-button>
          <el-button @click="handleEliminar(scope.row.id)" size="small" type="danger" plain>Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <ModalProducto v-if="modalProducto" v-model="modalProducto" :producto="productoSelected" />

    <ModalCotizar v-if="modalCotizar" v-model="modalCotizar" :producto="productoSelected" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { limpiarTextoTrimp, formatoMonto } from "@/constants/helpers";

import Pagination from '@/components/Pagination'
import ModalProducto from './components/ModalProducto'
import ModalCotizar from './components/ModalCotizar'


export default {
  name: 'Productos',
  components: { Pagination, ModalProducto, ModalCotizar },
  data() {
    return {

      page: 1,
      currentPage: 1,
      perPage: 10,
      numberOfPages: 1,

      
      list: null,
      busqueda: '',
      loading: true,
      modalProducto: false,
      productoSelected: null,
      modalCotizar: false,
    }
  },
  async created() {
    if (!Object.keys(this.productos).length) {
      await this.lista();
    }
    if (!Object.keys(this.plazos).length) {
      await this.listaPlazos();
    }
    this.loading=false;
  },
  computed: {
    ...mapState({
      productos: (state) => state.productos.productos,
      plazos: (state) => state.plazos.plazos,
    }),

    listaProductos() {
      let lista = [];
      const productos = JSON.parse(JSON.stringify(this.productos));
      
      if (!Object.keys(this.productos).length) {
        return [];
      }
      this.loading=true;
      for (const i in productos) {
        let item = productos[i];
        //item.id = i;
        if(item.activo){
          lista.push(item)
        }
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
      listaPlazos: "plazos/lista",
      lista: "productos/lista",
      actualizar: "productos/actualizar",
    }),
   formatoMonto,
   async handleEliminar(id){
      const result = await this.$swal({
        title: "¿Eliminar este producto?",
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
     this.productoSelected = datos;
     this.modalProducto=true;
   },

   handleCotizacion(datos){
     this.productoSelected = datos;
     this.modalCotizar=true;
   }

  }
}
</script>
