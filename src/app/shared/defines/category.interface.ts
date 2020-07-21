export interface ICategory {
    $key?: string;
    name: {
        value: string
        forSearch: string,
    };
    slug: string;
    status: string;
    created?: {
        userId: string,
        time: number,
    },
    modified?: {
        userId: string,
        time: number,
    },
}
