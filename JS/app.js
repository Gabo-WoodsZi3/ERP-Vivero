// 1. Referencias compartidas entre las páginas del ERP
const barraLateral = document.querySelector('#sidebar');
const botonMenu = document.querySelector('#mobile-menu');
const campoBusqueda = document.querySelector('#global-search');
const avisoEmergente = document.querySelector('#toast');
const raizDocumento = document.documentElement;
const barraAcciones = document.querySelector('.topbar-actions');
let temporizadorAviso;

// 2. Menú único para conservar los mismos módulos e iconos en cada página
const rutasOperacion = [
  ['Inicio', 'index.html', '<rect x="3" y="3" width="5.5" height="5.5" rx="1.2"/><rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2"/><rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2"/><rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2"/>'],
  ['Inventario', 'inventario.html', '<path d="m10 2.8 7 3.6v7.2l-7 3.6-7-3.6V6.4l7-3.6Z"/><path d="m3.3 6.6 6.7 3.5 6.7-3.5M10 10.2v7"/>'],
  ['Producción', 'produccion.html', '<path d="M10 17.5V9m0 4c-4.1 0-6.2-2.3-6.2-6.2C7.6 6.8 10 8.8 10 13Zm0-2c0-3.7 2.2-5.8 6.2-5.8 0 3.7-2.2 5.8-6.2 5.8Z"/>'],
  ['Riego', 'riego.html', '<path d="M10 2.5s5 5.4 5 9a5 5 0 0 1-10 0c0-3.6 5-9 5-9Z"/><path d="M7.5 12.5a2.5 2.5 0 0 0 2.5 2.5"/>'],
  ['Ventas', 'ventas.html', '<path d="M3 4h2l1.7 8.1a1.5 1.5 0 0 0 1.5 1.2h6.2a1.5 1.5 0 0 0 1.5-1.2L17 7H6"/><circle cx="8.5" cy="16.5" r=".9"/><circle cx="14.5" cy="16.5" r=".9"/>'],
  ['Punto de venta', 'punto-venta.html', '<rect x="2.5" y="4" width="15" height="12" rx="2"/><path d="M2.5 8h15m-11 4h3"/>'],
  ['Facturación electrónica', 'facturacion.html', '<path d="M4 2.8h8l4 4V17H4V2.8Z"/><path d="M12 2.8v4h4M7 11h6m-6 3h6"/>'],
  ['Compras', 'compras.html', '<path d="M3.5 5.5h13v11h-13zM7 5.5V4a3 3 0 0 1 6 0v1.5M7 9v1m6-1v1"/>'],
  ['Proveedores', 'proveedores.html', '<path d="M2.5 5h9v9h-9zM11.5 8h3l3 3v3h-6"/><circle cx="6" cy="16" r="1.5"/><circle cx="15" cy="16" r="1.5"/>'],
  ['Finanzas', 'finanzas.html', '<path d="M3 16.5V10m4.7 6.5V4m4.6 12.5V7m4.7 9.5V2.5"/>'],
  ['Clientes', 'clientes.html', '<circle cx="7.3" cy="6.5" r="3"/><path d="M2.5 17v-1.6a4.8 4.8 0 0 1 9.6 0V17h-9.6Zm11-7.2a3 3 0 1 0-1.1-5.8m2.1 7.2a4.8 4.8 0 0 1 3 4.5V17h-2.1"/>'],
  ['Personal y tareas', 'personal.html', '<circle cx="7.3" cy="6.5" r="3"/><path d="M2.5 17v-1.6a4.8 4.8 0 0 1 9.6 0V17h-9.6Zm11-7.2a3 3 0 1 0-1.1-5.8m2.1 7.2a4.8 4.8 0 0 1 3 4.5V17h-2.1"/>'],
];
const rutasGestion = [
  ['Reportes', 'reportes.html', '<path d="M4 2.8h8l4 4V17H4V2.8Z"/><path d="M12 2.8v4h4M7 11h6m-6 3h6"/>'],
  ['Configuración', 'configuracion.html', '<circle cx="10" cy="10" r="3"/><path d="m16.3 11.7 1.1.9-1.5 2.6-1.4-.5a7 7 0 0 1-1.5.9l-.3 1.5h-3l-.3-1.5a7 7 0 0 1-1.5-.9l-1.4.5L5 12.6l1.1-.9a6.6 6.6 0 0 1 0-1.8L5 9l1.5-2.6 1.4.5a7 7 0 0 1 1.5-.9l.3-1.5h3l.3 1.5a7 7 0 0 1 1.5.9l1.4-.5L17.4 9l-1.1.9a6.6 6.6 0 0 1 0 1.8Z"/>'],
];

