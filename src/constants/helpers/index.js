import $ from 'jquery';
import moment from 'moment'

const UUID = () => {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const obtenerFecha = (fecha) => {
  
  if(fecha===null || fecha===undefined || fecha.seconds===undefined ) {
    return fecha;
  }

  return new Date(fecha.seconds * 1000)

}

const obtenerFechaConvertida = (fecha) => {

  if(fecha===null){
    return fecha;
  }

  if(typeof fecha==='string') {
    return moment(fecha).toDate()
  }

  if(typeof fecha==='object'){
    if(fecha.seconds!==undefined){
      return moment(fecha.seconds*1000).toDate()
    }
  }

  return fecha;

}

const obtenerLongitudObjeto = (objeto) => {
  let longitud = Number(Object.keys(objeto).length) + 1;
  if (longitud !== 1) {
    const keys = Object.keys(objeto);
    longitud = Number(keys[keys.length - 1]) + 1;
  }
  
  return longitud;

}

const DIAS_SEMANA = [
  {
    id:'lunes_viernes',
    nombre:'De lunes a viernes'
  },
  {
    id:'sabado_domingo',
    nombre:'De sábado a domingo'
  },
  {
    id:"lunes",
    nombre:"Lunes",
  },
  {
    id:"martes",
    nombre:"Martes",
  },
  {
    id:"miercoles",
    nombre:"Miercoles",
  },
  {
    id:"jueves",
    nombre:"Jueves",
  },
  {
    id:"viernes",
    nombre:"Viernes",
  },
  {
    id:"sabado",
    nombre:"Sábado",
  },
  {
    id:"domingo",
    nombre:"Domingo",
  },
]

const ajustaPropiedadesIndefinidas = (objetoBase, objetoNuevo) => $.extend(true, objetoBase, objetoNuevo);

const obtenerEdad = (edad) => {

  if (edad === null) {
    return "";
  }

  if(edad.seconds!==undefined){
    return (moment().diff(moment(edad.seconds * 1000),"years") + " años");
  }

  return (moment().diff(moment(edad),"years") + " años");

}



const formatoFecha = (fecha, tipo ="normal") => {

  if (fecha === null || fecha===undefined) return "";

  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul",
  "Ago","Sep","Oct","Nov","Dic"];

  const mesesFull = ["enero","febrero","marzo","abril","mayo","junio","julio",
  "agosto","septiembre","octubre","noviembre","diciembre"]

  let seconds 

  if(typeof fecha !=="string"){
    seconds = fecha.seconds 
  } else {
    const date = new Date(fecha)
    seconds = date.getUTCSeconds()
  }
  const f = moment(seconds*1000)

  const slice = (n) => String("0"+n).slice(-2) 

  //2020-09-17T22:00:00Z

  switch(tipo){
    case "normal":
      return `${f.date()} ${meses[f.month()]} ${f.year()}`
    case "mes":
      return `${mesesFull[f.month()]}`
    case "sin_dia":
      return `${meses[f.month()]} ${f.year()}`
    case "con_hora":
      return `${slice(f.date())} ${meses[f.month()]} ${f.year()} ${slice(f.hour())}:${slice(f.minutes())}`;
    case "con_guion":
      return `${slice(f.date())}/${slice(f.month()+1)}/${f.year()} ${slice(f.hour())}:${slice(f.minutes())} hrs`;
    case "calendario_inicio":
      return `${f.date()} de ${mesesFull[f.month()]} ${f.year()} de ${slice(f.hour())}:${slice(f.minutes())} hrs`;
    case "calendario_fin":
        return `${slice(f.hour())}:${slice(f.minutes())} hrs`;
    case "formateada":
      return f.format()
  }

}

const formatoHora = (datos) => {

  const {fecha, minutos = 0, tipo = "unico"} = datos;

  const fecha_inicio = moment(fecha.seconds*1000)

  switch(tipo){

    case "unico":
      return `${fecha_inicio.hours()}:${fecha_inicio.minutes()}`
    case "doble": {

      const slice = (n) => String("0"+n).slice(-2) 

      const fecha_hasta = moment(fecha.seconds*1000)
      fecha_hasta.add(minutos,'minutes')

      const turno_inicio = fecha_inicio.hours()<=11 ? "AM" : "PM"
      const turno_hasta = fecha_hasta.hours()<=11 ? "AM" : "PM"

      return `${slice(fecha_inicio.hours())}:${slice(fecha_inicio.minutes())} ${turno_inicio} a ${slice(fecha_hasta.hours())}:${slice(fecha_hasta.minutes())} ${turno_hasta} `

    }
    case "am": {

      return `${fecha_inicio.hours()} ${fecha_inicio.hours()<=11?'AM':'PM'}`

    }

  }

}


const obtenerEspecialidad = (subEspecialidades) => {
  if (subEspecialidades[0]) {
    return subEspecialidades[0].especialidad;
  }
  return "";
}

const obtenerDiasDiferenciaBolsaTrabajo = (fecha_alta,tipo_anuncio) => {

  fecha_alta = moment(fecha_alta.seconds * 1000)
  const hoy = moment(new Date())
  const dias = tipo_anuncio==='standard' ? 30 : 60;

  const diferencia = moment.duration(hoy.diff(fecha_alta));

  return dias - +diferencia.asDays().toFixed(0)

}

