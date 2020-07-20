import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';
import { BehaviorSubject } from 'rxjs';

declare const $: any;

@Component({
    selector: '[app-image-cropper-file-input]',
    templateUrl: './image-cropper-file-input.component.html',
    styleUrls: ['./image-cropper-file-input.component.css']
})
export class ImageCropperFileInputComponent implements OnInit {

    public imageChangedEvent: any = '';
    public _classes: any;
    public croppedImage: string = '';

    @Input('controller') _controller: string;
    @Input('name') _name: string;
    @Input('displayName') _displayName: string;
    @Input('control') _control: FormControl;
    @Input('croppedImageBehaviorSubject') _croppedImageBehaviorSubject: BehaviorSubject<any>;

    constructor(
        public _helperService: HelperService,
        public _conf: Conf
    ) { }

    ngOnInit() {
        if (this._croppedImageBehaviorSubject) {
            this._croppedImageBehaviorSubject.subscribe((data) => {
                this.croppedImage = data;
            })
        }
        this._classes = this._conf.template.form.admin.fileInput;
    }

    // IMAGE CROPPER
    public fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        $('#image-cropper-modal').modal('show');
    }

    public imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    public loadImageFailed() {
        console.log('Failed to load cropper image');
    }

    // other methods
    public onCropped(): void {
        this._control.setValue(this.croppedImage);
        $('#image-cropper-modal').modal('hide');
    }

    public onClick(): void {
        setTimeout(() => {
            this._control.markAsTouched();
            this._control.markAsDirty();
        }, this._conf.params.fileInputShowErrorTime);
    }

    get aspectRatio(): number {
        let aspectRatio: number = 1;
        if (this._controller == 'book') aspectRatio = 3 / 4;
        return aspectRatio;
    }

    get imageTitle(): string { return `New ${this._displayName}`; }
}
