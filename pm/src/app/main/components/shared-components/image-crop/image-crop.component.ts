import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CropperSettings, Bounds, ImageCropperComponent } from 'ngx-img-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-image-crop',
	templateUrl: './image-crop.component.html',
	styleUrls: [ './image-crop.component.scss' ]
})
export class ImageCropComponent implements OnInit {
  img: any;
  cropData: any;
	@ViewChild('cropper', null)
	cropper: ImageCropperComponent;
	cropperSettings: CropperSettings;
  croppedWidth:number;
  croppedHeight:number;
  imageLoaded: boolean = false;

	files: File[] = [];

  constructor(public dialogRef: MatDialogRef<ImageCropComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

		this.cropperSettings = new CropperSettings();
		this.cropperSettings.noFileInput = true;
    this.cropperSettings.rounded = true;
    this.cropperSettings.keepAspect = false;
    this.cropperSettings.preserveSize = true;
    this.cropData = {};
    }

	closeDialog(): void {
		this.dialogRef.close();
  }
  
  cropped(bounds:Bounds) {
    this.croppedHeight =bounds.bottom-bounds.top;
    this.croppedWidth = bounds.right-bounds.left;
  }

	onSelect(e) {
    
		let image: any = new Image();
		let file: File = e.addedFiles[0];
		let myReader: FileReader = new FileReader();
		myReader.onloadend = (loadEvent: any) => {
      this.imageLoaded = true;
			image.src = loadEvent.target.result;
			this.cropper.setImage(image);
		};

		myReader.readAsDataURL(file);
  }
  
	ngOnInit() {}
}

export interface DialogData {
  src: string;
  image: any;
}