// ========================================
// VIRTUALMARKET PERÚ - JAVASCRIPT
// Ejemplos de: Prompt, Confirm, Alert, DOM y Modales
// ========================================

// ========================================
// 1. MENÚ HAMBURGUESA RESPONSIVO
// ========================================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('active');
    menuToggle.querySelector('i').classList.add('fa-bars');
    menuToggle.querySelector('i').classList.remove('fa-times');
  });
});

// ========================================
// 2. SCROLL SUAVE Y BOTÓN SCROLL TO TOP
// ========================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
  
  // Efecto parallax en el hero
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-background');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll suave para todos los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// 3. EJEMPLOS DE PROMPT, CONFIRM Y ALERT
// ========================================

// Variable global para almacenar carrito
let carrito = [];

// Función para agregar productos al carrito (con PROMPT y CONFIRM)
function agregarAlCarrito(nombreProducto, precio) {
  // PROMPT: Solicitar cantidad al usuario
  let cantidad = prompt(`¿Cuántas unidades de "${nombreProducto}" deseas agregar?`, '1');
  
  // Validar que el usuario ingresó algo
  if (cantidad === null || cantidad === '') {
    alert('No ingresaste ninguna cantidad. Operación cancelada.');
    return;
  }
  
  // Convertir a número y validar
  cantidad = parseInt(cantidad);
  
  if (isNaN(cantidad) || cantidad <= 0) {
    alert('⚠️ Cantidad no válida. Por favor ingresa un número mayor a 0.');
    return;
  }
  
  // CONFIRM: Confirmar la acción
  let confirmar = confirm(`¿Confirmas agregar ${cantidad} unidad(es) de "${nombreProducto}" al carrito?\n\nPrecio unitario: S/${precio.toFixed(2)}\nTotal: S/${(precio * cantidad).toFixed(2)}`);
  
  if (confirmar) {
    // Agregar al carrito
    carrito.push({
      producto: nombreProducto,
      precio: precio,
      cantidad: cantidad,
      total: precio * cantidad
    });
    
    // ALERT: Confirmar que se agregó
    alert(`✅ ¡Producto agregado!\n\n${cantidad} x ${nombreProducto}\nTotal: S/${(precio * cantidad).toFixed(2)}`);
    
    // Mostrar modal con el carrito
    mostrarCarrito();
  } else {
    alert('Operación cancelada.');
  }
}

// ========================================
// 4. MANIPULACIÓN DEL DOM - MODAL DEL CARRITO
// ========================================

// Función para mostrar el modal del carrito
function mostrarCarrito() {
  const modal = document.getElementById('modalCarrito');
  const contenido = document.getElementById('carritoContenido');
  
  // Limpiar contenido previo
  contenido.innerHTML = '';
  
  if (carrito.length === 0) {
    contenido.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">Tu carrito está vacío</p>';
  } else {
    let totalGeneral = 0;
    
    // Crear elementos del DOM dinámicamente para cada producto
    carrito.forEach((item, index) => {
      totalGeneral += item.total;
      
      // Crear div del producto
      const itemDiv = document.createElement('div');
      itemDiv.className = 'carrito-item';
      itemDiv.innerHTML = `
        <div>
          <strong>${item.producto}</strong><br>
          <span style="color: #718096; font-size: 14px;">
            ${item.cantidad} x S/${item.precio.toFixed(2)} = S/${item.total.toFixed(2)}
          </span>
        </div>
        <button onclick="eliminarDelCarrito(${index})" style="background: #ff4757; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: bold;">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      `;
      
      contenido.appendChild(itemDiv);
    });
    
    // Agregar total
    const totalDiv = document.createElement('div');
    totalDiv.className = 'carrito-total';
    totalDiv.textContent = `Total: S/${totalGeneral.toFixed(2)}`;
    contenido.appendChild(totalDiv);
  }
  
  // Mostrar modal
  modal.classList.add('active');
}

// Función para cerrar modal
function cerrarModal() {
  const modal = document.getElementById('modalCarrito');
  modal.classList.remove('active');
}

// Cerrar modal al hacer click fuera de él
window.onclick = function(event) {
  const modal = document.getElementById('modalCarrito');
  if (event.target === modal) {
    modal.classList.remove('active');
  }
}

