function menu_init() {
    $(document).ready(() => {
      $('[data-widget="treeview"]').find('.treeview-menu').hide(); // Oculta inicialmente los submenús
      $('[data-widget="treeview"]').on('click', '[data-toggle="treeview"]', function () {
        $(this).parent().toggleClass('is-expanded'); // Agrega o remueve la clase para indicar el estado de expansión
        $(this).siblings('.treeview-menu').slideToggle('fast'); // Despliega o contrae el submenú
      });
    });
  }
  