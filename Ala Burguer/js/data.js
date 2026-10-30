// Data del Menú Oficial de ALA BURGUER
const MENU_DATA = {
    info: {
        name: "Ala Burguer",
        tagline: "Sabor a la parrilla con actitud",
        whatsapp: "529994356458",
        phoneDisplay: "999 435 6458",
        currency: "MXN",
        currencySymbol: "$",
        includesFriesBadge: "TODAS LAS HAMBURGUESAS Y DOGOS INCLUYEN PAPAS A LA FRANCESA",
        schedule: {
            daysText: "Viernes a Domingo",
            hoursText: "7:00 PM a 12:00 AM",
            cityText: "Mérida, Yucatán",
            timezone: "America/Merida",
            openDays: [5, 6, 0], // 5=Viernes, 6=Sábado, 0=Domingo
            startHour: 19, // 7:00 PM
            startMinute: 0,
            earlyAccessMinutes: 10, // Se habilita 10 minutos antes (6:50 PM) para recibir pedidos
            endHour: 24, // 12:00 AM (Medianoche)
            endMinute: 0
        }
    },
    salsas: [
        { id: "bbq", name: "BBQ" },
        { id: "bufalo", name: "Búfalo" },
        { id: "mango_habanero", name: "Mango Habanero" },
        { id: "bbq_spicy", name: "BBQ Spicy" }
    ],
    aderezos: [
        { id: "ranch", name: "Ranch" },
        { id: "ranch_blue_cheese", name: "Ranch con Blue Cheese" }
    ],
    panes: [
        { id: "ajonjoli", name: "Pan de Ajonjolí", price: 0, default: true },
        { id: "parrillero", name: "Pan Parrillero", price: 5 },
        { id: "brioche", name: "Pan Brioche", price: 5 }
    ],
    extrasList: [
        { id: "ex_carne", name: "Carne extra 150g", price: 50 },
        { id: "ex_camarones", name: "Porción de Camarones", price: 58 },
        { id: "ex_pina", name: "Piña asada", price: 35 },
        { id: "ex_q_manchego", name: "Queso Manchego", price: 30 },
        { id: "ex_q_americano", name: "Queso Americano", price: 30 },
        { id: "ex_mezcla_4q", name: "Mezcla de 4 Quesos", price: 30 },
        { id: "ex_tocino_cebolla", name: "Tocino y cebolla caramelizada", price: 30 },
        { id: "ex_tocino", name: "Tocino crujiente", price: 25 },
        { id: "ex_guacamole", name: "Guacamole de la casa", price: 25 },
        { id: "ex_chorizo_arg", name: "Chorizo Argentino", price: 30 },
        { id: "ex_chistorra", name: "Chistorra", price: 30 },
        { id: "ex_champinones", name: "Champiñones salteados", price: 25 },
        { id: "ex_salsa_bbq", name: "Extra Salsa BBQ", price: 25 },
        { id: "ex_salsa_bufalo", name: "Extra Salsa Búfalo", price: 20 },
        { id: "ex_aderezo_ranch", name: "Extra Aderezo Ranch", price: 20 },
        { id: "ex_aderezo_blue", name: "Extra Ranch con Blue Cheese", price: 30 }
    ],
    categories: [
        {
            id: "entradas",
            name: "Entradas",
            subtitle: "NUESTRAS",
            icon: "🍟",
            heroImage: "assets/images/hero_entradas.jpg",
            description: "Para abrir el apetito con el mejor sabor crujiente y quesoso.",
            items: [
                {
                    id: "orden_papas",
                    name: "ORDEN DE PAPAS",
                    price: 65,
                    description: "Papas a la francesa clásicas, doraditas y sazonadas a la perfección.",
                    badge: "Clásica",
                    optionsType: "simple"
                },
                {
                    id: "paponas",
                    name: "PAPONAS",
                    price: 85,
                    description: "Papas a la francesa con abundante mezcla de quesos gratinados y tocino crujiente.",
                    badge: "Favorito",
                    optionsType: "simple"
                },
                {
                    id: "guacamonchis",
                    name: "GUACAMONCHIS",
                    price: 120,
                    description: "Guacamole fresco con topping de chistorra dorada y crujientes chips de costra de queso.",
                    badge: "Especial",
                    optionsType: "simple"
                },
                {
                    id: "dedos_queso",
                    name: "DEDOS DE QUESO",
                    price: 120,
                    description: "Crujientes por fuera y con delicioso queso derretido por dentro. Acompañados de aderezo especial.",
                    badge: "Crujiente",
                    optionsType: "simple"
                },
                {
                    id: "boneless",
                    name: "BONELESS",
                    price: 145, // Base 250g
                    description: "Trocitos de pechuga de pollo empanizados y bañados en tu salsa favorita, acompañados de papas a la francesa y aderezo ranch.",
                    badge: "Top Ventas",
                    optionsType: "boneless",
                    variants: [
                        { name: "Orden de 250 gramos", price: 145 },
                        { name: "Orden de 500 gramos", price: 260 },
                        { name: "Orden de 1 kilo", price: 410 }
                    ],
                    requiresSauce: true,
                    requiresDressing: true
                },
                {
                    id: "alitas",
                    name: "ALITAS",
                    price: 160, // Base 10 pzas
                    description: "Alitas de pollo cubiertas en salsa de tu elección, acompañadas de papas a la francesa y aderezo ranch.",
                    badge: "Imperdible",
                    optionsType: "alitas",
                    variants: [
                        { name: "Orden de 10 piezas", price: 160 },
                        { name: "Orden de 20 piezas", price: 295 }
                    ],
                    requiresSauce: true,
                    requiresDressing: true
                }
            ]
        },
        {
            id: "hamburguesas",
            name: "Hamburguesas",
            subtitle: "NUESTRAS",
            icon: "🍔",
            heroImage: "assets/images/hero_burgers.jpg",
            description: "100% Carne de res a la parrilla. Todas incluyen porción de papas a la francesa.",
            note: "¡Todas incluyen papas a la francesa!",
            items: [
                {
                    id: "burguer_clasica",
                    name: "CLÁSICA",
                    price: 140,
                    description: "Pan de ajonjolí, 150g de jugosa carne de res, mezcla de 5 quesos, tocino, vegetales frescos y aderezos.",
                    badge: "Tradicional",
                    optionsType: "burger",
                    defaultBread: "ajonjoli"
                },
                {
                    id: "burguer_hawaiana",
                    name: "HAWAIANA",
                    price: 150,
                    description: "Pan de ajonjolí, 150g de carne de res, mezcla de 5 quesos, tocino, piña asada caramelizada, vegetales y aderezos.",
                    badge: "Agridulce",
                    optionsType: "burger",
                    defaultBread: "ajonjoli"
                },
                {
                    id: "burguer_mar_y_tierra",
                    name: "MAR Y TIERRA",
                    price: 160,
                    description: "Pan de ajonjolí, 150g de carne de res, mezcla de 5 quesos, tocino, deliciosos camarones salteados, vegetales y aderezos.",
                    badge: "Gourmet",
                    optionsType: "burger",
                    defaultBread: "ajonjoli"
                },
                {
                    id: "burguer_argentina",
                    name: "ARGENTINA",
                    price: 170,
                    description: "Pan parrillero rústico, 150g de carne de res, mezcla de 5 quesos, tocino, chorizo argentino, chimichurri artesanal y vegetales.",
                    badge: "Parrillera",
                    optionsType: "burger",
                    defaultBread: "parrillero"
                },
                {
                    id: "burguer_doble_carne",
                    name: "DOBLE CARNE",
                    price: 185,
                    description: "Pan brioche suave, aderezo de la casa, DOBLE porción de carne (150g c/u = 300g de carne), mezcla de 6 quesos, tocino y cebolla caramelizada.",
                    badge: "Monstruosa 🔥",
                    optionsType: "burger",
                    defaultBread: "brioche"
                },
                {
                    id: "burguer_mexicana",
                    name: "MEXICANA",
                    price: 190,
                    description: "Pan de ajonjolí, 150g de carne de res, mezcla de 5 quesos, chorizo verde artesanal, salchicha asadera, guacamole fresco, vegetales y aderezos.",
                    badge: "Con Todo",
                    optionsType: "burger",
                    defaultBread: "ajonjoli"
                },
                {
                    id: "burguer_champi",
                    name: "CHAMPI",
                    price: 155,
                    description: "Pan de ajonjolí, 150g de carne de res, mezcla de 5 quesos, abundantes champiñones salteados a la mantequilla, vegetales y aderezos.",
                    badge: "Especial",
                    optionsType: "burger",
                    defaultBread: "ajonjoli"
                },
                {
                    id: "burguer_guacachis",
                    name: "GUACACHIS",
                    price: 165,
                    description: "Pan parrillero, 150g de carne de res, mezcla de 5 quesos, guacamole de la casa, chistorra crujiente, vegetales y aderezos.",
                    badge: "Auténtica",
                    optionsType: "burger",
                    defaultBread: "parrillero"
                },
                {
                    id: "burguer_crunchy",
                    name: "CRUNCHY",
                    price: 160,
                    description: "Pan brioche, 150g de pechuga crunchy super crujiente (bañada en salsa a tu elección), mezcla de 5 quesos, lechuga, cebolla, pepinillos y aderezo de la casa.",
                    badge: "Pollo Crujiente",
                    optionsType: "burger_crunchy",
                    defaultBread: "brioche",
                    requiresSauce: true
                }
            ]
        },
        {
            id: "dogos",
            name: "Dogos",
            subtitle: "NUESTROS",
            icon: "🌭",
            heroImage: "assets/images/hero_dogos.jpg",
            description: "Jumbos, sabrosos y bien cargados de queso y aderezos. Incluyen papas a la francesa.",
            note: "¡Todos incluyen papas a la francesa!",
            items: [
                {
                    id: "dogo_jumbo",
                    name: "DOGO JUMBO",
                    price: 110,
                    description: "Pan de ajonjolí, gran salchicha de res, aderezo de 5 quesos fundidos, tocino crujiente, cebolla caramelizada y aderezos de la casa.",
                    badge: "El Rey",
                    optionsType: "dogo"
                },
                {
                    id: "dogo_burguer_jumbo",
                    name: "DOGO BURGUER JUMBO",
                    price: 95,
                    description: "Pan de ajonjolí, salchicha de res, aderezo de 5 quesos, tocino crocante, cebolla caramelizada y salsa especial estilo burger.",
                    badge: "Favorito",
                    optionsType: "dogo"
                },
                {
                    id: "dogo_argentino",
                    name: "DOGO ARGENTINO",
                    price: 110,
                    description: "Salchicha de res a la parrilla, chorizo argentino, queso fundido, chimichurri casero, tocino y aderezos.",
                    badge: "Parrillero",
                    optionsType: "dogo"
                },
                {
                    id: "dogo_guacamole",
                    name: "DOGO GUACAMOLE",
                    price: 115,
                    description: "Salchicha de res, abundante queso gratinado, guacamole fresco con pico de gallo, tocino y aderezos.",
                    badge: "Fresco & Cremoso",
                    optionsType: "dogo"
                },
                {
                    id: "dogo_hawaiano",
                    name: "DOGO HAWAIANO",
                    price: 105,
                    description: "Salchicha de res, queso fundido, piña asada caramelizada al grill, tocino crujiente y aderezos.",
                    badge: "Agridulce",
                    optionsType: "dogo"
                }
            ]
        },
        {
            id: "bebidas",
            name: "Bebidas",
            subtitle: "REFRESCANTES",
            icon: "🥤",
            heroImage: "assets/images/hero_bebidas.jpg",
            description: "Bien frías para acompañar tus hamburguesas, dogos y alitas.",
            items: [
                {
                    id: "refresco_600",
                    name: "Refresco Embotellado 600ml",
                    price: 40,
                    description: "Refresco personal bien helado (Coca-Cola, Sprite, Fanta según disponibilidad).",
                    badge: "600ml",
                    optionsType: "beverage"
                },
                {
                    id: "refresco_135",
                    name: "Refresco Embotellado 1.35L",
                    price: 55,
                    description: "Tamaño ideal para compartir en pareja o amigos.",
                    badge: "1.35 Litros",
                    optionsType: "beverage"
                },
                {
                    id: "coca_25",
                    name: "Coca-Cola 2.5L",
                    price: 75,
                    description: "Coca-Cola familiar bien fría para toda la mesa.",
                    badge: "2.5 Litros",
                    optionsType: "beverage"
                },
                {
                    id: "coca_3",
                    name: "Coca-Cola 3L",
                    price: 85,
                    description: "El formato más grande para no quedarte con ganas.",
                    badge: "3 Litros",
                    optionsType: "beverage"
                },
                {
                    id: "agua_1l",
                    name: "Agua Embotellada 1L",
                    price: 35,
                    description: "Agua purificada 1 litro fresca y natural.",
                    badge: "1 Litro",
                    optionsType: "beverage"
                }
            ]
        },
        {
            id: "extras",
            name: "Extras y Adicionales",
            subtitle: "PERSONALIZA",
            icon: "🔥",
            description: "¡Agrega más sabor a cualquiera de tus platillos!",
            items: [
                { id: "ext_carne_150", name: "Carne Extra 150g", price: 50, description: "Porción de 150g de carne de res a la parrilla", badge: "+Proteína" },
                { id: "ext_camarones_item", name: "Camarones Salteados", price: 58, description: "Deliciosa porción de camarones al ajillo o mantequilla", badge: "Mar y Tierra" },
                { id: "ext_pina_item", name: "Piña Asada", price: 35, description: "Rodaja de piña dulce a la parrilla", badge: "Extra" },
                { id: "ext_q_manchego_item", name: "Queso Manchego", price: 30, description: "Porción extra de queso manchego derretido", badge: "Queso" },
                { id: "ext_q_americano_item", name: "Queso Americano", price: 30, description: "Porción extra de queso americano fundido", badge: "Queso" },
                { id: "ext_mezcla_4q_item", name: "Mezcla de 4 Quesos", price: 30, description: "Fundición cremosa de 4 quesos selectos", badge: "Top Queso" },
                { id: "ext_salsa_bbq_item", name: "Salsa BBQ (Copa)", price: 25, description: "Salsa BBQ ahumada de la casa", badge: "Salsa" },
                { id: "ext_salsa_bufalo_item", name: "Salsa Búfalo (Copa)", price: 20, description: "Salsa búfalo picante tradicional", badge: "Picante" },
                { id: "ext_aderezo_ranch_item", name: "Aderezo Ranch (Copa)", price: 20, description: "Aderezo ranch cremoso con hierbas finas", badge: "Dip" },
                { id: "ext_aderezo_blue_item", name: "Ranch con Blue Cheese", price: 30, description: "Intenso aderezo de queso azul con toque ranch", badge: "Gourmet Dip" }
            ]
        }
    ]
};
