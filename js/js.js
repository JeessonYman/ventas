// ========================================
// VIRTUALMARKET PERÚ 
// ========================================

let carrito = [];
const superModal = document.getElementById('superModal');

// ========================================
// 1. SISTEMA DE MODALES 
// ========================================
function openModal(type, title, htmlContent, showCancel = true, confirmText = 'Aceptar', cancelText = 'Cancelar') {
    if (!superModal) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalIcon = document.getElementById('modalIcon');
    const btnConfirm = document.getElementById('btnConfirm');
    const btnCancel = document.getElementById('btnCancel');

    // Mostrar modal
    superModal.style.display = 'flex';
    setTimeout(() => superModal.classList.add('active'), 10);

    // Contenido
    modalTitle.innerText = title;
    modalBody.innerHTML = htmlContent;

    // Iconos
    modalIcon.className = 'modal-icon ' + type;
    let iconHtml = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') iconHtml = '<i class="fas fa-check-circle"></i>';
    else if (type === 'error') iconHtml = '<i class="fas fa-times-circle"></i>';
    else if (type === 'warning') iconHtml = '<i class="fas fa-exclamation-triangle"></i>';
    else if (type === 'loading') iconHtml = '<div class="spinner"></div>';
    modalIcon.innerHTML = iconHtml;

    // Botones
    btnConfirm.innerHTML = confirmText;
    btnConfirm.style.display = 'block';

    btnCancel.innerHTML = cancelText;
    btnCancel.style.display = showCancel ? 'block' : 'none';

    // Focus
    const input = modalBody.querySelector('input');
    if (input) setTimeout(() => input.focus(), 100);
}

function cerrarSuperModal() {
    if (!superModal) return;
    superModal.classList.remove('active');
    setTimeout(() => superModal.style.display = 'none', 300);
}

// Cerrar al hacer clic fuera
window.onclick = function(event) {
    if (event.target == superModal) cerrarSuperModal();
    const modalCarrito = document.getElementById('modalCarrito');
    if (event.target == modalCarrito) modalCarrito.classList.remove('active');
}

// ========================================
// 2. LÓGICA DEL CARRITO
// ========================================

function actualizarIconoCarrito() {
    const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
        // Pequeña animación
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
}

function agregarAlCarrito(nombreProducto, precio) {
    openModal('info', 'Agregar Producto',
        `<p>¿Cuántas unidades de <strong>${nombreProducto}</strong> deseas?</p>
     <input type="number" id="modalQty" class="modal-input" value="1" min="1">`,
        true, 'Agregar al Carrito');

    document.getElementById('btnConfirm').onclick = () => {
        const cantidad = parseInt(document.getElementById('modalQty').value);
        if (isNaN(cantidad) || cantidad <= 0) return;

        const total = precio * cantidad;
        carrito.push({ producto: nombreProducto, precio: precio, cantidad: cantidad, total: total });

        actualizarIconoCarrito(); // Actualizar burbuja roja

        // MODAL DE ÉXITO CON OPCIONES DE NAVEGACIÓN
        openModal('success', '¡Producto Agregado!',
            `<p>Agregaste <strong>${cantidad} x ${nombreProducto}</strong></p>
       <p style="color:#FFD93D; font-size:1.1em">Subtotal: S/${total.toFixed(2)}</p>`,
            true, 'Ver Carrito', 'Seguir Comprando'); // Botón confirmar lleva al carrito, cancelar cierra

        // Botón "Ver Carrito"
        document.getElementById('btnConfirm').onclick = () => {
            cerrarSuperModal();
            mostrarCarrito();
        };

        // Botón "Seguir Comprando"
        document.getElementById('btnCancel').onclick = cerrarSuperModal;
    };
}