function renderizarEnlacesMenu(enlaces, paginaActual) {
  return enlaces.map(([nombre, ruta, dibujo]) => {
    const activa = ruta === paginaActual || (paginaActual === 'ficha-lote.html' && ruta === 'produccion.html');
    return `<a class="nav-link${activa ? ' is-active' : ''}" href="${ruta}"${activa ? ' aria-current="page"' : ''}><svg viewBox="0 0 20 20" aria-hidden="true">${dibujo}</svg><span>${nombre}</span></a>`;
  }).join('');
}

const menusLaterales = document.querySelectorAll('.primary-nav');
const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
if (menusLaterales[0]) menusLaterales[0].innerHTML = renderizarEnlacesMenu(rutasOperacion, paginaActual);
if (menusLaterales[1]) menusLaterales[1].innerHTML = renderizarEnlacesMenu(rutasGestion, paginaActual);
const etiquetaOperacion = document.querySelector('.nav-label');
if (etiquetaOperacion) etiquetaOperacion.textContent = 'OPERACIÓN';

// 3. Marca, campana y tarjeta de perfil iguales en todas las páginas
const logoComun = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 26V13m0 6c-6 0-9-3.5-9-9 5.5 0 9 3 9 9Zm0-4c0-5.4 3.2-8.4 9-8.4 0 5.3-3.2 8.4-9 8.4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 26h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const campanaComun = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 7.8a5.5 5.5 0 0 0-11 0c0 6-2 6-2 7.5h15c0-1.5-2-1.5-2-7.5ZM8 17.5h4"/></svg><span></span>';
const perfilComun = '<span class="profile-avatar">AD</span><span class="profile-copy"><strong>Perfil Admin</strong><small>Administración</small></span><svg class="chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';

document.querySelectorAll('.brand-mark').forEach((marca) => { marca.innerHTML = logoComun; });
document.querySelectorAll('.notification-button').forEach((campana) => { campana.innerHTML = campanaComun; });
document.querySelectorAll('.profile-button').forEach((perfil) => {
  perfil.setAttribute('aria-label', 'Perfil de administración');
  perfil.innerHTML = perfilComun;
});

// 4. Avisos breves para las acciones de muestra
function mostrarAviso(mensaje) {
  if (!avisoEmergente) return;
  avisoEmergente.textContent = mensaje;
  avisoEmergente.classList.add('is-visible');
  window.clearTimeout(temporizadorAviso);
  temporizadorAviso = window.setTimeout(() => avisoEmergente.classList.remove('is-visible'), 2600);
}

// 5. Selector claro/oscuro compartido por todas las páginas
const botonTema = document.createElement('button');
botonTema.className = 'boton-tema';
botonTema.type = 'button';
botonTema.innerHTML = '<svg class="icono-sol" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.2"></circle><path d="M10 1.8v2m0 12.4v2M1.8 10h2m12.4 0h2M4.2 4.2l1.4 1.4m8.8 8.8 1.4 1.4m0-11.6-1.4 1.4m-8.8 8.8-1.4 1.4"></path></svg><svg class="icono-luna" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.7 12.2A7.2 7.2 0 0 1 7.8 3.3a7.2 7.2 0 1 0 8.9 8.9Z"></path></svg>';

if (barraAcciones) {
  barraAcciones.insertBefore(botonTema, barraAcciones.querySelector('.notification-button'));
}

function aplicarTema(temaOscuro, guardarPreferencia = true) {
  raizDocumento.dataset.tema = temaOscuro ? 'oscuro' : 'claro';
  botonTema.setAttribute('aria-pressed', String(temaOscuro));
  botonTema.setAttribute('aria-label', temaOscuro ? 'Activar tema claro' : 'Activar tema oscuro');
  botonTema.title = temaOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  document.querySelectorAll('a[href$=".html"], a[href*=".html?"]').forEach((enlace) => {
    const destino = new URL(enlace.href);
    destino.searchParams.delete('tema');
    if (temaOscuro) destino.searchParams.set('tema', 'oscuro');
    enlace.setAttribute('href', `${destino.pathname.split('/').pop()}${destino.search}`);
  });

  const colorNavegador = document.querySelector('meta[name="theme-color"]');
  if (colorNavegador) colorNavegador.content = temaOscuro ? '#151b17' : '#f5f6f1';

  if (guardarPreferencia) {
    try {
      localStorage.setItem('tema-vivero', temaOscuro ? 'oscuro' : 'claro');
    } catch {
      mostrarAviso('El tema cambiará en esta página, pero el navegador no permite guardar la preferencia.');
    }
  }
}

