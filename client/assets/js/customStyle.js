jQuery.noConflict();

jQuery(document).ready(function($){
    /* TABS */
    $('#myTab a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });

    $('#myTab a[href="#table-1"]').tab('show');

    /* TOOLTIP */
    $('[data-toggle="tooltip"]').tooltip();

    /* POPOVER */
    $('[data-toggle="popover"]').popover();
});
