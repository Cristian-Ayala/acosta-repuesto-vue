import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    component: () => import('../App.vue'),
    children: [{
        path: '',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/categorias',
        component: () => import('../views/Categorias.vue')
      },
      {
        path: '/productos',
        name: 'Productos',
        component: () => import('../views/Productos.vue')
      },
      {
        path: '/marcas',
        name: 'Marcas',
        component: () => import('../views/Marcas.vue')
      },
      {
        path: '/ordenes',
        name: 'Ordenes',
        component: () => import('../views/Ordenes.vue')
      },
      {
        path: '/actualizar',
        name: 'Actualizar',
        component: () => import('../views/Actualizar.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../Layout.vue'),
    children: [{
        path: '/',
        name: 'Login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '/cookies',
        name: 'Cookies',
        component: () => import('../views/Cookies.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router