const obtenerIdsMultiselect = (objeto) => {
  

  let ids = {}

  if(objeto.id){
    ids[objeto.id] = true;
    return ids;
  }
  
  // for(var i in objeto){
  //   ids[objeto[i].id] = true;
  // }

  for(var i in objeto){
    if(objeto[i].manual){ //significa que es docente manual
      ids[objeto[i].id] = objeto[i];
    }else{//es automatico
      ids[objeto[i].id] = true;
    }
  }


  return ids;

}

const llenarMultiselectConIds = (objeto, ids) => {
  console.log("Llenar multiselect ", objeto, ids)
  let items = [];
  for(const id in ids){
    const encontrado = objeto.find((item) => item.id==id)
    if(encontrado){
      items.push(encontrado);
    }else{
      console.log("llenarMultiselectConIds -> id", id)
      if(ids[id].nombre){ //en dado caso si se agrega manual el docente
        items.push(ids[id]);
      }
    }
  }
  return items;
}



const buscarObjeto = (datos) => {

  const {array,id,campo="nombre", id_campo="id"} = datos

  const data = array.find(item => item[id_campo]===id)

  if(data){
    return data[campo];
  }

  return ''

}

const formatoMonto = (input) => {
  input+='';
  let prueba = input.split('.');
  prueba[0] = prueba[0].split('-');
  let num = (prueba[0].length==1) ? prueba[0][0].replace(/\./g,'') : prueba[0][1].replace(/\./g,'')
  let resultado = '';
  if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
      num = num.split('').reverse().join('').replace(/^[\,]/,'');
      resultado = num;
      (prueba.length==2) && (resultado+="."+prueba[1]);
      (prueba[0].length==2) && (resultado = '-'+resultado);
  } else {
      resultado = input.replace(/[^\d\.]*/g,'');
  }
  return `$${resultado}`;
}

const accent_map = {'á':'a', 'é':'e', 'è':'e', 'í':'i','ó':'o','ú':'u','Á':'a', 'É':'e', 'è':'e', 'Í':'i','Ó':'o','Ú':'u'}

const limpiarTextoTrimp = (palabra) => {

  let ret = '';
  for (var i = 0; i < palabra.length; i++) {
    ret += accent_map[palabra.charAt(i)] || palabra.charAt(i);
  }
  let str = ret.toLowerCase();
  return str.replace(/ /g,'')

}

const getNombreCompleto = (usuario) => {
  //return `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno} `;
  usuario.nombre = usuario.nombre ? usuario.nombre : '';
  usuario.apellidoPaterno = usuario.apellidoPaterno ? usuario.apellidoPaterno : '';
  usuario.apellidoMaterno = usuario.apellidoMaterno ? usuario.apellidoMaterno : '';
  return `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno} `;
}

const filtroUbicacion = (ubicacion, ubicacion_item) => {
  
  if(ubicacion.id_ciudad===0 && ubicacion.id_estado===0){
    return ubicacion_item.id_pais===ubicacion.id_pais
  }

  if(ubicacion.id_estado!==0 && ubicacion.id_ciudad===0){
    return ubicacion_item.id_pais===ubicacion.id_pais &&
    ubicacion_item.id_estado===ubicacion.id_estado
  }

  if(ubicacion.id_estado!==0 && ubicacion.id_ciudad!==0){
    return ubicacion_item.id_pais===ubicacion.id_pais &&
    ubicacion_item.id_estado===ubicacion.id_estado &&
    ubicacion_item.id_ciudad===ubicacion.id_ciudad
  }

  return false;
}

const obtenerTiempoTranscurrido = (fecha_alta) => {
  if(fecha_alta===null){
    return ''
  }

  const fechaAlta = moment(fecha_alta.seconds * 1000)
  const hoy = moment()

  let transcurrido = hoy.diff(fechaAlta,'day')

  if(transcurrido===0){
    return 'Hoy'
  }

  if(transcurrido<=7){
    return `hace ${transcurrido} día(s)`
  }

  transcurrido = hoy.diff(fechaAlta,'week')

  if(transcurrido<=4){
    return `hace ${transcurrido} semana(s)`
  }

  transcurrido = hoy.diff(fechaAlta,'month')

  if(transcurrido<=12){
    return `hace ${transcurrido} mes(es)`
  }

  transcurrido = hoy.diff(fechaAlta,'year')

  return `hace ${transcurrido} año(s)`
}



export {
    UUID,
    ajustaPropiedadesIndefinidas,
    obtenerFecha,
    obtenerFechaConvertida,
    DIAS_SEMANA,
    obtenerLongitudObjeto,
    obtenerEdad,
    formatoFecha,
    obtenerDiasDiferenciaBolsaTrabajo,
    obtenerIdsMultiselect,
    llenarMultiselectConIds,
    formatoHora,
    buscarObjeto,
    formatoMonto,
    limpiarTextoTrimp,
    getNombreCompleto,
    obtenerEspecialidad,
    filtroUbicacion,
    obtenerTiempoTranscurrido,
}
