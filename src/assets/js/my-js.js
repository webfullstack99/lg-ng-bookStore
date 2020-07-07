$(document).ready(function () {
    setup.sidebarToggle();
})

let setup = {
    sidebarToggle: function () {
        $('#sidebarToggle, #sidebarToggleTop').click(function () {
            if (!$('#accordionSidebar').hasClass('toggled')) {
                $('#accordionSidebar .collapse').removeClass('show');
            }
            $('#accordionSidebar').toggleClass('toggled');
        })
    }
}