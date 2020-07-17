/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
    config.toolbar_myToolbar = [
        { items: ['Save', 'Cut', 'Copy', '-', 'Undo', 'Redo'] },
        { items: ['Bold', 'Italic', 'Underline', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'RemoveFormat'] },
        { items: ['Styles', 'Font', 'FontSize', 'TextColor', 'BGColor', 'Maximize'] }
    ];
    config.toolbar = 'myToolbar';
};
