export interface IItem {
    $key?: string;
    name: {
        value: string
        forSearch: string,
    };
    status: string;
    thumb: string;
    created?: {
        userId: string,
        time: number,
    },
    modified?: {
        userId: string,
        time: number,
    },
}
