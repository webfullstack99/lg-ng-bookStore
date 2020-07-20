export class base64Upload {
    public _base64: any;
    public _url: any;
    public _progress: number;
    public _created: number = Date.now();

    constructor(base64: any) {
        this._base64 = base64;
    }
}
