import { BehaviorSubject } from 'rxjs';
import { NotifierOptions } from 'angular-notifier';

export class Conf {

    message = {
        crud: {
            multi_delete_warning: {
                content: 'Do you want to delete {0} items?',
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
            create_success: {
                content: 'Item created',
                type: 'default',
            },
            create_fail: {
                content: 'Something went wrong',
                type: 'error',
            },
            update_invalid: {
                content: 'Invalid data',
                type: 'error',
            }
        },
        form: {
            lengthBetween: 'Length must between {0} and {1}',
            between: 'Value must between {0} and {1}',
            unique: '{0} already exists',
            matchPassword: 'Password does not match',
        }
    }

    params = {
        defaultTime: 400,
        loadCkEditorTime: 1000,
        loadSpecificCkEditor: 1500,
        shortInputChangeTime: 1000,
        longInputChangeTime: 2000,
        delayForSearchTime: 400,
        delayForAvoidAsyncTime: 100,
        fileInputShowErrorTime: 2000,
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
                acp: {
                    yes: {
                        content: 'Yes',
                        classes: 'btn btn-success btn-sm',
                    },
                    no: {
                        content: 'No',
                        classes: 'btn btn-light btn-sm',
                    },
                    get all() { return new Conf().template.format.button.all; }
                },
                special: {
                    yes: {
                        content: 'Yes',
                        classes: 'btn btn-success btn-sm',
                    },
                    no: {
                        content: 'No',
                        classes: 'btn btn-light btn-sm',
                    },
                    get all() { return new Conf().template.format.button.all; }
                },
                display: {
                    yes: {
                        content: 'Yes',
                        classes: 'btn btn-primary btn-sm',
                    },
                    no: {
                        content: 'No',
                        classes: 'btn btn-light btn-sm',
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
                author: 'Search by author',
                content: 'Search by content',
                all: 'Search by all',
            },
        },
        selectData: {
            status: ['active', 'inactive'],
            special: ['yes', 'no'],
            display: ['yes', 'no'],
            acp: ['yes', 'no'],
        },
        form: {
            admin: {
                label: {
                    classes: 'col-sm-2 col-form-label'
                },
                input: {
                    classes: 'form-control',
                    containerClasses: 'col-sm-10',
                },
                textarea: {
                    classes: 'form-control',
                    containerClasses: 'col-sm-10',
                },
                fileInput: {
                    labelClasses: 'img-file-input custom-file-label',
                    classes: 'custom-file-input',
                    containerClasses: 'col-sm-10',
                },
                submit: {
                    classes: 'col-sm-2 offset-lg-2 btn btn-primary',
                },
                select: {
                    classes: 'custom-select',
                    containerClasses: 'col-sm-10',
                },
            }
        }
    }

    templateConf = {
        item: {
            action: ['edit', 'delete'],
            filter: ['status'],
            search: ['name', 'all'],
            sort: ['name', 'status', 'created', 'modified'],
            pagination: {
                pageRange: 3,
                itemsPerPage: 5,
                behaviorSubject: new BehaviorSubject(this),
            }
        },

        book: {
            action: ['edit', 'delete'],
            filter: ['status', 'special'],
            search: ['all', 'title', 'author', 'description'],
            sort: ['title', 'category', 'author', 'price', 'special', 'saleOff', 'status', 'created', 'modified'],
            pagination: {
                pageRange: 3,
                itemsPerPage: 5,
                behaviorSubject: new BehaviorSubject(this),
            },
            formParams: {
                title: {
                    min: 10,
                    max: 200,
                },
                author: {
                    min: 5,
                    max: 50,
                },
                description: {
                    min: 10,
                    max: 5000,
                },
                slug: {
                    min: 10,
                    max: 200,
                },
                price: {
                    min: 5000,
                    max: 1000000,
                    step: 10000,
                },
                saleOff: {
                    min: 1,
                    max: 100,
                    step: 5,
                },
            }
        },

        category: {
            action: ['edit', 'delete'],
            filter: ['status'],
            search: ['name', 'all'],
            sort: ['name', 'status', 'created', 'modified'],
            pagination: {
                pageRange: 3,
                itemsPerPage: 5,
                behaviorSubject: new BehaviorSubject(this),
            },
            formParams: {
                name: {
                    min: 3,
                    max: 50,
                },
                slug: {
                    min: 3,
                    max: 50,
                },
            }
        },

        group: {
            action: ['edit', 'delete'],
            filter: ['status', 'acp'],
            search: ['name', 'all'],
            sort: ['name', 'acp', 'status', 'created', 'modified'],
            pagination: {
                pageRange: 3,
                itemsPerPage: 5,
                behaviorSubject: new BehaviorSubject(this),
            },
            formParams: {
                name: {
                    min: 3,
                    max: 50,
                },
            }
        },

        user: {
            action: ['edit', 'delete'],
            filter: ['status'],
            search: ['all', 'username', 'email', 'fullName'],
            sort: ['username', 'email', 'fullName', 'group', 'status', 'created', 'modified'],
            pagination: {
                pageRange: 3,
                itemsPerPage: 5,
                behaviorSubject: new BehaviorSubject(this),
            },
            formParams: {
                username: {
                    min: 5,
                    max: 20,
                },
                email: {
                    min: 5,
                    max: 30,
                },
                fullName: {
                    min: 5,
                    max: 50,
                },
                password: {
                    min: 8,
                },
            }
        },
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
            autoHide: 2000,
            stacking: 10,
        },
    }

    public noSlashes(str: string): string {
        return str.replace(/\//, '');
    }
}