const temaEnlace = new URLSearchParams(window.location.search).get('tema');
let temaInicial = raizDocumento.dataset.tema === 'oscuro';
if (temaEnlace === 'oscuro') temaInicial = true;
else if (temaEnlace === 'claro') temaInicial = false;
else {
  try {
    const temaGuardado = localStorage.getItem('tema-vivero');
    if (temaGuardado === 'oscuro') temaInicial = true;
    if (temaGuardado === 'claro') temaInicial = false;
  } catch {
    temaInicial = raizDocumento.dataset.tema === 'oscuro';
  }
}
aplicarTema(temaInicial, false);
botonTema.addEventListener('click', () => {
  aplicarTema(raizDocumento.dataset.tema !== 'oscuro');
});

// 6. Menú móvil compartido por Inicio y los módulos
if (barraLateral && botonMenu) {
  botonMenu.addEventListener('click', () => {
    const menuAbierto = barraLateral.classList.toggle('is-open');
    botonMenu.setAttribute('aria-expanded', String(menuAbierto));
  });
}

// 7. Búsqueda dentro de la tabla visible en la página actual
if (campoBusqueda) {
  campoBusqueda.addEventListener('input', () => {
    const busqueda = campoBusqueda.value.trim().toLocaleLowerCase('es');
    const filas = document.querySelectorAll('tbody tr');
    let cantidadVisible = 0;

    filas.forEach((fila) => {
      const coincide = fila.textContent.toLocaleLowerCase('es').includes(busqueda);
      fila.hidden = !coincide;
      if (coincide) cantidadVisible += 1;
    });

    const mensajeVacio = document.querySelector('#empty-search, .sin-resultados');
    if (mensajeVacio) mensajeVacio.hidden = cantidadVisible > 0;
  });
}

// 8. Casillas de tareas, empleados y actividades
document.querySelectorAll('.task-item input, .fila-tarea input').forEach((casilla) => {
  casilla.addEventListener('change', () => {
    const actividad = casilla.closest('.task-item, .fila-tarea');
    if (actividad) actividad.classList.toggle('is-complete', casilla.checked);
    const completadas = document.querySelectorAll('.fila-tarea input:checked').length;
    const completadasInicio = document.querySelectorAll('.task-item input:checked').length;
    const totalCompletadas = document.querySelector('#tareas-completadas');
    if (totalCompletadas) totalCompletadas.textContent = String(completadas + 3);
    const resumenTareas = document.querySelector('.tasks-footer > span:last-child');
    if (resumenTareas) resumenTareas.textContent = `${completadasInicio + 2} de 6 completadas`;
  });
});

// 9. Botones de muestra, riego y avisos del espacio de trabajo
document.querySelectorAll('[data-riego]').forEach((controlRiego) => {
  const estaActivo = controlRiego.classList.contains('is-active');
  controlRiego.setAttribute('aria-pressed', String(estaActivo));
  controlRiego.dataset.riego = estaActivo ? 'activo' : 'inactivo';
});

document.addEventListener('click', (evento) => {
  const elemento = evento.target.closest('button, a');
  if (!elemento) return;

  if (elemento.matches('[data-riego]')) {
    const riegoActivo = elemento.classList.toggle('is-active');
    elemento.dataset.riego = riegoActivo ? 'activo' : 'inactivo';
    elemento.setAttribute('aria-pressed', String(riegoActivo));
    elemento.textContent = riegoActivo ? 'En funcionamiento' : 'Activar riego';
    mostrarAviso(riegoActivo ? 'Riego activado en este prototipo.' : 'Riego pausado en este prototipo.');
    return;
  }

  if (elemento.dataset.accion) mostrarAviso(`${elemento.dataset.accion}: acción de muestra para conectar al sistema.`);
  if (elemento.matches('.notification-button')) mostrarAviso('Tienes 3 avisos: 2 órdenes nuevas y 1 reposición pendiente.');
  if (elemento.matches('.profile-button')) mostrarAviso('Sesión activa: Perfil de administrador.');
  if (elemento.matches('#period-select')) mostrarAviso('Vista de ventas anual · datos de enero a diciembre.');
});

// 10. Cálculos y envío de una nueva venta
const formatoPesosColombianos = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
});

function actualizarTotalesVenta() {
  const formularioVenta = document.querySelector('#formulario-venta');
  if (!formularioVenta) return;

  let subtotal = 0;
  formularioVenta.querySelectorAll('.linea-venta').forEach((linea) => {
    const producto = linea.querySelector('select');
    const cantidad = Number(linea.querySelector('input[type="number"]').value) || 0;
    const precio = Number(producto.selectedOptions[0].dataset.precio) || 0;
    const totalLinea = cantidad * precio;
    subtotal += totalLinea;
    linea.querySelector('.precio-unitario').textContent = formatoPesosColombianos.format(precio);
    linea.querySelector('.total-linea').textContent = formatoPesosColombianos.format(totalLinea);
  });

  const impuesto = Math.round(subtotal * 0.19);
  document.querySelector('#subtotal-venta').textContent = formatoPesosColombianos.format(subtotal);
  document.querySelector('#iva-venta').textContent = formatoPesosColombianos.format(impuesto);
  document.querySelector('#total-venta').textContent = formatoPesosColombianos.format(subtotal + impuesto);
}

