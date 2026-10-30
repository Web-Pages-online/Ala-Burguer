# 🍔 Ala Burguer - Menú Digital & Pedidos por WhatsApp

Menú digital interactivo de alta calidad para **Ala Burguer**, diseñado con la misma identidad visual del menú físico (fondo oscuro con brasas, títulos en tipografía script roja, sellos festoneados de precios, acentos dorados y banners modernos).

---

## 🚀 Características Principales

1. **Catálogo Completo y Fiel al Menú:**
   - **🍟 NUESTRAS Entradas:** Orden de Papas, Paponas, Guacamonchis, Dedos de Queso, Boneless (250g, 500g, 1kg con elección de salsa y aderezo) y Alitas (10 y 20 piezas).
   - **🍔 NUESTRAS Hamburguesas:** Clásica, Hawaiana, Mar y Tierra, Argentina, Doble Carne, Mexicana, Champi, Guacachis y Crunchy (¡todas incluyen papas a la francesa!).
   - **🌭 NUESTROS Dogos:** Dogo Jumbo, Dogo Burguer Jumbo, Argentino, Guacamole y Hawaiano (incluyen papas a la francesa).
   - **🥤 Bebidas:** Refrescos 600ml, 1.35L, Coca-Cola 2.5L, 3L y Agua 1L.
   - **🔥 Extras y Adicionales:** Panes especiales (Parrillero, Brioche), Carnes extra, Camarones, Quesos, Guacamole, Chistorra, Salsas y Aderezos.

2. **Personalizador Interactivo (Modal):**
   - Selección de pan (Ajonjolí, Parrillero, Brioche).
   - Elección obligatoria de salsa (BBQ, Búfalo, Mango Habanero, BBQ Spicy) y aderezo (Ranch, Blue Cheese).
   - Selector de extras con suma en tiempo real al total.
   - Campo para notas especiales ("Sin cebolla", "Bien doradas", etc.).
   - Contador de cantidades (+ / -).

3. **Buscador en Tiempo Real:**
   - Filtra al instante por nombre o descripción de platillo.

4. **Carrito de Compras y Checkout Inteligente:**
   - Selector de modalidad: **🛵 Servicio a Domicilio** o **🏪 Recoger en Local**.
   - Formulario de datos de cliente (Nombre, Teléfono, Dirección, Colonia y Referencias).
   - Método de pago: Efectivo (con cálculo automático de cambio), Transferencia o Tarjeta.
   - Botón directo de **Enviar Pedido por WhatsApp** que abre la conversación oficial (`529994356458`) con todo el pedido desglosado y listo para preparar.

---

## 💻 ¿Cómo Probarlo Localmente?

Solo necesitas abrir la terminal en esta carpeta y ejecutar:

```bash
node server.js
```

Y abrir en tu navegador: **`http://localhost:3000`**

*(También puedes simplemente hacer doble clic en el archivo `index.html` para abrirlo directamente en cualquier navegador).*

---

## 🌐 ¿Cómo Publicarlo en Internet Gratis?

Puedes subir esta carpeta a cualquiera de estas plataformas gratuitas en menos de 2 minutos para que tus clientes puedan entrar desde sus celulares o escaneando un código QR:

1. **Vercel** o **Netlify**: Arrastras esta carpeta y te dan un enlace web gratis (ej. `alaburguer.vercel.app`).
2. **GitHub Pages**: Subes el repositorio y activas GitHub Pages.
3. **Hosting tradicional / cPanel**: Subes los archivos a tu carpeta `public_html`.

---

## ✏️ ¿Cómo Modificar Precios o Productos en el Futuro?

Abre el archivo [data.js](file:///c:/Users/jesus/OneDrive/Escritorio/Ala%20Burguer/js/data.js):
- Encontrarás todos los platillos con sus nombres, precios y descripciones en formato fácil de entender y editar.