// Función para eliminar producto del carrito (MANIPULACIÓN DEL DOM)
function eliminarDelCarrito(index) {
  const productoEliminado = carrito[index];
  
  // CONFIRM antes de eliminar
  if (confirm(`¿Deseas eliminar "${productoEliminado.producto}" del carrito?`)) {
    carrito.splice(index, 1);
    
    // Actualizar la vista del carrito
    mostrarCarrito();
    
    // Si el carrito quedó vacío, mostrar mensaje
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
    }
  }
}

// Función para confirmar compra
function confirmarCompra() {
  if (carrito.length === 0) {
    alert('⚠️ Tu carrito está vacío. Agrega productos antes de confirmar la compra.');
    return;
  }
  
  let totalGeneral = carrito.reduce((sum, item) => sum + item.total, 0);
  
  // Crear resumen de compra
  let resumen = '🛒 RESUMEN DE TU COMPRA\n\n';
  carrito.forEach(item => {
    resumen += `• ${item.cantidad} x ${item.producto} = S/${item.total.toFixed(2)}\n`;
  });
  resumen += `\n💰 TOTAL: S/${totalGeneral.toFixed(2)}`;
  
  // CONFIRM para finalizar compra
  if (confirm(resumen + '\n\n¿Deseas confirmar tu compra?')) {
    // PROMPT para datos de envío
    let nombre = prompt('Ingresa tu nombre completo:', '');
    
    if (!nombre) {
      alert('Debes ingresar tu nombre para continuar.');
      return;
    }
    
    let direccion = prompt('Ingresa tu dirección de envío:', '');
    
    if (!direccion) {
      alert('Debes ingresar tu dirección para continuar.');
      return;
    }
    
    // Simular procesamiento
    alert('⏳ Procesando tu compra...');
    
    setTimeout(() => {
      alert(`✅ ¡Compra confirmada!\n\n👤 Cliente: ${nombre}\n📍 Dirección: ${direccion}\n💰 Total: S/${totalGeneral.toFixed(2)}\n\n¡Gracias por tu compra! Tu pedido llegará en 24-48 horas.`);
      
      // Vaciar carrito
      carrito = [];
      cerrarModal();
    }, 1000);
  }
}

// ========================================
// 5. FORMULARIO DE CONTACTO CON VALIDACIÓN
// ========================================

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Obtener valores del formulario (MANIPULACIÓN DEL DOM)
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const celular = document.getElementById('celular').value;
  const producto = document.getElementById('producto').value;
  const mensaje = document.getElementById('mensaje').value;
  
  // Validación adicional con CONFIRM
  const confirmar = confirm(`¿Deseas enviar este mensaje?\n\nNombre: ${nombre}\nCorreo: ${correo}\nCelular: ${celular}\nProducto: ${producto}`);
  
  if (!confirmar) {
    alert('Envío cancelado.');
    return;
  }
  
  // Cambiar estado del botón
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;
  btn.style.background = '#718096';
  
  // Simular envío
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
    btn.style.background = '#27ae60';
    
    // ALERT de confirmación
    setTimeout(() => {
      alert(`✅ ¡Mensaje enviado con éxito!\n\nGracias ${nombre}, nos pondremos en contacto contigo pronto al correo ${correo}.`);
      
      // Resetear formulario
      e.target.reset();
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 1000);
  }, 2000);
});

// ========================================
// 6. NEWSLETTER CON PROMPT Y VALIDACIÓN
// ========================================

function suscribirNewsletter() {
  const emailInput = document.getElementById('newsletterEmail');
  const email = emailInput.value.trim();
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    alert('⚠️ Por favor ingresa tu correo electrónico.');
    return;
  }
  
  if (!emailRegex.test(email)) {
    alert('⚠️ Por favor ingresa un correo electrónico válido.');
    return;
  }
  
  // CONFIRM suscripción
  if (confirm(`¿Deseas suscribirte al newsletter con el correo:\n${email}?`)) {
    // Simular suscripción
    alert(`🎉 ¡Suscripción exitosa!\n\nGracias por suscribirte. Recibirás nuestras ofertas exclusivas en ${email}.`);
    emailInput.value = '';
  }
}

// ========================================
// 7. ANIMACIONES CON INTERSECTION OBSERVER
// ========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observar elementos para animaciones
document.querySelectorAll('.service-card, .feature-item, .info-item').forEach(el => {
  observer.observe(el);
});

// ========================================
// 8. EFECTO PARALLAX EN SHAPES
// ========================================

