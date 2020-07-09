export class Upload {
    public _name: string;
    public _file: File;
    public _url: any;
    public _progress: number;
    public _created: number = Date.now();

    constructor(file: File) {
        this._file = file;
    }
}
