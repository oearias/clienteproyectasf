import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { StockComponent } from './stock/stock.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudesListaComponent } from './solicitudes/solicitudes-lista/solicitudes-lista.component';
import { SolicitudComponent } from './solicitudes/solicitud/solicitud.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClientesListComponent } from './clientes/clientes-list/clientes-list.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { DataTablesModule } from "angular-datatables";

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';

import { ToastrModule } from 'ngx-toastr';
import { SpinnerModule } from './spinner/spinner.module';
import { SpinnerInterceptor } from '../shared/interceptors/spinner.interceptor';
import { ModalComponent } from './modal/modal.component';
import { ColoniasComponent } from './colonias/colonias.component';
import { ColoniasListComponent } from './colonias/colonias-list/colonias-list.component';
import { ColoniaComponent } from './colonias/colonia/colonia.component';
import { AsentamientoComponent } from './asentamientos/asentamiento/asentamiento.component';
import { AsentamientosComponent } from './asentamientos/asentamientos.component';
import { AsentamientosListComponent } from './asentamientos/asentamientos-list/asentamientos-list.component';
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
import { ParentescosComponent } from './parentescos/parentescos.component';
import { ParentescosListComponent } from './parentescos/parentescos-list/parentescos-list.component';
import { ParentescoComponent } from './parentescos/parentesco/parentesco.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { TarifaComponent } from './tarifas/tarifa/tarifa.component';
import { TarifasListComponent } from './tarifas/tarifas-list/tarifas-list.component';
import { SolicitudViewComponent } from './solicitudes/solicitud-view/solicitud-view.component';
import { CreditosComponent } from './creditos/creditos.component';
import { CreditosListComponent } from './creditos/creditos-list/creditos-list.component';
import { CreditoComponent } from './creditos/credito/credito.component';
import { FinanciamientoComponent } from './financiamientos/financiamiento/financiamiento.component';
import { FinanciamientosListComponent } from './financiamientos/financiamientos-list/financiamientos-list.component';
import { FinanciamientosComponent } from './financiamientos/financiamientos.component';
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
import { SemanaComponent } from './semanas/semana/semana.component';
import { SemanaListComponent } from './semanas/semana-list/semana-list.component';
import { SemanaMasivaComponent } from './semanas/semana-masiva/semana-masiva.component';
import { YearComponent } from './semanas/year/year.component';
import { InversionesComponent } from './inversiones/inversiones.component';
import { InversionComponent } from './inversiones/inversion/inversion.component';
import { InversionListComponent } from './inversiones/inversion-list/inversion-list.component';
import { ViewContractsComponent } from './clientes/view-contracts/view-contracts.component';
import { CreditosCheckEntregadosComponent } from './creditos/creditos-check-entregados/creditos-check-entregados.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    PagesComponent,
    StockComponent,
    SolicitudesComponent,
    SolicitudesListaComponent,
    SolicitudComponent,
    ClientesComponent,
    ClientesListComponent,
    ClienteComponent,
    ModalComponent,
    ColoniasComponent,
    ColoniasListComponent,
    ColoniaComponent,
    AsentamientoComponent,
    AsentamientosComponent,
    AsentamientosListComponent,
    SucursalesComponent,
    SucursalesListComponent,
    SucursalComponent,
    ZonasComponent,
    ZonasListComponent,
    ZonaComponent,
    OcupacionesComponent,
    OcupacionesListComponent,
    OcupacionComponent,
    AgenciasComponent,
    AgenciasListComponent,
    AgenciaComponent,
    EmpleosComponent,
    EmpleosListComponent,
    EmpleoComponent,
    IdentificacionesComponent,
    IdentificacionesListComponent,
    IdentificacionComponent,
    ParentescosComponent,
    ParentescosListComponent,
    ParentescoComponent,
    TarifasComponent,
    TarifaComponent,
    TarifasListComponent,
    SolicitudViewComponent,
    CreditosComponent,
    CreditosListComponent,
    CreditoComponent,
    FinanciamientoComponent,
    FinanciamientosListComponent,
    FinanciamientosComponent,
    TipoContratosComponent,
    TipoContratosListComponent,
    TipoContratoComponent,
    PagosComponent,
    PagosListComponent,
    PagoComponent,
    CreditoViewComponent,
    PagoViewComponent,
    UsuariosListComponent,
    UsuarioComponent,
    ChangePasswordComponent,
    RolesComponent,
    RolesListComponent,
    RoleComponent,
    RolesUsuariosComponent,
    RolesUsuariosListComponent,
    RoleUsuarioComponent,
    Usuario2Component,
    MontosComponent,
    MontosListComponent,
    MontoComponent,
    SolicitudesPresupuestoComponent,
    SolicitudEditComponent,
    CreditosMasivosComponent,
    SemanasComponent,
    SemanaComponent,
    SemanaListComponent,
    SemanaMasivaComponent,
    YearComponent,
    InversionesComponent,
    InversionComponent,
    InversionListComponent,
    ViewContractsComponent,
    CreditosCheckEntregadosComponent,
  ],
  exports: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    StockComponent,
    PagesComponent,
    ClientesComponent,
    ClientesListComponent,
    ClienteComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgSelectModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    SpinnerModule,
    DataTablesModule
  ],
  providers:[
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true}
  ]
})
export class PagesModule { }
