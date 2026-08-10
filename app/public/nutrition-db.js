// NUTRITION DB - 51 alimentos base + bebidas adicionales
// Integración para Tracker v6.0 + Tirzepatida

const NUTRITION_DB = {
  meta: {
    titulo: "Base de datos nutricional - Tirzepatida + entrenamiento",
    enfoque: "alta_proteina",
    fecha: "2026-08-09",
    calorias_target: 2000,
    proteina_target: 200
  },

  categories: [
    "Huevos", "Lacteos", "Proteinas", "Grasas/Frutos secos",
    "Carbohidratos", "Panes/Wraps", "Vegetales", "Bebidas"
  ],

  foods: [
    // HUEVOS (9)
    { id: "food_huevo_cocido_duro", cat: "Huevos", name: "Huevo cocido (duro)", portion: "1 unidad (50g)", kcal: 78, protein: 6.3, fat: 5.3, carbs: 0.6, fiber: 0, note: "Base ideal: saciante, portátil, 0 carbo" },
    { id: "food_huevos_revueltos_sin_aceite", cat: "Huevos", name: "Huevos revueltos (sin aceite)", portion: "2 unidades", kcal: 156, protein: 12.6, fat: 10.6, carbs: 1.2, fiber: 0, note: "Sartén antiadherente" },
    { id: "food_huevos_revueltos_con_1_cda_aceite", cat: "Huevos", name: "Huevos revueltos + 1 cda aceite", portion: "2 unidades + 1 cda", kcal: 276, protein: 12.6, fat: 24.6, carbs: 1.2, fiber: 0, note: "El aceite casi duplica calorías" },
    { id: "food_huevos_revueltos_con_queso", cat: "Huevos", name: "Huevos revueltos + queso", portion: "2 huevos + 30g queso", kcal: 276, protein: 19.6, fat: 21.0, carbs: 1.5, fiber: 0, note: "Buena para día de gym" },
    { id: "food_huevo_frito", cat: "Huevos", name: "Huevo frito", portion: "1 unidad", kcal: 90, protein: 6.3, fat: 7.0, carbs: 0.4, fiber: 0, note: "Escurrir en papel" },
    { id: "food_tortilla_omelette_simple", cat: "Huevos", name: "Tortilla / omelette simple", portion: "2 huevos", kcal: 158, protein: 12.6, fat: 11.0, carbs: 1.0, fiber: 0, note: "Rellenar con vegetales" },
    { id: "food_tortilla_con_jamon_y_queso", cat: "Huevos", name: "Tortilla + jamón + queso", portion: "2 huevos + jamón + queso", kcal: 320, protein: 26.0, fat: 22.0, carbs: 2.0, fiber: 0, note: "Comida completa alta proteína" },
    { id: "food_claras_de_huevo", cat: "Huevos", name: "Claras de huevo", portion: "3 claras (~100g)", kcal: 52, protein: 11.0, fat: 0.2, carbs: 0.7, fiber: 0, note: "Max proteína, min grasa" },
    { id: "food_huevo_pochado", cat: "Huevos", name: "Huevo pochado", portion: "1 unidad", kcal: 72, protein: 6.3, fat: 5.0, carbs: 0.4, fiber: 0, note: "Sin grasa agregada" },

    // LACTEOS (9)
    { id: "food_yogur_griego_natural_sin_azucar", cat: "Lacteos", name: "Yogur griego natural sin azúcar", portion: "170g (1 vaso)", kcal: 100, protein: 17.0, fat: 0.7, carbs: 6.0, fiber: 0, note: "Pilar de la dieta: alto proteína" },
    { id: "food_yogur_griego_con_mermelada", cat: "Lacteos", name: "Yogur griego + mermelada", portion: "170g + 1 cda mermelada", kcal: 150, protein: 17.0, fat: 0.7, carbs: 18.0, fiber: 0.3, note: "Usar mermelada sin azúcar" },
    { id: "food_yogur_griego_con_frutos_rojos", cat: "Lacteos", name: "Yogur griego + frutos rojos", portion: "170g + 80g frutos", kcal: 140, protein: 18.0, fat: 1.0, carbs: 15.0, fiber: 3.0, note: "Mejor opción dulce" },
    { id: "food_queso_crema", cat: "Lacteos", name: "Queso crema", portion: "2 cda (30g)", kcal: 100, protein: 2.0, fat: 10.0, carbs: 1.5, fiber: 0, note: "Alto en grasa, controlar" },
    { id: "food_queso_crema_light", cat: "Lacteos", name: "Queso crema light", portion: "2 cda (30g)", kcal: 60, protein: 3.0, fat: 4.5, carbs: 2.0, fiber: 0, note: "Menos grasa" },
    { id: "food_queso_blanco_fresco", cat: "Lacteos", name: "Queso blanco / fresco", portion: "40g", kcal: 100, protein: 7.0, fat: 7.5, carbs: 1.0, fiber: 0, note: "Vigilar sodio" },
    { id: "food_requeson_cottage", cat: "Lacteos", name: "Requeson / cottage", portion: "1/2 taza (110g)", kcal: 90, protein: 12.0, fat: 2.5, carbs: 4.0, fiber: 0, note: "Proteína lenta (caseína)" },
    { id: "food_leche_deslactosada", cat: "Lacteos", name: "Leche deslactosada", portion: "1 taza (240ml)", kcal: 120, protein: 8.0, fat: 5.0, carbs: 12.0, fiber: 0, note: "Proteína + calcio" },
    { id: "food_leche_deslactosada_descremada", cat: "Lacteos", name: "Leche deslactosada descremada", portion: "1 taza (240ml)", kcal: 80, protein: 8.0, fat: 0.5, carbs: 12.0, fiber: 0, note: "Misma proteína sin grasa" },

    // PROTEINAS (11)
    { id: "food_pechuga_de_pollo_a_la_plancha", cat: "Proteinas", name: "Pechuga de pollo a la plancha", portion: "150g cocido", kcal: 248, protein: 46.5, fat: 5.4, carbs: 0, fiber: 0, note: "~46g proteína por porción" },
    { id: "food_muslo_cadera_de_pollo_al_horno_sin_piel", cat: "Proteinas", name: "Muslo/cadera pollo (sin piel)", portion: "150g cocido", kcal: 275, protein: 39.0, fat: 12.0, carbs: 0, fiber: 0, note: "Más jugoso que pechuga" },
    { id: "food_muslo_cadera_de_pollo_al_horno_con_piel", cat: "Proteinas", name: "Muslo/cadera pollo (con piel)", portion: "150g cocido", kcal: 340, protein: 37.0, fat: 20.0, carbs: 0, fiber: 0, note: "Con piel sube grasa" },
    { id: "food_salteado_de_res_con_vegetales", cat: "Proteinas", name: "Salteado de res + vegetales", portion: "200g (res 120g + veg)", kcal: 320, protein: 34.0, fat: 15.0, carbs: 12.0, fiber: 4.0, note: "Comida completa" },
    { id: "food_res_magra_lomo_a_la_plancha", cat: "Proteinas", name: "Res magra (lomo) a la plancha", portion: "150g cocido", kcal: 260, protein: 40.0, fat: 10.0, carbs: 0, fiber: 0, note: "Cortes magros" },
    { id: "food_atun_en_agua_lata", cat: "Proteinas", name: "Atún en agua (lata)", portion: "1 lata (120g escurrido)", kcal: 130, protein: 29.0, fat: 1.0, carbs: 0, fiber: 0, note: "Proteína rápida y económica" },
    { id: "food_salmon_al_horno", cat: "Proteinas", name: "Salmón al horno", portion: "150g", kcal: 280, protein: 34.0, fat: 16.0, carbs: 0, fiber: 0, note: "Omega-3, grasa saludable" },
    { id: "food_lomo_de_cerdo_magro", cat: "Proteinas", name: "Lomo de cerdo magro", portion: "150g cocido", kcal: 250, protein: 39.0, fat: 10.0, carbs: 0, fiber: 0, note: "Alternativa magra" },
    { id: "food_proteina_en_polvo_whey", cat: "Proteinas", name: "Proteína en polvo (whey)", portion: "1 scoop (30g)", kcal: 120, protein: 24.0, fat: 1.5, carbs: 3.0, fiber: 0, note: "Post-entreno o meta proteica" },

    // GRASAS/FRUTOS SECOS (9)
    { id: "food_aguacate", cat: "Grasas/Frutos secos", name: "Aguacate", portion: "1/2 unidad (75g)", kcal: 120, protein: 1.5, fat: 11.0, carbs: 6.0, fiber: 5.0, note: "Grasa buena + fibra" },
    { id: "food_almendras", cat: "Grasas/Frutos secos", name: "Almendras", portion: "puñado (28g/~23u)", kcal: 164, protein: 6.0, fat: 14.0, carbs: 6.0, fiber: 3.5, note: "Proteína + fibra" },
    { id: "food_nueces", cat: "Grasas/Frutos secos", name: "Nueces", portion: "puñado (28g)", kcal: 185, protein: 4.3, fat: 18.5, carbs: 3.9, fiber: 1.9, note: "Omega-3" },
    { id: "food_pistachos", cat: "Grasas/Frutos secos", name: "Pistachos", portion: "puñado (28g)", kcal: 159, protein: 6.0, fat: 13.0, carbs: 8.0, fiber: 3.0, note: "Buena proteína" },
    { id: "food_maranon_anacardo", cat: "Grasas/Frutos secos", name: "Marañón / anacardo", portion: "puñado (28g)", kcal: 157, protein: 5.0, fat: 12.0, carbs: 9.0, fiber: 1.0, note: "Más carbos" },
    { id: "food_mani_cacahuate", cat: "Grasas/Frutos secos", name: "Maní / cacahuate", portion: "puñado (28g)", kcal: 161, protein: 7.0, fat: 14.0, carbs: 4.5, fiber: 2.4, note: "Mejor proteína/precio" },
    { id: "food_avellanas", cat: "Grasas/Frutos secos", name: "Avellanas", portion: "puñado (28g)", kcal: 178, protein: 4.2, fat: 17.0, carbs: 4.7, fiber: 2.7, note: "Grasa buena" },
    { id: "food_mantequilla_de_mani_natural", cat: "Grasas/Frutos secos", name: "Mantequilla de maní natural", portion: "1 cda (16g)", kcal: 95, protein: 4.0, fat: 8.0, carbs: 3.0, fiber: 1.0, note: "Sin azúcar" },

    // CARBOHIDRATOS (10)
    { id: "food_avena_hidratada_overnight", cat: "Carbohidratos", name: "Avena hidratada overnight", portion: "40g avena + líquido", kcal: 150, protein: 5.0, fat: 3.0, carbs: 27.0, fiber: 4.0, note: "Saciante, base con leche" },
    { id: "food_avena_overnight_con_yogur_griego", cat: "Carbohidratos", name: "Avena overnight + yogur griego", portion: "40g avena + 100g yogur", kcal: 210, protein: 15.0, fat: 3.5, carbs: 30.0, fiber: 4.5, note: "Alta proteína" },
    { id: "food_chia_hidratada_con_avena_y_cacao", cat: "Carbohidratos", name: "Chia + avena + cacao", portion: "1 cda chia + 30g avena + cacao", kcal: 200, protein: 7.0, fat: 8.0, carbs: 24.0, fiber: 9.0, note: "Alta fibra" },
    { id: "food_semillas_de_chia_solas", cat: "Carbohidratos", name: "Semillas de chia", portion: "1 cda (12g)", kcal: 58, protein: 2.0, fat: 3.7, carbs: 5.0, fiber: 4.1, note: "Hidratar bien con tirzepatida" },
    { id: "food_tapioca_con_queso_y_aceitunas", cat: "Carbohidratos", name: "Tapioca + queso + aceitunas", portion: "1 porción (~120g)", kcal: 260, protein: 8.0, fat: 12.0, carbs: 30.0, fiber: 1.0, note: "Alto almidón" },
    { id: "food_datiles", cat: "Carbohidratos", name: "Dátiles", portion: "2 unidades (~24g)", kcal: 66, protein: 0.4, fat: 0.1, carbs: 18.0, fiber: 1.6, note: "Dulce natural pre-entreno" },
    { id: "food_arroz_integral_cocido", cat: "Carbohidratos", name: "Arroz integral cocido", portion: "1/2 taza (100g)", kcal: 110, protein: 2.6, fat: 0.9, carbs: 23.0, fiber: 1.8, note: "Guarnición" },
    { id: "food_batata_camote_al_horno", cat: "Carbohidratos", name: "Batata / camote al horno", portion: "150g", kcal: 130, protein: 2.4, fat: 0.2, carbs: 30.0, fiber: 4.5, note: "Bajo índice" },

    // PANES/WRAPS (4)
    { id: "food_rapidita_tortilla_harina_sola", cat: "Panes/Wraps", name: "Rapidita (tortilla harina)", portion: "1 unidad mediana", kcal: 140, protein: 4.0, fat: 4.0, carbs: 22.0, fiber: 1.0, note: "Base carbo" },
    { id: "food_rapidita_con_jamon_y_queso", cat: "Panes/Wraps", name: "Rapidita + jamón + queso", portion: "1 unidad + jamón + queso", kcal: 280, protein: 16.0, fat: 12.0, carbs: 24.0, fiber: 1.0, note: "Comida rápida" },
    { id: "food_rapidita_integral_con_pollo", cat: "Panes/Wraps", name: "Rapidita integral + pollo", portion: "1 integral + 80g pollo", kcal: 300, protein: 28.0, fat: 8.0, carbs: 26.0, fiber: 3.0, note: "Alta proteína" },
    { id: "food_pan_integral", cat: "Panes/Wraps", name: "Pan integral", portion: "1 rebanada (30g)", kcal: 80, protein: 3.5, fat: 1.0, carbs: 14.0, fiber: 2.0, note: "Preferir integral" },

    // VEGETALES (5)
    { id: "food_brocoli_al_vapor", cat: "Vegetales", name: "Brócoli al vapor", portion: "1 taza (90g)", kcal: 31, protein: 2.5, fat: 0.3, carbs: 6.0, fiber: 2.4, note: "Volumen + fibra" },
    { id: "food_ensalada_verde_mixta", cat: "Vegetales", name: "Ensalada verde mixta", portion: "2 tazas", kcal: 30, protein: 2.0, fat: 0.3, carbs: 6.0, fiber: 2.5, note: "Llenar plato" },
    { id: "food_vegetales_salteados_mix", cat: "Vegetales", name: "Vegetales salteados (mix)", portion: "1 taza", kcal: 60, protein: 2.5, fat: 2.0, carbs: 9.0, fiber: 3.0, note: "Acompañante" },
    { id: "food_aceitunas", cat: "Vegetales", name: "Aceitunas", portion: "5 unidades (20g)", kcal: 35, protein: 0.2, fat: 3.3, carbs: 1.0, fiber: 0.9, note: "Grasa buena, alto sodio" },

    // BEBIDAS (8 adicionales)
    { id: "drink_agua_pura", cat: "Bebidas", name: "Agua pura", portion: "250ml", kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, note: "Base hidratación" },
    { id: "drink_coca_cola_zero", cat: "Bebidas", name: "Coca Cola Zero", portion: "250ml (1 lata)", kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, note: "Sin calorías, endulzante artificial" },
    { id: "drink_bebida_energetica", cat: "Bebidas", name: "Bebida energética (típica)", portion: "250ml", kcal: 110, protein: 0, fat: 0, carbs: 27.0, fiber: 0, note: "Cafeína + azúcar" },
    { id: "drink_cafe_espresso", cat: "Bebidas", name: "Café espresso", portion: "30ml (1 taza pequeña)", kcal: 2, protein: 0.2, fat: 0, carbs: 0, fiber: 0, note: "Puro, sin leche" },
    { id: "drink_cold_brew_puro", cat: "Bebidas", name: "Cold brew puro", portion: "200ml", kcal: 2, protein: 0.2, fat: 0, carbs: 0, fiber: 0, note: "Cafeína sin azúcar" },
    { id: "drink_cafe_con_leche_descremada", cat: "Bebidas", name: "Café + leche descremada", portion: "200ml café + 50ml leche", kcal: 35, protein: 3.5, fat: 0.5, carbs: 5.0, fiber: 0, note: "Hidratación + proteína ligera" },
    { id: "drink_te_verde_puro", cat: "Bebidas", name: "Té verde puro", portion: "200ml", kcal: 2, protein: 0, fat: 0, carbs: 0, fiber: 0, note: "Antioxidantes" },
    { id: "drink_te_negro_con_miel", cat: "Bebidas", name: "Té negro + miel", portion: "200ml + 1 cda miel", kcal: 65, protein: 0, fat: 0, carbs: 18.0, fiber: 0, note: "Pre-entreno rápido" },
  ]
};

// Función para obtener alimento por ID
function getNutritionFood(foodId) {
  return NUTRITION_DB.foods.find(f => f.id === foodId);
}

// Función para calcular macros de una comida
function calculateMealMacros(foodIds) {
  return foodIds.reduce((acc, foodId) => {
    const food = getNutritionFood(foodId);
    if (!food) return acc;
    return {
      kcal: acc.kcal + food.kcal,
      protein: acc.protein + food.protein,
      fat: acc.fat + food.fat,
      carbs: acc.carbs + food.carbs,
      fiber: acc.fiber + food.fiber
    };
  }, { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 });
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.NUTRITION_DB = NUTRITION_DB;
  window.getNutritionFood = getNutritionFood;
  window.calculateMealMacros = calculateMealMacros;
}
