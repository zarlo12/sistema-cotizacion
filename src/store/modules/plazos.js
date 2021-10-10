import firebase from '@/firebase'

const db = firebase.firestore()

const state = {
  plazos: [],
}

const mutations = {
  ASIGNA_PLAZOS(state, plazos) {
    state.plazos = plazos
  },
}

const actions = {

 
  // lista({commit}){
  //   return new Promise((resolve,reject) => {
  //     db.collection('Indices').doc('idxPlazos')
  //      .onSnapshot(function(doc) {
  //       if(doc.exists){
  //         commit('ASIGNA_PLAZOS', doc.data());
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
      db.collection('Plazos')
      .onSnapshot(function(querySnapshot) {
          var plazos = [];
          querySnapshot.forEach(function(doc) {
              let datos = doc.data();
              datos.id = doc.id;
              if(datos.activo){
                plazos.push(datos);
              }
          });
          
          commit('ASIGNA_PLAZOS', plazos);
          resolve()
      },function(error) {
        reject(error)
      });
    });
  },

  cargar({},id){
    return new Promise((resolve,reject) => {
        db.collection('Plazos').doc(id).get().then((doc) => {
            doc.exists ? resolve(doc.data()) : reject({error:"El datos no existe"})
        }).catch(error => {
            reject(error)
        })
    })
  },

  guardar({}, datos) {
    datos.fechaAlta = new Date();
    return new Promise((resolve, reject) => {
      db.collection('Plazos').add(datos).then((doc) => {
          resolve(doc.id)
        }).catch(error => {
          reject(error)
        })
    })
  },

  actualizar({}, datos) {
    if(datos.fechaAlta){ delete datos.fechaAlta }
    return new Promise((resolve,reject) => {
      db.collection('Plazos').doc(datos.id).set(datos, {merge:true}).then(() => {
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
