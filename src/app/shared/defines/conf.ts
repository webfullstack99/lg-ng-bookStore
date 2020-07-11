export class Conf {

    params = {
        timeout: 400,
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
            }
        },
        selectData: {
            status: ['active', 'inactive'],
            display: ['yes', 'no'],
        }
    }

    templateConf = {
        item: {
            action: ['edit', 'delete'],
            filter: ['status'],
            search: ['name', 'all'],
        },
    }
}