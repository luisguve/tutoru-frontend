import indiceCategorias from "./categorias"

export const titulo = "Tutor Universitario"

export const categoriaFDT = {
  nombre: "Fenómenos de transporte",
  slug: "fenomenos-de-transporte",
  submenu: [
    {
      nombre: "Viscosidad y mecanismo del transporte",
      slug: "viscosidad-y-mecanismo-del-transporte"
    },
    {
      nombre: "Distrib. veloc. en flujo laminar",
      slug: "distrib-veloc-en-flujo-laminar",
      ariaLabel: "distribucion de velocidad en flujo laminar",
      submenu: [
        {
          nombre: "Sistemas rectangulares",
          slug: "sistemas-rectangulares"
        },
        {
          nombre: "Sistemas radiales",
          slug: "sistemas-radiales"
        }
      ]
    },
    {
      nombre: "Ec. de variación para sist. isotérmicos",
      slug: "ec-de-variacion-para-sist-isotermicos",
      ariaLabel: "Ecuaciones de variacion para sistemas isotermicos"
    },
    {
      nombre: "Balances macroscópicos en sistemas isotérmicos",
      slug: "balances-macroscopicos-en-sistemas-isotermicos",
      submenu: [
        {
          nombre: "Sistemas tipo III",
          slug: "sistemas-tipo-iii"
        },
        {
          nombre: "Bombas",
          slug: "bombas"
        }
      ]
    },
    {
      nombre: "A demanda",
      slug: "a-demanda",
    }
  ]
}

export const categoriaMV = {
  nombre: "Mecánica vectorial",
  slug: "mecanica-vectorial",
  submenu: [
    {
      nombre: "Estática de partículas",
      slug: "estatica-de-particulas",
      submenu: [
        {
          nombre: "Fuerzas en el plano",
          slug: "fuerzas-en-el-plano"
        },
        {
          nombre: "Fuerzas en el espacio",
          slug: "fuerzas-en-el-espacio"
        }
      ]
    },
    {
      nombre: "Cuerpos rígidos - sistemas equivalentes de fuerzas",
      slug: "cuerpos-rigidos-sistemas-equivalentes-de-fuerzas",
      submenu: [
        {
          nombre: "Momento de una fuerza con respecto a un punto en el plano",
          slug: "momento-de-una-fuerza-con-respecto-a-un-punto-en-el-plano"
        },
        {
          nombre: "Momento de una fuerza con respecto a un punto en el espacio",
          slug: "momento-de-una-fuerza-con-respecto-a-un-punto-en-el-espacio"
        },
        {
          nombre: "Momento de una fuerza con respecto a un eje dado",
          slug: "momento-de-una-fuerza-con-respecto-a-un-eje-dado"
        },
        {
          nombre: "Momento de un par. Pares equivalentes",
          slug: "momento-de-un-par-pares-equivalentes"
        }
      ]
    },
    {
      nombre: "Equilibrio de cuerpos rígidos",
      slug: "equilibrio-de-cuerpos-rigidos",
      submenu: [
        {
          nombre: "Equilibrio en dos dimensiones",
          slug: "equilibrio-en-dos-dimensiones"
        },
        {
          nombre: "Equilibrio en tres dimensiones",
          slug: "equilibrio-en-tres-dimensiones"
        }
      ]
    },
    {
      nombre: "Centroides",
      slug: "centroides",
      submenu: [
        {
          nombre: "Placas compuestas",
          slug: "placas-compuestas"
        },
        {
          nombre: "Por integración",
          slug: "por-integracion"
        }
      ]
    }
  ]
}

export const categoriaTermo = {
  nombre: "Termodinámica",
  slug: "termodinamica",
  submenu: [
    {
      nombre: "Medición de presión y manómetros",
      slug: "medicion-de-presion-y-manometros"
    },
    {
      nombre: "Manejo de tablas de propiedades",
      slug: "manejo-de-tablas-de-propiedades"
    },
    {
      nombre: "Propiedades de una sustancia pura",
      slug: "propiedades-de-una-sustancia-pura"
    },
    {
      nombre: "Descargar Tablas de propiedades",
      slug: "descargar-tablas-de-propiedades"
    }
  ]
}

export const categoriaFE = {
  nombre: "Física eléctrica",
  slug: "fisica-electrica",
  submenu: [
    {
      nombre: "Carga y materia",
      slug: "carga-y-materia"
    }
  ]
}

export const categoriaED = {
  nombre: "Ecuaciones diferenciales",
  slug: "ecuaciones-diferenciales",
  submenu: [
    {
      nombre: "Serie de potencias",
      slug: "serie-de-potencias",
      submenu: [
        {
          nombre: "Puntos ordinarios",
          slug: "pntos-ordinarios"
        }
      ]
    }
  ]
}

export const categoriaCI = {
  nombre: "Cálculo integral",
  slug: "calculo-integral",
  submenu: [
    {
      nombre: "Métodos de integración",
      slug: "metodos-de-integracion",
      submenu: [
        {
          nombre: "Sustitución trigonométrica",
          slug: "sustitucion-trigonometrica"
        }
      ]
    }
  ]
}
/*
export const categorias = [
  categoriaFDT,
  categoriaMV,
  categoriaTermo,
  categoriaFE,
  categoriaED,
  categoriaCI
]
*/

export const cargarNavItems = async () => {
  const submenu = await indiceCategorias.all()
  return [
    {
      Titulo_normal: "Ejercicios resueltos",
      Titulo_url: "#",
      hijos: submenu
    }
  ]
}

export const navItems = [
  {
    nombre: "Ejercicios resueltos",
    slug: "#",
    submenu: indiceCategorias
  }/*,
  {
    nombre: "",
    slug: ""
  },
  {
    nombre: "",
    slug: ""
  },
  {
    nombre: "",
    slug: ""
  },
  {
    nombre: "",
    slug: ""
  },
  {
    nombre: "",
    slug: ""
  },
  {
    nombre: "",
    slug: ""
  }*/
]