import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { StockComponent } from './stock/stock.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudesListaComponent } from './solicitudes/solicitudes-lista/solicitudes-lista.component';
import { SolicitudComponent } from './solicitudes/solicitud/solicitud.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClientesListComponent } from './clientes/clientes-list/clientes-list.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { ColoniasComponent } from './colonias/colonias.component';
import { ColoniasListComponent } from './colonias/colonias-list/colonias-list.component';
import { ColoniaComponent } from './colonias/colonia/colonia.component';
import { AsentamientosComponent } from './asentamientos/asentamientos.component';
import { AsentamientosListComponent } from './asentamientos/asentamientos-list/asentamientos-list.component';
import { AsentamientoComponent } from './asentamientos/asentamiento/asentamiento.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { SucursalesListComponent } from './sucursales/sucursales-list/sucursales-list.component';
import { SucursalComponent } from './sucursales/sucursal/sucursal.component';
import { ZonasComponent } from './zonas/zonas.component';
import { ZonasListComponent } from './zonas/zonas-list/zonas-list.component';
import { ZonaComponent } from './zonas/zona/zona.component';
import { OcupacionesComponent } from './ocupaciones/ocupaciones.component';
import { OcupacionesListComponent } from './ocupaciones/ocupaciones-list/ocupaciones-list.component';
import { OcupacionComponent } from './ocupaciones/ocupacion/ocupacion.component';
import { AgenciasComponent } from './agencias/agencias.component';
import { AgenciasListComponent } from './agencias/agencias-list/agencias-list.component';
import { AgenciaComponent } from './agencias/agencia/agencia.component';
import { EmpleosComponent } from './empleos/empleos.component';
import { EmpleosListComponent } from './empleos/empleos-list/empleos-list.component';
import { EmpleoComponent } from './empleos/empleo/empleo.component';
import { IdentificacionesComponent } from './identificaciones/identificaciones.component';
import { IdentificacionesListComponent } from './identificaciones/identificaciones-list/identificaciones-list.component';
import { IdentificacionComponent } from './identificaciones/identificacion/identificacion.component';
import { ParentescoComponent } from './parentescos/parentesco/parentesco.component';
import { ParentescosListComponent } from './parentescos/parentescos-list/parentescos-list.component';
import { ParentescosComponent } from './parentescos/parentescos.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { TarifasListComponent } from './tarifas/tarifas-list/tarifas-list.component';
import { TarifaComponent } from './tarifas/tarifa/tarifa.component';
import { SolicitudViewComponent } from './solicitudes/solicitud-view/solicitud-view.component';
import { CreditosComponent } from './creditos/creditos.component';
import { CreditosListComponent } from './creditos/creditos-list/creditos-list.component';
import { CreditoComponent } from './creditos/credito/credito.component';
import { FinanciamientosListComponent } from './financiamientos/financiamientos-list/financiamientos-list.component';
import { FinanciamientosComponent } from './financiamientos/financiamientos.component';
import { FinanciamientoComponent } from './financiamientos/financiamiento/financiamiento.component';
import { TipoContratosComponent } from './tipo-contratos/tipo-contratos.component';
import { TipoContratosListComponent } from './tipo-contratos/tipo-contratos-list/tipo-contratos-list.component';
import { TipoContratoComponent } from './tipo-contratos/tipo-contrato/tipo-contrato.component';
import { PagosComponent } from './pagos/pagos.component';
import { PagosListComponent } from './pagos/pagos-list/pagos-list.component';
import { PagoComponent } from './pagos/pago/pago.component';
import { CreditoViewComponent } from './creditos/credito-view/credito-view.component';
import { PagoViewComponent } from './pagos/pago-view/pago-view.component';
import { UsuariosListComponent } from './usuarios/usuarios-list/usuarios-list.component';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { ChangePasswordComponent } from './usuarios/change-password/change-password.component';
import { RolesComponent } from './roles/roles.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RoleComponent } from './roles/role/role.component';
import { RolesUsuariosComponent } from './roles-usuarios/roles-usuarios.component';
import { RolesUsuariosListComponent } from './roles-usuarios/roles-usuarios-list/roles-usuarios-list.component';
import { RoleUsuarioComponent } from './roles-usuarios/role-usuario/role-usuario.component';
import { Usuario2Component } from './usuarios/usuario2/usuario2.component';
import { MontosComponent } from './montos/montos.component';
import { MontosListComponent } from './montos/montos-list/montos-list.component';
import { MontoComponent } from './montos/monto/monto.component';
import { SolicitudesPresupuestoComponent } from './solicitudes/solicitudes-presupuesto/solicitudes-presupuesto.component';
import { SolicitudEditComponent } from './solicitudes/solicitud-edit/solicitud-edit.component';
import { CreditosMasivosComponent } from './creditos/creditos-masivos/creditos-masivos.component';
import { SemanasComponent } from './semanas/semanas.component';
import { SemanaListComponent } from './semanas/semana-list/semana-list.component';
import { SemanaComponent } from './semanas/semana/semana.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SemanaMasivaComponent } from './semanas/semana-masiva/semana-masiva.component';
import { YearComponent } from './semanas/year/year.component';
import { InversionesComponent } from './inversiones/inversiones.component';
import { InversionListComponent } from './inversiones/inversion-list/inversion-list.component';
import { InversionComponent } from './inversiones/inversion/inversion.component';
import { ViewContractsComponent } from './clientes/view-contracts/view-contracts.component';
import { CreditosCheckEntregadosComponent } from './creditos/creditos-check-entregados/creditos-check-entregados.component';

