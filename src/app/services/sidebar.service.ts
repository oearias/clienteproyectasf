import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [

    {
      titulo: 'Configuración',
      role: ['ADMIN'],
      icono: '"nav-icon fas fa-cog',
      submenu: [
        {
          titulo: 'Roles',
          url: '/settings/roles',
          icon: 'fas fa-shield-alt',
          // role: ['ADMIN']
        },
        {
          titulo: 'Usuarios',
          url: '/settings/usuarios/usuario2',
          icon: 'fas fa-user',
          // role: ['ADMIN']
        },
        // {
        //   titulo: 'Roles - Usuarios',
        //   url: '/settings/roles-usuarios',
        //   icon: 'fas fa-user-shield'
        // },
      ]
    },
    {
      titulo: 'Catálogos',
      role: ['ADMIN'],
      icono: 'nav-icon fas fa-th-large',
      submenu: [
        {
          titulo: 'Agencias',
          url: '/catalogos/agencias',
          icon: 'fas fa-map-pin'
        },
        {
          titulo: 'Colonias',
          url: '/catalogos/colonias',
          icon: 'fas fa-map-marker'
        },
        // {
        //   titulo: 'Fuentes de financ.',
        //   url: '/catalogos/financiamientos',
        //   icon: 'fas fa-hand-holding-usd'
        // },
        {
          titulo: 'Montos',
          url: '/catalogos/montos',
          icon: 'fas fa-hand-holding-usd'
        },
        {
          titulo: 'Ocupaciones',
          url: '/catalogos/ocupaciones',
          icon: 'fas fa-briefcase'
        },
        {
          titulo: 'Parentescos',
          url: '/catalogos/parentescos',
          icon: 'fas fa-users',
          // role: ['ADMIN']
        },
        {
          titulo: 'Semanas',
          url: '/catalogos/semanas',
          icon: 'fas fa-calendar-week'
        },
        {
          titulo: 'Sucursales',
          url: '/catalogos/sucursales',
          icon: 'fas fa-building'
        },
        {
          titulo: 'Tarifas',
          url: '/catalogos/tarifas',
          icon: 'fas fa-calculator'
        },
        {
          titulo: 'Tipos de asentamientos',
          url: '/catalogos/asentamientos',
          icon: 'fas fa-table'
        },
        {
          titulo: 'Tipos de contratos',
          url: '/catalogos/tipoContratos',
          icon: 'fas fa-table'
        },
        {
          titulo: 'Tipos de empleo',
          url: '/catalogos/empleos',
          icon: 'fas fa-table'
        },
        {
          titulo: 'Tipos de identificación',
          url: '/catalogos/identificaciones',
          icon: 'fas fa-table'
        },
        {
          titulo: 'Zonas',
          url: '/catalogos/zonas',
          icon: 'fas fa-map'
        },
        
      ]
    },
    {
      titulo: 'Dashboard',
      role: ['ADMIN','EDITOR','CREATOR'],
      icono: 'nav-icon fas fa-tachometer-alt',
      submenu: [
        {
          titulo: 'Clientes',
          url: '/dashboard/clientes',
          icon: 'fas fa-users'
        },
        {
          titulo: 'Solicitudes',
          // role: ['ADMIN','CREATOR'],
          url: '/dashboard/solicitudes',
          icon: 'far fa-clipboard'
        },
        {
          titulo: 'Créditos',
          url: '/dashboard/creditos',
          icon: 'fas fa-file-contract'
        },
        {
          titulo: 'Inversión positiva',
          url: '/dashboard/inversiones',
          icon: 'far fa-smile-beam'
        },
        {
          titulo: 'Pagos',
          url: '/dashboard/pagos',
          icon: 'far fa-money-bill-alt'
        },
        // {
        //   titulo: 'Usuarios',
        //   url: '/dashboard/usuarios',
        //   icon: 'fas fa-users'
        // },
        // {
        //   titulo: 'Productos',
        //   url: 'productos',
        //   icon: 'fas fa-users'
        // },
        // {
        //   titulo: 'Stock',
        //   url: 'stock',
        //   icon: 'fas fa-users'
        // },
      ]

    }];
  constructor() { }
}