// Mostrar el modal antiguo (Lista de items)
function mostrarCarrito() {
    const modal = document.getElementById('modalCarrito');
    const contenido = document.getElementById('carritoContenido');

    contenido.innerHTML = '';

    if (carrito.length === 0) {
        contenido.innerHTML = '<p style="text-align: center; padding: 20px;">Tu carrito está vacío</p>';
    } else {
        let totalGeneral = 0;
        carrito.forEach((item, index) => {
            totalGeneral += item.total;
            contenido.innerHTML += `
        <div class="carrito-item">
          <div><strong>${item.producto}</strong><br>
          <small>${item.cantidad} x S/${item.precio}</small></div>
          <button onclick="eliminarItem(${index})" style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>`;
        });
        contenido.innerHTML += `<div class="carrito-total">Total: S/${totalGeneral.toFixed(2)}</div>`;
    }
    modal.classList.add('active');
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarIconoCarrito();
    mostrarCarrito(); // Refrescar vista
}

function cerrarModal() {
    document.getElementById('modalCarrito').classList.remove('active');
}

// ========================================
// 3. CHECKOUT (Compra Final)
// ========================================
function confirmarCompra() {
    if (carrito.length === 0) {
        openModal('warning', 'Carrito Vacío', '<p>Agrega productos antes.</p>', false);
        document.getElementById('btnConfirm').onclick = cerrarSuperModal;
        return;
    }

    // Cerrar el modal de lista primero
    cerrarModal();

    const total = carrito.reduce((sum, i) => sum + i.total, 0);

    openModal('info', 'Finalizar Compra',
        `<p>Total a pagar: <strong style="color:#FFD93D">S/${total.toFixed(2)}</strong></p>
     <input type="text" id="chkName" class="modal-input" placeholder="Tu Nombre">
     <input type="text" id="chkAddr" class="modal-input" placeholder="Dirección de envío">`,
        true, 'Confirmar Pedido');

    document.getElementById('btnConfirm').onclick = () => {
        const nombre = document.getElementById('chkName').value;
        const dir = document.getElementById('chkAddr').value;

        if (!nombre || !dir) { alert('Completa los campos'); return; }

        // Simular carga
        openModal('loading', 'Procesando...', '<p>Validando pago...</p>', false, '');
        document.getElementById('btnConfirm').style.display = 'none';

        setTimeout(() => {
            openModal('success', '¡Compra Exitosa!',
                `<p>Gracias <strong>${nombre}</strong></p><p>Pedido enviado a: ${dir}</p>`,
                false, 'Cerrar');
            carrito = [];
            actualizarIconoCarrito();
            document.getElementById('btnConfirm').onclick = cerrarSuperModal;
        }, 2500);
    };
}

// ========================================
// 4. CONTACTO Y BANDEJA DE MENSAJES
// ========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const producto = document.getElementById('producto').value;
        const mensaje = document.getElementById('mensaje').value;
        const fecha = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 1. Mostrar Spinner
        openModal('loading', 'Enviando Mensaje...', '<p>Conectando con el servidor...</p>', false, '');
        document.getElementById('btnConfirm').style.display = 'none';

        setTimeout(() => {
            // 2. Mostrar Éxito
            openModal('success', '¡Mensaje Enviado!',
                `<p>Gracias <strong>${nombre}</strong>, hemos recibido tu consulta sobre <strong>${producto}</strong>.</p>
         <p>Te responderemos a la brevedad.</p>`,
                false, 'Aceptar');

            document.getElementById('btnConfirm').onclick = cerrarSuperModal;

            // 3. Agregar a la Bandeja (Historial)
            const bandeja = document.getElementById('bandejaMensajes');
            if (bandeja) {
                bandeja.style.display = 'block';
                const nuevoMsg = document.createElement('div');
                nuevoMsg.className = 'mensaje-card';
                // HTML del mensaje en la bandeja
                nuevoMsg.innerHTML = `
          <div class="mensaje-icon"><i class="fas fa-envelope-open-text"></i></div>
          <div class="mensaje-content" style="width:100%">
            <div style="display:flex; justify-content:space-between;">
               <h4 style="margin:0; color:#FFD93D">Consulta: ${producto}</h4>
               <span style="font-size:10px; color:white; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;">CLICK PARA VER</span>
            </div>
            <small>Enviado a las ${fecha}</small>
            <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${mensaje}</p>
          </div>
        `;

                // 4. Hacer clicable para ver detalle
                nuevoMsg.onclick = function() {
                    openModal('info', 'Detalle del Mensaje',
                        `<div style="text-align:left; background:rgba(0,0,0,0.2); padding:15px; border-radius:10px;">
               <p><strong>Fecha:</strong> ${fecha}</p>
               <p><strong>Cliente:</strong> ${nombre}</p>
               <p><strong>Producto:</strong> ${producto}</p>
               <hr style="border-color:rgba(255,255,255,0.2); margin:10px 0;">
               <p><strong>Mensaje:</strong><br>${mensaje}</p>
             </div>`,
                        false, 'Cerrar');
                    document.getElementById('btnConfirm').onclick = cerrarSuperModal;
                };

                document.getElementById('listaMensajes').prepend(nuevoMsg); // Agregar al inicio
            }
            contactForm.reset();
        }, 2000);
    });
}

