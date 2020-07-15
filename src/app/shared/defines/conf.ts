import { BehaviorSubject } from 'rxjs';
import { NotifierOptions } from 'angular-notifier';

export class Conf {

    message = {
        crud: {
            multi_delete_warning: {
                content: 'Do you want to delete these items?',
            },
            delete_warning: {
                content: 'Do you want to delete {0}?',
            },
            update_success: {
                content: 'Item updated',
                type: 'default',
            },
            update_fail: {
                content: 'Something went wrong',
                type: 'danger',
            },
            multi_update_success: {
                content: '{0} items updated',
                type: 'default',
            },
            multi_update_fail: {
                content: 'Something went wrong',
                type: 'danger',
            },
            delete_success: {
                content: 'Item deleted',
                type: 'default',
            },
            delete_fail: {
                content: 'Something went wrong',
                type: 'error',
            },
            multi_delete_success: {
                content: '{0} items deleted',
                type: 'default',
            },
            multi_delete_fail: {
                content: 'Something went wrong',
                type: 'error',
            },
        }
    }

    params = {
        defaultTimeout: 400,
        delayForAvoidAsyncTime: 100,
    }

    format = {
        time: {
            short_time: 'dd/MM/yyyy',
            long_time: 'dd/MM/yyyy HH:mm:ss"',
            locale: 'en-US',
        }
    }

    prefix = {
        admin: '/admin',
    }

    template = {
        format: {
            text: {
                chooseFile: 'choose file',
            },
            button: {
                display: {
                    yes: {
                        content: 'Yes',
                        classes: 'btn btn-primary',
                    },
                    no: {
                        content: 'No',
                        classes: 'btn btn-light',
                    },
                    get all() { return new Conf().template.format.button.all; }
                },
                status: {
                    active: {
                        classes: 'btn btn-success btn-sm',
                        content: 'Active',
                    },
                    inactive: {
                        classes: 'btn btn-warning btn-sm',
                        content: 'In active',
                    },
                    get all() { return new Conf().template.format.button.all; }
                },
                action: {
                    edit: {
                        classes: 'btn btn-success btn-sm ',
                        icon: 'far fa-pen',
                        content: 'Edit',
                    },
                    delete: {
                        classes: 'btn btn-danger btn-sm ',
                        icon: 'far fa-trash-alt',
                        content: 'Delete',
                    },
                    view: {
                        classes: 'btn btn-info btn-sm ',
                        icon: 'far fa-info',
                        content: 'View',
                    },
                },
                undefined: {
                    classes: 'btn btn-secondary btn-sm',
                    content: 'Undefined',
                },
                all: {
                    classes: 'btn btn-primary btn-sm',
                    content: 'All',
                }
            },
            search: {
                id: 'Search by id',
                username: 'Search by username',
                name: 'Search by name',
                fullName: 'Search by full name',
                email: 'Search by email',
                title: 'Search by title',
                description: 'Search by description',
                content: 'Search by content',
                all: 'Search by all',
            },
        },
        selectData: {
            status: ['active', 'inactive'],
            display: ['yes', 'no'],
        },
        form: {
            admin: {
                label: 'col-sm-2 col-form-label',
                input: 'col-sm-10 form-control',
                fileContainer: 'col-sm-10',
                fileInput: 'custom-file-input',
                fileInputLabel: 'img-file-input custom-file-label',
                submit: 'col-sm-2 offset-lg-2 btn btn-primary',
                select: 'col-sm-10 custom-select',
            }
        }
    }

    templateConf = {
        item: {
            action: ['edit', 'delete'],
            filter: ['status'],
            search: ['name', 'all'],
            sort: ['name', 'status', 'created', 'modified'],
        },
    }

    page = {
        item: {
            pagination: {
                pageRange: 3,
                itemsPerPage: 5,
                behaviorSubject: new BehaviorSubject(this),
            }
        }
    }

    notifier: NotifierOptions = {
        position: {
            horizontal: {
                position: "right",
            },
            vertical: {
                position: "top",
            }
        },
        behaviour: {
            autoHide: 5000,
            stacking: 5,
        },
    }

    public noSlashes(str: string): string {
        return str.replace(/\//, '');
    }
}