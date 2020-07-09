export class Conf {
    time = {
        short_time: 'dd/mm/yy',
        long_time: 'HH:MM:SS dd/mm/yy',
    }

    prefix = {
        admin: '/admin',
    }

    template = {
        format: {
            button: {
                status: {
                    active: {
                        classes: 'btn btn-success btn-sm',
                        content: 'Active',
                    },
                    inactive: {
                        classes: 'btn btn-warning btn-sm',
                        content: 'In active',
                    },
                }
            }
        }
    }
}