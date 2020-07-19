export interface IUser {
    $key?: string;
    username: {
        value: string
        forSearch: string,
    };
    email: {
        value: string
        forSearch: string,
    };
    fullName: {
        value: string
        forSearch: string,
    };
    password: string;
    status: string;
    group: any;
    thumb: string;
    created?: {
        user: any,
        time: number,
    },
    modified?: {
        userId: string,
        time: number,
    },
}