// ========================================
// 5. NEWSLETTER (Arreglado)
// ========================================
function suscribirNewsletter() {
    const email = document.getElementById('newsletterEmail').value;

    if (!email.includes('@')) {
        openModal('error', 'Error', '<p>Por favor ingresa un correo válido.</p>', false);
        document.getElementById('btnConfirm').onclick = cerrarSuperModal;
        return;
    }

    openModal('loading', 'Suscribiendo...', '', false, '');
    document.getElementById('btnConfirm').style.display = 'none';

    setTimeout(() => {
        openModal('success', '¡Suscripción Exitosa!',
            `<p>Gracias por unirte. Las mejores ofertas llegarán a: <br><strong>${email}</strong></p>`,
            false, 'Genial');
        document.getElementById('newsletterEmail').value = '';
        document.getElementById('btnConfirm').onclick = cerrarSuperModal;
    }, 1500);
}

// ========================================
// 6. FUNCIONES DE UI GENERALES
// ========================================
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        document.getElementById('mainNav').classList.toggle('active');
    });
}

// Scroll suave para links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Si es el link del carrito, no hacer scroll
        if (this.getAttribute('onclick')) return;

        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            // Cerrar menú móvil si está abierto
            document.getElementById('mainNav').classList.remove('active');
        }
    });
});

// ========================================
// 7. LÓGICA DEL LOGIN (Solo funciona en login.html)
// ========================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    // Función para crear las alertas (Toasts) en el Login
    function showLoginToast(type, title, message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconHtml = '';
        if (type === 'success') iconHtml = '<i class="fas fa-check-circle" style="color:#2ed573"></i>';
        else if (type === 'error') iconHtml = '<i class="fas fa-times-circle" style="color:#ff4757"></i>';
        else if (type === 'warning') iconHtml = '<i class="fas fa-exclamation-triangle" style="color:#ffa502"></i>';

        toast.innerHTML = `
            ${iconHtml}
            <div class="toast-content">
                <h4 style="margin:0; font-size:16px; color:#333">${title}</h4>
                <p style="margin:5px 0 0; color:#666; font-size:14px">${message}</p>
            </div>
        `;

        container.appendChild(toast);

        // Animación de entrada y salida
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Evento del botón INGRESAR
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        const btn = document.querySelector('.btn-login');
        const originalText = btn.innerHTML;
        const card = document.querySelector('.login-container');

        // 1. Validar campos vacíos
        if (!user || !pass) {
            showLoginToast('warning', 'Atención', 'Por favor completa usuario y contraseña.');
            card.classList.add('shake-anim'); // Activar vibración
            setTimeout(() => card.classList.remove('shake-anim'), 500);
            return;
        }

        // 2. Simular carga (Animación del botón)
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

        setTimeout(() => {
            // 3. Validar credenciales
            if (user === 'admin' && pass === '1234') {
                showLoginToast('success', '¡Bienvenido!', 'Credenciales correctas. Entrando...');
                setTimeout(() => {
                    window.location.href = 'Tienda.HTML';
                }, 1500);
            } else {
                // Error
                showLoginToast('error', 'Acceso Denegado', 'Usuario o contraseña incorrectos.');
                btn.disabled = false;
                btn.innerHTML = originalText;
                document.getElementById('password').value = ''; // Limpiar contraseña

                // Vibración de error
                card.classList.add('shake-anim');
                setTimeout(() => card.classList.remove('shake-anim'), 500);
            }
        }, 1500); // Tiempo de espera simulado
    });
}