document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.floating-shapes .shape');
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 20;
    const x = mouseX * speed;
    const y = mouseY * speed;
    shape.style.transform = `translate(${x}px, ${y}px) rotate(${x + y}deg)`;
  });
});

// ========================================
// 9. MODIFICAR ELEMENTOS DEL DOM DINÁMICAMENTE
// ========================================

// Cambiar color de los badges de stock aleatoriamente cada 5 segundos (ejemplo didáctico)
function cambiarColoresStock() {
  const badges = document.querySelectorAll('.stock-badge');
  badges.forEach(badge => {
    const clases = ['disponible', 'alta', 'bajo'];
    const claseAleatoria = clases[Math.floor(Math.random() * clases.length)];
    
    // Remover clases anteriores
    badge.classList.remove('disponible', 'alta', 'bajo');
    
    // Agregar nueva clase (esto es solo un ejemplo didáctico)
    // badge.classList.add(claseAleatoria);
  });
}

// Descomentar la siguiente línea para ver el efecto:
// setInterval(cambiarColoresStock, 5000);

// ========================================
// 10. FUNCIÓN PARA MOSTRAR MENSAJE DE BIENVENIDA
// ========================================

// Mostrar mensaje de bienvenida al cargar la página (solo la primera vez)
window.addEventListener('load', () => {
  // Verificar si es la primera visita
  const primeraVisita = !localStorage.getItem('visitado');
  
  if (primeraVisita) {
    setTimeout(() => {
      const nombre = prompt('👋 ¡Bienvenido a VirtualMarket Perú!\n\n¿Cómo te llamas?', '');
      
      if (nombre && nombre.trim() !== '') {
        alert(`¡Hola ${nombre}! 🎉\n\nGracias por visitar nuestra tienda virtual. Explora nuestros productos y aprovecha las ofertas exclusivas.`);
        localStorage.setItem('visitado', 'true');
        localStorage.setItem('nombreUsuario', nombre);
      }
    }, 2000);
  } else {
    // Saludar al usuario que regresa
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      console.log(`¡Bienvenido de nuevo, ${nombreGuardado}!`);
    }
  }
});

// ========================================
// 11. EJEMPLO ADICIONAL: CREAR ELEMENTOS DINÁMICAMENTE
// ========================================

// Función para agregar una fila nueva a la tabla de productos (ejemplo didáctico)
function agregarProductoDinamico() {
  const tabla = document.querySelector('.productos-table tbody');
  
  // Crear nueva fila
  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td data-label="Producto">
      <div class="producto-info">
        <i class="fas fa-desktop"></i>
        <span>Monitor LG UltraWide</span>
      </div>
    </td>
    <td data-label="Precio" class="precio">S/1,200.00</td>
    <td data-label="Stock"><span class="stock-badge disponible">15 unidades</span></td>
    <td data-label="Rating">
      <div class="rating">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>
    </td>
    <td data-label="Acción">
      <button class="btn-table" onclick="agregarAlCarrito('Monitor LG UltraWide', 1200)">Agregar</button>
    </td>
  `;
  
  // Agregar la fila a la tabla
  tabla.appendChild(nuevaFila);
  
  // Animación de entrada
  nuevaFila.style.animation = 'rowFadeIn 0.6s ease forwards';
}

// Descomentar para agregar un producto automáticamente después de 3 segundos:
// setTimeout(agregarProductoDinamico, 3000);

// ========================================
// 12. CONTADOR DE VISITAS (ejemplo didáctico)
// ========================================

function actualizarContadorVisitas() {
  let visitas = localStorage.getItem('contadorVisitas') || 0;
  visitas = parseInt(visitas) + 1;
  localStorage.setItem('contadorVisitas', visitas);
  
  console.log(`Esta es tu visita número ${visitas} a VirtualMarket Perú`);
}

actualizarContadorVisitas();

// ========================================
// FIN DEL SCRIPT
// ========================================

console.log('✅ VirtualMarket Perú - JavaScript cargado correctamente');
console.log('📚 Ejemplos implementados:');
console.log('   1. Menú hamburguesa responsivo');
console.log('   2. Alert, Prompt y Confirm en el carrito');
console.log('   3. Manipulación del DOM (modal del carrito)');
console.log('   4. Validación de formularios');
console.log('   5. Animaciones y efectos interactivos');
console.log('   6. localStorage para persistencia de datos');
