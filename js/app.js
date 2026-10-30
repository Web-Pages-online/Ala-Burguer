// ==========================================================================
// ALA BURGUER - LÓGICA DE LA APLICACIÓN Y PEDIDOS POR WHATSAPP
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Estado de la Aplicación
    const state = {
        cart: JSON.parse(localStorage.getItem('ala_burguer_cart') || '[]'),
        deliveryType: 'domicilio', // 'domicilio' | 'recoger'
        paymentMethod: 'efectivo', // 'efectivo' | 'transferencia' | 'tarjeta'
        activeModalItem: null,
        modalQuantity: 1,
        selectedBread: 'ajonjoli',
        selectedVariant: null,
        selectedSauce: 'bbq',
        selectedDressing: 'ranch',
        selectedExtras: []
    };

    // Elementos DOM
    const menuContainer = document.getElementById('menu-sections-container');
    const categoriesNav = document.getElementById('categories-pills-list');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    // Carrito Elements
    const cartTrigger = document.getElementById('cart-floating-trigger');
    const cartBadge = document.getElementById('cart-count-badge');
    const cartSubtotalEl = document.getElementById('cart-subtotal-trigger');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    const cartDrawerClose = document.getElementById('cart-drawer-close');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartDrawerTotal = document.getElementById('cart-drawer-total');
    const btnSendWhatsApp = document.getElementById('btn-send-whatsapp');

    // Modal Elements
    const modalBackdrop = document.getElementById('customizer-modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-item-title');
    const modalDescription = document.getElementById('modal-item-description');
    const modalCustomGroups = document.getElementById('modal-custom-groups');
    const modalQtyValue = document.getElementById('modal-qty-value');
    const modalMinusBtn = document.getElementById('modal-minus-btn');
    const modalPlusBtn = document.getElementById('modal-plus-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalTotalPriceEl = document.getElementById('modal-total-price');
    const modalNotesInput = document.getElementById('modal-notes-input');

    // Formulario de Checkout
    const toggleDeliveryBtn = document.getElementById('btn-type-domicilio');
    const togglePickupBtn = document.getElementById('btn-type-recoger');
    const addressFieldsGroup = document.getElementById('delivery-address-fields');
    const payMethodBtns = document.querySelectorAll('.pay-btn-opt');
    const cashChangeField = document.getElementById('cash-change-container');
    const cashAmountInput = document.getElementById('client-cash-amount');

    // Limpieza de modo prueba
    localStorage.removeItem('ala_burguer_demo_open');

    // Inicializar
    updateScheduleUI();
    renderCategoryNav();
    renderMenu();
    updateCartUI();
    setupEventListeners();

    // Comprobar horario cada minuto automáticamente
    setInterval(updateScheduleUI, 60000);

    // ======================================================================
    // CONTROL DE HORARIOS (MÉRIDA, YUCATÁN)
    // Viernes a Domingo: 7:00 PM a 12:00 AM (Habilitado 10 min antes, 6:50 PM)
    // ======================================================================
    function getMeridaDateInfo() {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Merida',
            hour12: false,
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        const parts = formatter.formatToParts(now);
        const map = {};
        parts.forEach(p => map[p.type] = p.value);

        const weekdayMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
        const dayOfWeek = weekdayMap[map.weekday] !== undefined ? weekdayMap[map.weekday] : now.getDay();
        const hour = parseInt(map.hour, 10);
        const minute = parseInt(map.minute, 10);
        const currentMinutes = hour * 60 + minute;

        return {
            dayOfWeek,
            hour,
            minute,
            currentMinutes,
            timeStr: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        };
    }

    function checkStoreStatus() {
        const sched = MENU_DATA.info.schedule;
        const merida = getMeridaDateInfo();

        // 7:00 PM = 19:00 = 1140 min. 10 minutos antes = 18:50 = 1130 min.
        const openStartMinutes = (sched.startHour * 60 + sched.startMinute) - sched.earlyAccessMinutes;
        // 12:00 AM (Medianoche) = 24 * 60 = 1440 min
        const openEndMinutes = sched.endHour * 60;

        const isOpenDay = sched.openDays.includes(merida.dayOfWeek);
        const isWithinHours = isOpenDay && (merida.currentMinutes >= openStartMinutes && merida.currentMinutes < openEndMinutes);

        // Próxima apertura
        let nextOpeningText = "";
        if (isOpenDay) {
            if (merida.currentMinutes < openStartMinutes) {
                nextOpeningText = "Abrimos hoy a las 7:00 PM (pedidos desde 6:50 PM)";
            } else if (merida.currentMinutes >= openEndMinutes) {
                if (merida.dayOfWeek === 5) nextOpeningText = "Abrimos el Sábado a las 7:00 PM";
                else if (merida.dayOfWeek === 6) nextOpeningText = "Abrimos el Domingo a las 7:00 PM";
                else nextOpeningText = "Abrimos el Viernes a las 7:00 PM";
            }
        } else {
            if (merida.dayOfWeek === 4) {
                nextOpeningText = "Abrimos mañana Viernes a las 7:00 PM";
            } else {
                nextOpeningText = "Abrimos el Viernes a las 7:00 PM";
            }
        }

        return {
            isOpen: isWithinHours,
            nextOpeningText: nextOpeningText,
            meridaTimeStr: merida.timeStr
        };
    }

    function updateScheduleUI() {
        const status = checkStoreStatus();
        const topPill = document.getElementById('top-status-pill');
        const topDot = document.getElementById('top-status-dot');
        const topText = document.getElementById('top-status-text');

        const banner = document.getElementById('schedule-alert-banner');
        const iconEl = document.getElementById('schedule-icon');
        const titleEl = document.getElementById('schedule-title');
        const descEl = document.getElementById('schedule-desc');

        // Alternar clase en body para poner productos en gris y deshabilitar pedidos
        if (status.isOpen) {
            document.body.classList.remove('store-is-closed');
        } else {
            document.body.classList.add('store-is-closed');
        }

        if (topPill && topDot && topText) {
            if (status.isOpen) {
                topPill.className = 'status-pill open';
                topDot.className = 'status-dot green';
                topText.textContent = '🟢 ABIERTO • RECIBIENDO PEDIDOS';
            } else {
                topPill.className = 'status-pill closed';
                topDot.className = 'status-dot red';
                topText.textContent = `🔴 CERRADO • ${status.nextOpeningText}`;
            }
        }

        if (banner && iconEl && titleEl && descEl) {
            if (status.isOpen) {
                banner.className = 'schedule-alert-banner open';
                iconEl.textContent = '🔥';
                titleEl.textContent = '¡Estamos ABIERTOS y listos para preparar tu orden!';
                descEl.innerHTML = `Horario oficial: <span class="highlight-hours">Viernes a Domingo de 7:00 PM a 12:00 AM</span> (Hora de Mérida). ¡Haz tu pedido ahora y te lo llevamos calientito!`;
            } else {
                banner.className = 'schedule-alert-banner closed';
                iconEl.textContent = '🕒';
                titleEl.textContent = 'Cocina Cerrada en este momento (Menú en modo informativo)';
                descEl.innerHTML = `Horario de pedidos: <span class="highlight-hours">Viernes a Domingo de 7:00 PM a 12:00 AM</span> (habilitado 10 min antes, 6:50 PM). <strong>${status.nextOpeningText}</strong>. Puedes explorar todos los productos y precios con calma.`;
            }
        }

        // Actualizar textos de botones en las tarjetas
        document.querySelectorAll('.btn-add-item').forEach(btn => {
            if (!status.isOpen) {
                btn.innerHTML = '<span>🔒</span> <span>Cerrado</span>';
            } else {
                btn.innerHTML = '<span>+</span> <span>Pedir</span>';
            }
        });
    }

    // ======================================================================
    // RENDERIZADO DE NAVEGACIÓN Y MENÚ
    // ======================================================================
    function renderCategoryNav() {
        categoriesNav.innerHTML = '';
        MENU_DATA.categories.forEach((cat, index) => {
            const pill = document.createElement('a');
            pill.className = `category-pill ${index === 0 ? 'active' : ''}`;
            pill.href = `#cat-${cat.id}`;
            pill.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const target = document.getElementById(`cat-${cat.id}`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
            categoriesNav.appendChild(pill);
        });
    }

    function renderMenu() {
        menuContainer.innerHTML = '';

        MENU_DATA.categories.forEach(category => {
            const section = document.createElement('section');
            section.className = 'menu-section';
            section.id = `cat-${category.id}`;

            // Cabecera estilizada idéntica al volante original
            let categoryHeaderHtml = `
                <div class="category-header-banner">
                    <div class="category-prefix-wrapper">
                        <div class="category-prefix-line"></div>
                        <span class="category-prefix-title">${category.subtitle || 'NUESTRAS'}</span>
                        <div class="category-prefix-line right"></div>
                    </div>
                    <h2 class="category-main-title">${category.name}</h2>
                    ${category.description ? `<p class="category-lead-desc">${category.description}</p>` : ''}
                </div>
            `;

            // Hero banner por categoría (si tiene imagen)
            let heroCardHtml = '';
            if (category.heroImage) {
                heroCardHtml = `
                    <div class="category-hero-card">
                        <img src="${category.heroImage}" alt="${category.name} Ala Burguer" loading="lazy">
                        <div class="category-hero-overlay">
                            <span class="category-hero-badge">Especialidad Ala Burguer</span>
                            <h3 class="category-hero-title">${category.name}</h3>
                        </div>
                    </div>
                `;
            }

            // Banner especial de panes para hamburguesas
            let breadNoticeHtml = '';
            if (category.id === 'hamburguesas') {
                breadNoticeHtml = `
                    <div class="bread-option-banner">
                        <span>🍔 <strong>Cambia tu pan de hamburguesa por $5 extra:</strong></span>
                        <div class="bread-types">
                            <span>• Ajonjolí (Incluido)</span>
                            <span>• Parrillero (+$5)</span>
                            <span>• Brioche (+$5)</span>
                        </div>
                    </div>
                `;
            }

            // Grid de Productos
            let productsGridHtml = `<div class="products-grid">`;

            category.items.forEach(item => {
                const isBurgerOrDogo = category.id === 'hamburguesas' || category.id === 'dogos';
                const hasVariants = item.variants && item.variants.length > 0;
                const displayPrice = hasVariants ? item.variants[0].price : item.price;
                const pricePrefix = hasVariants ? '<span class="price-stamp-from">Desde</span>' : '';

                productsGridHtml += `
                    <div class="product-card" data-item-id="${item.id}" data-category-id="${category.id}">
                        <div class="product-header">
                            <div class="product-title-group">
                                ${item.badge ? `<span class="product-tag-chip">${item.badge}</span>` : ''}
                                <h3 class="product-title">${item.name}</h3>
                            </div>
                            <div class="price-stamp" title="Precio">
                                ${pricePrefix}
                                <span class="price-stamp-val">$${displayPrice}</span>
                            </div>
                        </div>

                        <p class="product-description">${item.description}</p>

                        <div class="product-footer">
                            ${isBurgerOrDogo ? `
                                <div class="product-includes-tag">
                                    <span>🍟</span> Incluye Papas
                                </div>
                            ` : '<div></div>'}
                            
                            <button class="btn-add-item" onclick="window.openItemCustomizer('${category.id}', '${item.id}')">
                                <span>+</span> 
                                <span>${item.optionsType === 'simple' && !hasVariants ? 'Agregar' : 'Pedir'}</span>
                            </button>
                        </div>
                    </div>
                `;
            });

            productsGridHtml += `</div>`;

            section.innerHTML = categoryHeaderHtml + heroCardHtml + breadNoticeHtml + productsGridHtml;
            menuContainer.appendChild(section);
        });
    }

    // ======================================================================
    // BUSCADOR EN TIEMPO REAL
    // ======================================================================
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';

        const productCards = document.querySelectorAll('.product-card');
        let matchesCount = 0;

        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const desc = card.querySelector('.product-description').textContent.toLowerCase();

            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'flex';
                matchesCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Ocultar secciones si todos sus items están ocultos
        MENU_DATA.categories.forEach(cat => {
            const section = document.getElementById(`cat-${cat.id}`);
            if (section) {
                const visibleCards = section.querySelectorAll('.product-card[style="display: flex;"]');
                section.style.display = (visibleCards.length > 0 || query === '') ? 'block' : 'none';
            }
        });
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });

    // ======================================================================
    // MODAL DE PERSONALIZACIÓN
    // ======================================================================
    window.openItemCustomizer = function(categoryId, itemId) {
        const scheduleStatus = checkStoreStatus();
        if (!scheduleStatus.isOpen) {
            showToast(`⏰ Cocina cerrada. Tomamos pedidos de Vie a Dom de 7:00 PM a 12:00 AM (${scheduleStatus.nextOpeningText})`);
            return;
        }

        const category = MENU_DATA.categories.find(c => c.id === categoryId);
        if (!category) return;
        const item = category.items.find(i => i.id === itemId);
        if (!item) return;

        state.activeModalItem = { ...item, categoryId: category.id };
        state.modalQuantity = 1;
        state.selectedBread = item.defaultBread || 'ajonjoli';
        state.selectedVariant = item.variants ? item.variants[0] : null;
        state.selectedSauce = (item.requiresSauce || category.id === 'entradas') ? MENU_DATA.salsas[0].name : null;
        state.selectedDressing = (item.requiresDressing || category.id === 'entradas') ? MENU_DATA.aderezos[0].name : null;
        state.selectedExtras = [];
        modalNotesInput.value = '';

        // Títulos
        modalTitle.textContent = item.name;
        modalDescription.textContent = item.description;

        // Construir Grupos de opciones
        modalCustomGroups.innerHTML = '';

        // 1. Selector de Variantes / Tamaños (Boneless / Alitas)
        if (item.variants && item.variants.length > 0) {
            const variantGroup = document.createElement('div');
            variantGroup.innerHTML = `
                <div class="modal-group-title">
                    <span>Elige el tamaño:</span>
                    <span class="required-badge">Obligatorio</span>
                </div>
                <div class="options-grid">
                    ${item.variants.map((v, i) => `
                        <label class="option-select-card ${i === 0 ? 'selected' : ''}">
                            <div class="option-details">
                                <input type="radio" name="variant-option" value="${v.name}" ${i === 0 ? 'checked' : ''} onchange="window.updateVariantSelection('${v.name}', ${v.price})">
                                <span class="option-name">${v.name}</span>
                            </div>
                            <span class="option-price-tag">$${v.price}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            modalCustomGroups.appendChild(variantGroup);
        }

        // 2. Selector de Tipo de Pan (Hamburguesas)
        if (item.optionsType === 'burger' || item.optionsType === 'burger_crunchy') {
            const breadGroup = document.createElement('div');
            breadGroup.innerHTML = `
                <div class="modal-group-title">
                    <span>Tipo de Pan:</span>
                    <span class="required-badge">Obligatorio</span>
                </div>
                <div class="options-grid">
                    ${MENU_DATA.panes.map(p => `
                        <label class="option-select-card ${state.selectedBread === p.id ? 'selected' : ''}">
                            <div class="option-details">
                                <input type="radio" name="bread-option" value="${p.id}" ${state.selectedBread === p.id ? 'checked' : ''} onchange="window.updateBreadSelection('${p.id}')">
                                <span class="option-name">${p.name}</span>
                            </div>
                            <span class="option-price-tag">${p.price > 0 ? `+$${p.price}` : 'Incluido'}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            modalCustomGroups.appendChild(breadGroup);
        }

        // 3. Selector de Salsa (Boneless, Alitas, Crunchy)
        if (item.requiresSauce) {
            const sauceGroup = document.createElement('div');
            sauceGroup.innerHTML = `
                <div class="modal-group-title">
                    <span>Salsa para bañar:</span>
                    <span class="required-badge">Obligatorio</span>
                </div>
                <div class="options-grid">
                    ${MENU_DATA.salsas.map((s, idx) => `
                        <label class="option-select-card ${idx === 0 ? 'selected' : ''}">
                            <div class="option-details">
                                <input type="radio" name="sauce-option" value="${s.name}" ${idx === 0 ? 'checked' : ''} onchange="window.updateSauceSelection('${s.name}')">
                                <span class="option-name">${s.name}</span>
                            </div>
                            <span class="option-price-tag">Incluida</span>
                        </label>
                    `).join('')}
                </div>
            `;
            modalCustomGroups.appendChild(sauceGroup);
        }

        // 4. Selector de Aderezo (Boneless, Alitas)
        if (item.requiresDressing) {
            const dressingGroup = document.createElement('div');
            dressingGroup.innerHTML = `
                <div class="modal-group-title">
                    <span>Aderezo:</span>
                    <span class="required-badge">Obligatorio</span>
                </div>
                <div class="options-grid">
                    ${MENU_DATA.aderezos.map((d, idx) => `
                        <label class="option-select-card ${idx === 0 ? 'selected' : ''}">
                            <div class="option-details">
                                <input type="radio" name="dressing-option" value="${d.name}" ${idx === 0 ? 'checked' : ''} onchange="window.updateDressingSelection('${d.name}')">
                                <span class="option-name">${d.name}</span>
                            </div>
                            <span class="option-price-tag">Incluido</span>
                        </label>
                    `).join('')}
                </div>
            `;
            modalCustomGroups.appendChild(dressingGroup);
        }

        // 5. Extras y Adicionales (Para Hamburguesas, Dogos o Entradas)
        if (category.id === 'hamburguesas' || category.id === 'dogos' || category.id === 'entradas') {
            const extrasGroup = document.createElement('div');
            extrasGroup.innerHTML = `
                <div class="modal-group-title">
                    <span>¿Deseas agregar algún extra?</span>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(Opcional)</span>
                </div>
                <div class="extras-checkbox-list">
                    ${MENU_DATA.extrasList.slice(0, 8).map(ex => `
                        <label class="option-select-card">
                            <div class="option-details">
                                <input type="checkbox" value="${ex.id}" onchange="window.toggleExtra('${ex.id}', ${ex.price}, '${ex.name}')">
                                <span class="option-name" style="font-size:0.82rem;">${ex.name}</span>
                            </div>
                            <span class="option-price-tag" style="font-size:0.8rem;">+$${ex.price}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            modalCustomGroups.appendChild(extrasGroup);
        }

        updateModalPrice();
        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
        state.activeModalItem = null;
    };

    // Funciones globales para actualizar selecciones en el modal
    window.updateBreadSelection = function(breadId) {
        state.selectedBread = breadId;
        document.querySelectorAll('input[name="bread-option"]').forEach(input => {
            const card = input.closest('.option-select-card');
            if (card) {
                card.classList.toggle('selected', input.value === breadId);
            }
        });
        updateModalPrice();
    };

    window.updateVariantSelection = function(variantName, price) {
        state.selectedVariant = { name: variantName, price: price };
        document.querySelectorAll('input[name="variant-option"]').forEach(input => {
            const card = input.closest('.option-select-card');
            if (card) {
                card.classList.toggle('selected', input.value === variantName);
            }
        });
        updateModalPrice();
    };

    window.updateSauceSelection = function(sauceName) {
        state.selectedSauce = sauceName;
        document.querySelectorAll('input[name="sauce-option"]').forEach(input => {
            const card = input.closest('.option-select-card');
            if (card) {
                card.classList.toggle('selected', input.value === sauceName);
            }
        });
    };

    window.updateDressingSelection = function(dressingName) {
        state.selectedDressing = dressingName;
        document.querySelectorAll('input[name="dressing-option"]').forEach(input => {
            const card = input.closest('.option-select-card');
            if (card) {
                card.classList.toggle('selected', input.value === dressingName);
            }
        });
    };

    window.toggleExtra = function(id, price, name) {
        const index = state.selectedExtras.findIndex(e => e.id === id);
        if (index > -1) {
            state.selectedExtras.splice(index, 1);
        } else {
            state.selectedExtras.push({ id, price, name });
        }
        updateModalPrice();
    };

    function calculateModalUnitPrice() {
        if (!state.activeModalItem) return 0;
        let base = state.selectedVariant ? state.selectedVariant.price : state.activeModalItem.price;

        // Sumar pan si aplica
        if (state.activeModalItem.optionsType === 'burger' || state.activeModalItem.optionsType === 'burger_crunchy') {
            const breadObj = MENU_DATA.panes.find(p => p.id === state.selectedBread);
            if (breadObj) base += breadObj.price;
        }

        // Sumar extras
        state.selectedExtras.forEach(e => {
            base += e.price;
        });

        return base;
    }

    function updateModalPrice() {
        const unitPrice = calculateModalUnitPrice();
        const total = unitPrice * state.modalQuantity;
        modalQtyValue.textContent = state.modalQuantity;
        modalTotalPriceEl.textContent = `$${total.toFixed(2)}`;
    }

    modalMinusBtn.addEventListener('click', () => {
        if (state.modalQuantity > 1) {
            state.modalQuantity--;
            updateModalPrice();
        }
    });

    modalPlusBtn.addEventListener('click', () => {
        state.modalQuantity++;
        updateModalPrice();
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    // Confirmar y agregar al carrito
    modalConfirmBtn.addEventListener('click', () => {
        if (!state.activeModalItem) return;

        const unitPrice = calculateModalUnitPrice();
        const breadObj = MENU_DATA.panes.find(p => p.id === state.selectedBread);

        const cartItem = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            itemId: state.activeModalItem.id,
            name: state.activeModalItem.name,
            variant: state.selectedVariant ? state.selectedVariant.name : null,
            bread: (state.activeModalItem.optionsType === 'burger' || state.activeModalItem.optionsType === 'burger_crunchy') ? breadObj.name : null,
            sauce: state.selectedSauce,
            dressing: state.selectedDressing,
            extras: [...state.selectedExtras],
            notes: modalNotesInput.value.trim(),
            unitPrice: unitPrice,
            quantity: state.modalQuantity,
            totalPrice: unitPrice * state.modalQuantity
        };

        state.cart.push(cartItem);
        saveCart();
        updateCartUI();
        closeModal();
        showToast(`¡${state.modalQuantity}x ${cartItem.name} agregado al carrito! 🔥`);
    });

    // ======================================================================
    // GESTIÓN DEL CARRITO
    // ======================================================================
    function saveCart() {
        localStorage.setItem('ala_burguer_cart', JSON.stringify(state.cart));
    }

    function updateCartUI() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);

        cartBadge.textContent = totalItems;
        cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        cartDrawerTotal.textContent = `$${subtotal.toFixed(2)}`;

        // Renderizar lista en Drawer
        if (state.cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart-state">
                    <div class="empty-cart-icon">🍔</div>
                    <h4>Tu carrito está vacío</h4>
                    <p>Agrega unas ricas hamburguesas, dogos o alitas a tu pedido.</p>
                </div>
            `;
        } else {
            cartItemsList.innerHTML = state.cart.map(item => {
                let details = [];
                if (item.variant) details.push(`• Tamaño: ${item.variant}`);
                if (item.bread) details.push(`• Pan: ${item.bread}`);
                if (item.sauce) details.push(`• Salsa: ${item.sauce}`);
                if (item.dressing) details.push(`• Aderezo: ${item.dressing}`);
                if (item.extras && item.extras.length > 0) {
                    details.push(`• Extras: ${item.extras.map(e => e.name).join(', ')}`);
                }
                if (item.notes) details.push(`• Nota: "${item.notes}"`);

                return `
                    <div class="cart-item-card">
                        <div class="cart-item-top">
                            <div>
                                <h4 class="cart-item-name">${item.quantity}x ${item.name}</h4>
                            </div>
                            <span class="cart-item-price">$${item.totalPrice.toFixed(2)}</span>
                        </div>
                        ${details.length > 0 ? `
                            <div class="cart-item-customs">
                                ${details.map(d => `<div>${d}</div>`).join('')}
                            </div>
                        ` : ''}
                        <div class="cart-item-bottom">
                            <span style="font-size:0.75rem; color:var(--text-dim);">$${item.unitPrice.toFixed(2)} c/u</span>
                            <button class="cart-item-remove-btn" onclick="window.removeCartItem('${item.id}')">
                                🗑️ Quitar
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Validación de Estado de Horario en el Checkout
        const scheduleStatus = checkStoreStatus();
        const existingNotice = document.getElementById('cart-closed-notice');

        if (!scheduleStatus.isOpen) {
            btnSendWhatsApp.disabled = true;
            btnSendWhatsApp.classList.add('store-closed');
            btnSendWhatsApp.innerHTML = `<span>🔴 COCINA CERRADA (${scheduleStatus.nextOpeningText})</span>`;

            if (!existingNotice) {
                const notice = document.createElement('div');
                notice.className = 'closed-store-checkout-notice';
                notice.id = 'cart-closed-notice';
                notice.innerHTML = `⏰ <strong>Estamos fuera de horario de pedidos</strong><br>Horario de atención: Viernes a Domingo de 7:00 PM a 12:00 AM (pedidos habilitados desde las 6:50 PM).`;
                btnSendWhatsApp.parentNode.insertBefore(notice, btnSendWhatsApp);
            }
        } else {
            btnSendWhatsApp.classList.remove('store-closed');
            if (existingNotice) existingNotice.remove();

            if (state.cart.length === 0) {
                btnSendWhatsApp.disabled = true;
                btnSendWhatsApp.innerHTML = `<span>📲 ENVIAR PEDIDO POR WHATSAPP</span>`;
            } else {
                btnSendWhatsApp.disabled = false;
                btnSendWhatsApp.innerHTML = `<span>📲 ENVIAR PEDIDO POR WHATSAPP</span>`;
            }
        }
    }

    window.removeCartItem = function(cartId) {
        state.cart = state.cart.filter(item => item.id !== cartId);
        saveCart();
        updateCartUI();
        showToast('Producto retirado del carrito');
    };

    // Toggle de Drawer
    cartTrigger.addEventListener('click', () => {
        cartDrawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    cartDrawerClose.addEventListener('click', () => {
        cartDrawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });

    cartDrawerOverlay.addEventListener('click', (e) => {
        if (e.target === cartDrawerOverlay) {
            cartDrawerOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // ======================================================================
    // EVENTOS DE CHECKOUT (DOMICILIO / RECOGER / MÉTODO DE PAGO)
    // ======================================================================
    function setupEventListeners() {
        toggleDeliveryBtn.addEventListener('click', () => {
            state.deliveryType = 'domicilio';
            toggleDeliveryBtn.classList.add('active');
            togglePickupBtn.classList.remove('active');
            addressFieldsGroup.style.display = 'flex';
        });

        togglePickupBtn.addEventListener('click', () => {
            state.deliveryType = 'recoger';
            togglePickupBtn.classList.add('active');
            toggleDeliveryBtn.classList.remove('active');
            addressFieldsGroup.style.display = 'none';
        });

        payMethodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                payMethodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.paymentMethod = btn.dataset.method;

                if (state.paymentMethod === 'efectivo') {
                    cashChangeField.style.display = 'block';
                } else {
                    cashChangeField.style.display = 'none';
                }
            });
        });

        // Enviar Pedido a WhatsApp
        btnSendWhatsApp.addEventListener('click', sendOrderToWhatsApp);
    }

    // ======================================================================
    // GENERADOR Y ENVÍO DEL PEDIDO A WHATSAPP
    // ======================================================================
    function sendOrderToWhatsApp() {
        const scheduleStatus = checkStoreStatus();
        if (!scheduleStatus.isOpen) {
            alert(`⚠️ En este momento la cocina de Ala Burguer está cerrada.\n\nHorario de atención: Viernes a Domingo de 7:00 PM a 12:00 AM (Hora de Mérida, pedidos habilitados desde 6:50 PM).\n\n${scheduleStatus.nextOpeningText}`);
            return;
        }

        if (state.cart.length === 0) {
            alert('Agrega al menos un producto a tu carrito antes de enviar el pedido.');
            return;
        }

        const clientName = document.getElementById('client-name').value.trim();
        const clientPhone = document.getElementById('client-phone').value.trim();
        const clientStreet = document.getElementById('client-street').value.trim();
        const clientCross = document.getElementById('client-cross').value.trim();
        const clientColonia = document.getElementById('client-colonia').value.trim();
        const clientNotes = document.getElementById('client-notes').value.trim();
        const clientCashAmount = cashAmountInput ? parseFloat(cashAmountInput.value) : 0;

        // Validaciones básicas
        if (!clientName) {
            alert('Por favor ingresa tu Nombre para el pedido.');
            document.getElementById('client-name').focus();
            return;
        }

        if (state.deliveryType === 'domicilio') {
            if (!clientStreet || !clientColonia) {
                alert('Por favor ingresa tu Calle/Número y Colonia para la entrega a domicilio.');
                document.getElementById('client-street').focus();
                return;
            }
        }

        const subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);

        // Construir Mensaje Formateado para WhatsApp (100% compatible con móviles)
        let msg = `🍔 *¡HOLA! QUIERO HACER UN PEDIDO EN ALA BURGUER* 🍔\n\n`;
        msg += `👤 *Cliente:* ${clientName}\n`;
        if (clientPhone) msg += `📞 *Teléfono:* ${clientPhone}\n`;
        msg += `📍 *Entrega:* ${state.deliveryType === 'domicilio' ? '🛵 Servicio a Domicilio' : '🏪 Recoger en Local'}\n`;

        if (state.deliveryType === 'domicilio') {
            msg += `🏠 *Dirección:* ${clientStreet}\n`;
            if (clientCross) msg += `🛣️ *Referencia/Cruzamientos:* ${clientCross}\n`;
            msg += `🏘️ *Colonia:* ${clientColonia}\n`;
        }

        msg += `\n----------------------------------------\n`;
        msg += `📋 *DETALLE DEL PEDIDO:*\n\n`;

        state.cart.forEach((item) => {
            msg += `👉 *${item.quantity}x ${item.name}* ($${item.totalPrice.toFixed(2)})\n`;
            if (item.variant) msg += `   • Tamaño: ${item.variant}\n`;
            if (item.bread) msg += `   • Pan: ${item.bread}\n`;
            if (item.sauce) msg += `   • Salsa: ${item.sauce}\n`;
            if (item.dressing) msg += `   • Aderezo: ${item.dressing}\n`;
            if (item.extras && item.extras.length > 0) {
                msg += `   • Extras: ${item.extras.map(e => `${e.name} (+$${e.price})`).join(', ')}\n`;
            }
            if (item.notes) msg += `   • Indicación: "${item.notes}"\n`;
            msg += `\n`;
        });

        msg += `----------------------------------------\n`;
        msg += `💵 *TOTAL A PAGAR: $${subtotal.toFixed(2)} MXN*\n`;

        // Método de pago
        if (state.paymentMethod === 'efectivo') {
            msg += `💳 *Método de Pago:* Efectivo`;
            if (clientCashAmount && clientCashAmount > subtotal) {
                const change = clientCashAmount - subtotal;
                msg += ` (Pagaré con $${clientCashAmount.toFixed(2)} - Cambio: $${change.toFixed(2)})\n`;
            } else if (clientCashAmount && clientCashAmount === subtotal) {
                msg += ` (Pago exacto)\n`;
            } else {
                msg += `\n`;
            }
        } else if (state.paymentMethod === 'transferencia') {
            msg += `💳 *Método de Pago:* Transferencia Bancaria (Solicito datos CLABE)\n`;
        } else {
            msg += `💳 *Método de Pago:* Tarjeta al recibir (Terminal)\n`;
        }

        if (clientNotes) {
            msg += `💬 *Comentarios:* ${clientNotes}\n`;
        }

        msg += `\n🔥 *¡Muchas gracias! Quedo a la espera de confirmación.*`;

        // Crear URL y Redirigir a WhatsApp
        const encodedMsg = encodeURIComponent(msg);
        const whatsappUrl = `https://wa.me/${MENU_DATA.info.whatsapp}?text=${encodedMsg}`;

        // Abrir WhatsApp en nueva pestaña
        window.open(whatsappUrl, '_blank');

        showToast('¡Redirigiendo a WhatsApp con tu pedido! 📲');
    }

    // ======================================================================
    // NOTIFICACIONES TOAST
    // ======================================================================
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>🔥</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
});
