export interface IGroup {
    $key?: string;
    name: {
        value: string
        forSearch: string,
    };
    acp: string;
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
