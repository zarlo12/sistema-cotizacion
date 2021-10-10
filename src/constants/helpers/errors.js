const map = new Map()
map.set('auth/invalid-email', 'Ingresa un email valido')
map.set('auth/user-not-found', 'El usuario no se encuentra registrado')
map.set('auth/wrong-password', 'Contraseña incorrecta')
map.set(
  'auth/account-exists-with-different-credential',
  'La cuenta ya estaba registrada usando un método de ingreso distinto.'
)
map.set('auth/email-already-in-use', 'El correo electrónico ya está registrado')
map.set(
  'auth/network-request-failed',
  'Verifica que tengas conexión a internet'
)
map.set(
  'auth/weak-password',
  'La contraseña es muy corta, intenta una más larga.'
)
map.set(
  'auth/too-many-requests',
  'Ha intentado demasiadas veces, espere 3 min.'
)
map.set(
  'auth/email-already-in-use',
  'La dirección de correo electrónico ya está en uso por otra cuenta'
)
map.set(
  'auth/provider-already-linked',
  'El número de telefono proporcionado ya existe, intenta con otro'
)
map.set(
  'auth/invalid-phone-number',
  'El número de teléfono tiene un formato no válido.'
)
map.set('auth/captcha-check-failed', 'reCAPTCHA no válido, intenta de nuevo')
map.set(
  'auth/user-disabled',
  'La cuenta ha sido deshabilitada por el administrador'
)
map.set(
  'auth/invalid-verification-code',
  'El código es incorrecto.'
)
map.set(
  'auth/tipo-propietario',
  'Los propietarios no tienen acceso.'
)
map.set(
  'auth/tipo-responsable',
  'Los responsables no tienen acceso.'
)
// The user account has been disabled by an administrator.
export default function(errorCode) {
  console.log(errorCode)
  var mensaje = map.get(errorCode)
  if (!mensaje) {
    return 'Ha ocurrido un error mientras se realizaba esta acción. Por favor, comuníquese con soporte técnico'
  } else {
    return mensaje
  }
}