document.querySelectorAll('#formulario-venta select, #formulario-venta input[type="number"]').forEach((campo) => {
  campo.addEventListener('input', actualizarTotalesVenta);
  campo.addEventListener('change', actualizarTotalesVenta);
});
actualizarTotalesVenta();

// 11. Guardado de preferencias y formularios de muestra
document.addEventListener('submit', (evento) => {
  if (!['formulario-configuracion', 'formulario-venta', 'formulario-lote'].includes(evento.target.id)) return;
  evento.preventDefault();
  if (evento.target.id === 'formulario-venta') {
    mostrarAviso('Venta de muestra registrada. Puedes continuar con la factura electrónica.');
    return;
  }
  if (evento.target.id === 'formulario-lote') {
    mostrarAviso('Actividad agregada al historial de muestra del lote.');
    return;
  }
  mostrarAviso('Preferencias guardadas en esta vista de muestra.');
});

// 12. Atajos de teclado, menú y fechas de Colombia
document.addEventListener('keydown', (evento) => {
  if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === 'k' && campoBusqueda) {
    evento.preventDefault();
    campoBusqueda.focus();
  }

  if (evento.key === 'Escape' && barraLateral && botonMenu) {
    barraLateral.classList.remove('is-open');
    botonMenu.setAttribute('aria-expanded', 'false');
  }
});

const fechaCorta = document.querySelector('#today-label');
if (fechaCorta) {
  fechaCorta.textContent = new Intl.DateTimeFormat('es-CO', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Bogota',
  }).format(new Date());
}

const fechaTablero = document.querySelector('#dashboard-date');
if (fechaTablero) {
  fechaTablero.textContent = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota',
  }).format(new Date()).toLocaleUpperCase('es-CO');
}

// 13. Selección de lote desde la tabla de Producción
const lotesDeMuestra = {
  'LO-248': { especie: 'Monstera deliciosa', variedad: 'Thai Constellation', tamano: 'Maceta 18 cm', unidades: '120 plantas', inicio: '02 de octubre de 2026', ubicacion: 'Invernadero 2 · Zona B-04', revision: '09 de octubre de 2026' },
  'LO-247': { especie: 'Calathea orbifolia', variedad: 'Silver Plate', tamano: 'Maceta 14 cm', unidades: '6 plantas disponibles', inicio: '04 de octubre de 2026', ubicacion: 'Invernadero 1 · Zona A-12', revision: '08 de octubre de 2026' },
  'LO-246': { especie: 'Ficus lyrata', variedad: 'Bambino', tamano: 'Maceta 20 cm', unidades: '80 plantas', inicio: '16 de septiembre de 2026', ubicacion: 'Invernadero 2 · Zona C-02', revision: '07 de octubre de 2026' },
  'LO-245': { especie: 'Lavanda angustifolia', variedad: 'Hidcote', tamano: 'Maceta 12 cm', unidades: '184 plantas disponibles', inicio: '28 de septiembre de 2026', ubicacion: 'Invernadero 4 · Zona D-08', revision: '08 de octubre de 2026' },
  'LO-244': { especie: 'Philodendron hederaceum', variedad: 'Brasil', tamano: 'Maceta 15 cm', unidades: '96 plantas disponibles', inicio: '20 de septiembre de 2026', ubicacion: 'Invernadero 3 · Zona B-11', revision: '11 de octubre de 2026' },
  'LO-243': { especie: 'Monstera deliciosa', variedad: 'Deliciosa', tamano: 'Maceta 24 cm', unidades: '32 plantas disponibles', inicio: '03 de septiembre de 2026', ubicacion: 'Invernadero 2 · Zona A-06', revision: '11 de octubre de 2026' },
};
const codigoLote = new URLSearchParams(window.location.search).get('id');
const datosLote = lotesDeMuestra[codigoLote];
if (datosLote) {
  const datosFicha = {
    'nombre-especie': datosLote.especie,
    'codigo-lote': codigoLote,
    'codigo-lote-mini': codigoLote,
    'dato-especie': datosLote.especie,
    'dato-variedad': datosLote.variedad,
    'dato-tamano': datosLote.tamano,
    'dato-unidades': datosLote.unidades,
    'dato-inicio': datosLote.inicio,
    'dato-ubicacion': datosLote.ubicacion,
    'dato-revision': datosLote.revision,
  };
  Object.entries(datosFicha).forEach(([identificador, valor]) => {
    const campo = document.getElementById(identificador);
    if (campo) campo.textContent = valor;
  });
}
