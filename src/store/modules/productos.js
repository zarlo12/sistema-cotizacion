import firebase from '@/firebase'
const db = firebase.firestore()

const state = {
  productos: [],
}

const mutations = {
  ASIGNA_PRODUCTOS(state, productos) {
    state.productos = productos
  },
}

const actions = {

 
  // lista({commit}){
  //   return new Promise((resolve,reject) => {
  //     db.collection('Indices').doc('idxProductos')
  //      .onSnapshot(function(doc) {
  //       if(doc.exists){
  //         commit('ASIGNA_PRODUCTOS', doc.data());
  //         resolve()
  //       }
  //       reject({error:"El datos no existe"})
  //     }, function(error) {
  //       reject(error)
  //     });
  //   })
  // },

  lista({commit}){
    return new Promise((resolve,reject) => {
      db.collection('Productos')
      .onSnapshot(function(querySnapshot) {
          var productos = [];
          querySnapshot.forEach(function(doc) {
              let datos = doc.data();
              datos.id = doc.id;
              productos.push(datos);
          });
          
          commit('ASIGNA_PRODUCTOS', productos);
          resolve()
      },function(error) {
        reject(error)
      });
    });
  },

  cargar({},id){
    return new Promise((resolve,reject) => {
        db.collection('Productos').doc(id).get().then((doc) => {
            doc.exists ? resolve(doc.data()) : reject({error:"El datos no existe"})
        }).catch(error => {
            reject(error)
        })
    })
  },

  guardar({}, datos) {
    datos.fechaAlta = new Date();
    return new Promise((resolve, reject) => {
      db.collection('Productos').add(datos).then((doc) => {
          resolve(doc.id)
        }).catch(error => {
          reject(error)
        })
    })
  },

  actualizar({}, datos) {
    if(datos.fechaAlta){ delete datos.fechaAlta }
    return new Promise((resolve,reject) => {
      db.collection('Productos').doc(datos.id).set(datos, {merge:true}).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    })

  },



  
 

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
