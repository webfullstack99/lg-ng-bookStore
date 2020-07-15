export interface IBook {
    $key?: string;
    title: {
        value: string
        forSearch: string,
    };
    author: {
        value: string
        forSearch: string,
    };
    description: {
        value: string
        forSearch: string,
    };
    status: string;
    price: number;
    saleOff: number;
    thumb: string;
    category: any,
    created?: {
        user: any,
        time: number,
    },
    modified?: {
        userId: string,
        time: number,
    },
}
