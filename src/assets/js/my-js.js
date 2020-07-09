$(document).ready(function () {
    setup.run();
})

let setup = {
    run: function () {
        this.onChevronBtnClick();
        this.onSwitchChevronClick();
        this.onCustomFileInputChange();
        this.alignMiddleColumnInTable();
    },

    onChevronBtnClick: function () {
        let $this = this;
        $(slt.chevronBtn).click(function () {
            $this.onSwitchChevron($(this).children(slt.onClickSwitchChevron));
        })
    },

    onSwitchChevronClick: function () {
        let $this = this;
        $('body').bind('click', slt.onClickSwitchChevron, function (e) {
            $this.onSwitchChevron(e.target);
        })
    },

    onSwitchChevron: function (target) {
        let prefix = 'fa-chevron';
        let chevronArr = [`${prefix}-up`, `${prefix}-down`, `${prefix}-left`, `${prefix}-right`];

        for (let chevron of chevronArr) {
            if ($(target).hasClass(chevron)) {
                let switchTo = `${prefix}-`;
                if (chevron.includes('down') || chevron.includes('up')) {
                    switchTo += ((chevron.indexOf('up') > -1) ? 'down' : 'up');
                } else if (chevron.includes('left') || chevron.includes('right')) {
                    switchTo += ((chevron.indexOf('left') > -1) ? 'right' : 'left');
                }
                $(target).removeClass(chevron).addClass(switchTo);
                break;
            }
        }
    },

    sidebarToggle: function () {
        $(`${slt.sidebarToggle}, ${slt.sidebarToggleTop}`).click(function () {
            if (!$(slt.accordionSidebar).hasClass('toggled')) {
                $(`${slt.accordionSidebar} .collapse`).removeClass('show');
            }
            $(slt.accordionSidebar).toggleClass('toggled');
        })
    },

    onCustomFileInputChange: function () {
        $(slt.customFileInput).on('change', function () {
            //get the file name
            var fileName = $(this).val();

            //replace the "Choose a file" label
            $(this).next('.custom-file-label').html(fileName);
        })
    },

    alignMiddleColumnInTable: function () { }
}

let slt = {
    adminMainTable: '.admin-main-table',
    customFileInput: 'input.custom-file-input[type="file"]',
    sidebarToggle: '#sidebarToggle',
    sidebarToggleTop: '#sidebarToggleTop',
    accordionSidebar: '#accordionSidebar',
    onClickSwitchChevron: '.on-click-switch-chevron',
    chevronBtn: '.chevron-btn',
}