const routes: Routes = [
  {
    path: 'settings', component: PagesComponent,
    children: [
      {
        path: 'roles', component: RolesComponent,
        data: { titulo: 'Roles' },
        children: [
          { path: '', component: RolesListComponent },
          { path: 'role/:id', component: RoleComponent, data: { titulo: 'Roles' } },
          { path: 'role', component: RoleComponent, data: { titulo: 'Roles' } },
        ]
      },
      {
        path: 'usuarios', component: UsuariosComponent,
        data: { titulo: 'Usuarios' },
        children: [
          {
            path: '', component: UsuariosListComponent, children: [
              { path: 'usuario2', component: Usuario2Component, data: { titulo: 'Usuarios' } },
              { path: 'usuario2/:id', component: Usuario2Component, data: { titulo: 'Usuarios' } },
              { path: 'changePassword/:id', component: ChangePasswordComponent, data: { titulo: 'Usuarios' } },
            ]
          },
          { path: 'usuario/:id', component: UsuarioComponent, data: { titulo: 'Usuarios' } },
          { path: 'usuario', component: UsuarioComponent, data: { titulo: 'Usuarios' } },
          { path: 'changePassword/:id', component: ChangePasswordComponent, data: { titulo: 'Reestablecer contraseña' } }
        ]
      },
      {
        path: 'roles-usuarios', component: RolesUsuariosComponent,
        data: { titulo: 'Asignación de Roles a Usuarios' },
        children: [
          { path: '', component: RolesUsuariosListComponent },
          { path: 'assign', component: RoleUsuarioComponent, data: { titulo: 'Roles del Usuario' } },
        ]
      },
    ]
  },
  {
    path: 'catalogos', component: PagesComponent,
    children: [
      {
        path: 'colonias', component: ColoniasComponent,
        data: { titulo: 'Colonias' },
        children: [
          { path: '', component: ColoniasListComponent },
          { path: 'colonia/:id', component: ColoniaComponent, data: { titulo: 'Colonias' } },
          { path: 'colonia', component: ColoniaComponent, data: { titulo: 'Colonias' } }
        ]
      },
      {
        path: 'ocupaciones', component: OcupacionesComponent,
        data: { titulo: 'Ocupaciones' },
        children: [
          { path: '', component: OcupacionesListComponent },
          { path: 'ocupacion/:id', component: OcupacionComponent, data: { titulo: 'Ocupaciones' } },
          { path: 'ocupacion', component: OcupacionComponent, data: { titulo: 'Ocupaciones' } }
        ]
      },
      {
        path: 'parentescos', component: ParentescosComponent,
        data: { titulo: 'Parentescos' },
        children: [
          { path: '', component: ParentescosListComponent },
          { path: 'parentesco/:id', component: ParentescoComponent, data: { titulo: 'Parentescos' } },
          { path: 'parentesco', component: ParentescoComponent, data: { titulo: 'Parentescos' } }
        ]
      },
      {
        path: 'tarifas', component: TarifasComponent,
        data: { titulo: 'Tarifas' },
        children: [
          { path: '', component: TarifasListComponent },
          { path: 'tarifa/:id', component: TarifaComponent, data: { titulo: 'Tarifas' } },
          { path: 'tarifa', component: TarifaComponent, data: { titulo: 'Tarifas' } }
        ]
      },
      {
        path: 'semanas', component: SemanasComponent,
        data: { titulo: 'Semanas' },
        children: [
          { path: '', component: SemanaListComponent },
          { path: 'semana/:id', component: SemanaComponent, data: { titulo: 'Semanas' } },
          { path: 'semana', component: SemanaComponent, data: { titulo: 'Semanas' } },
          { path: 'year', component: YearComponent, data: { titulo: 'Año' } },
          { path: 'semanasMasivas', component: SemanaMasivaComponent, data: { titulo: 'Semanas' } }
        ]
      },
      {
        path: 'sucursales', component: SucursalesComponent,
        data: { titulo: 'Sucursales' },
        children: [
          { path: '', component: SucursalesListComponent },
          { path: 'sucursal/:id', component: SucursalComponent, data: { titulo: 'Sucursales' } },
          { path: 'sucursal', component: SucursalComponent, data: { titulo: 'Sucursales' } }
        ]
      },
      {
        path: 'zonas', component: ZonasComponent,
        data: { titulo: 'Zonas' },
        children: [
          { path: '', component: ZonasListComponent },
          { path: 'zona/:id', component: ZonaComponent, data: { titulo: 'Zonas' } },
          { path: 'zona', component: ZonaComponent, data: { titulo: 'Zonas' } }
        ]
      },
      {
        path: 'agencias', component: AgenciasComponent,
        data: { titulo: 'Agencias' },
        children: [
          { path: '', component: AgenciasListComponent },
          { path: 'agencia/:id', component: AgenciaComponent, data: { titulo: 'Agencias' } },
          { path: 'agencia', component: AgenciaComponent, data: { titulo: 'Agencias' } }
        ]
      },
      {
        path: 'asentamientos', component: AsentamientosComponent,
        data: { titulo: 'Tipos de Asentamientos' },
        children: [
          { path: '', component: AsentamientosListComponent },
          { path: 'asentamiento/:id', component: AsentamientoComponent, data: { titulo: 'Tipo de Asentamientos' } },
          { path: 'asentamiento', component: AsentamientoComponent, data: { titulo: 'Tipo de Asentamientos' } }
        ]
      },
      {
        path: 'montos', component: MontosComponent,
        data: { titulo: 'Montos' },
        children: [
          { path: '', component: MontosListComponent },
          { path: 'monto/:id', component: MontoComponent, data: { titulo: 'Montos' } },
          { path: 'monto', component: MontoComponent, data: { titulo: 'Montos' } }
        ]
      },
      {
        path: 'financiamientos', component: FinanciamientosComponent,
        data: { titulo: 'Fuentes de Financiamiento' },
        children: [
          { path: '', component: FinanciamientosListComponent },
          { path: 'financiamiento/:id', component: FinanciamientoComponent, data: { titulo: 'Fuentes de Financiamiento' } },
          { path: 'financiamiento', component: FinanciamientoComponent, data: { titulo: 'Fuentes de Financiamiento' } }
        ]
      },
      {
        path: 'empleos', component: EmpleosComponent,
        data: { titulo: 'Tipos de Empleo' },
        children: [
          { path: '', component: EmpleosListComponent },
          { path: 'empleo/:id', component: EmpleoComponent, data: { titulo: 'Tipo de Empleo' } },
          { path: 'empleo', component: EmpleoComponent, data: { titulo: 'Tipo de Empleo' } }
        ]
      },
      {
        path: 'identificaciones', component: IdentificacionesComponent,
        data: { titulo: 'Tipos de Identificación' },
        children: [
          { path: '', component: IdentificacionesListComponent },
          { path: 'identificacion/:id', component: IdentificacionComponent, data: { titulo: 'Tipo de Identificación' } },
          { path: 'identificacion', component: IdentificacionComponent, data: { titulo: 'Tipo de Identificación' } }
        ]
      },
      {
        path: 'tipoContratos', component: TipoContratosComponent,
        data: { titulo: 'Tipos de Contratos' },
        children: [
          { path: '', component: TipoContratosListComponent },
          { path: 'tipoContrato/:id', component: TipoContratoComponent, data: { titulo: 'Tipo de Contrato' } },
          { path: 'tipoContrato', component: TipoContratoComponent, data: { titulo: 'Tipo de Contrato' } }
        ]
      },
    ]
  },
  {
    path: 'dashboard', component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'stock', component: StockComponent },
      {
        path: 'solicitudes', component: SolicitudesComponent,
        data: { titulo: 'Solicitudes' },
        children: [
          { path: '', component: SolicitudesListaComponent },
          { path: 'solicitud/view/:id', component: SolicitudViewComponent, data: { titulo: 'Solicitudes' } },
          { path: 'solicitud/:id', component: SolicitudComponent, data: { titulo: 'Solicitudes' } },
          { path: 'solicitud/:id/flagEdit/:flag', component: SolicitudEditComponent, data: { titulo: 'Solicitudes' } },
          { path: 'solicitud', component: SolicitudComponent, data: { titulo: 'Solicitudes' } },
          { path: 'presupuesto', component: SolicitudesPresupuestoComponent, data:{ titulo: 'Solicitudes'} },
        ]
      },
      {
        path: 'creditos', component: CreditosComponent,
        data: { titulo: 'Créditos' },
        children: [
          { path: '', component: CreditosListComponent },
          { path: 'credito/view/:id', component: CreditoViewComponent, data: { titulo: 'Creditos' } },
          { path: 'credito/:id', component: CreditoComponent, data: { titulo: 'Créditos' } },
          { path: 'credito', component: CreditoComponent, data: { titulo: 'Créditos' } },
          { path: 'createCreditos', component: CreditosMasivosComponent, data: { titulo: 'Créditos' } },
          { path: 'checkCreditos', component: CreditosCheckEntregadosComponent, data: { titulo: 'Captura de créditos entregados' } },
        ]
      },
      {
        path: 'inversiones', component: InversionesComponent,
        data: { titulo: 'Inversión positiva' },
        children: [
          { path: '', component: InversionListComponent },
          { path: 'inversion/:id', component: InversionComponent, data: { titulo: 'Inversión positiva' } },
          { path: 'inversion', component: InversionComponent, data: { titulo: 'Inversión positiva' } },
        ]
      },
      {
        path: 'pagos', component: PagosComponent,
        data: { titulo: 'Pagos' },
        children: [
          { path: '', component: PagosListComponent },
          { path: 'pago/view/:id', component: PagoViewComponent, data: { titulo: 'Pagos' } },
          { path: 'pago/:id', component: PagoComponent, data: { titulo: 'Pagos' } },
          { path: 'pago', component: PagoComponent, data: { titulo: 'Pagos' } },
        ]
      },
      {
        path: 'clientes', component: ClientesComponent,
        data: { titulo: 'Clientes' },
        children: [
          { path: '', component: ClientesListComponent },
          { path: 'cliente/:id', component: ClienteComponent, data: { titulo: 'Clientes' } },
          { path: 'cliente', component: ClienteComponent, data: { titulo: 'Clientes' } },
          { path: 'creditos/cliente/:id', component: ViewContractsComponent, data: { titulo: 'Créditos por cliente' } },
          //{ path: 'credito/view/:id', component: CreditoDetailComponent, data: { titulo: 'Créditos por cliente' } }
          { path: 'credito/view/:id', component: CreditoViewComponent, data: { titulo: 'Créditos por cliente' } }
        ]
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    //NgSelectModule
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
