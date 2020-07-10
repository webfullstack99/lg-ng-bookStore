export class Conf {

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
                    }
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
                }
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
        },
    }
}