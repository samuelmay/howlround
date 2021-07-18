const ScreenResolution = {
	width : 768,
	height : 576
}

const FilterGain = 1;
const FilterKernel = [
	1, 4, 7, 4, 1,
	4,16,26,16, 4,
	7,26,41,26, 7,
	4,16,26,16, 4,
	1, 4, 7, 4, 1
].map(x => FilterGain * (x/271));

const KernelRadius = Math.floor(Math.sqrt(FilterKernel.length)/2);

function getPixelPointer(x: number, y: number, imageData: ImageData): number {
	// this is the number of array cells per pixel. There are four:
	// red, green, blue, alpha
	let rowLength: number = imageData.width;	
	let pixelDataSize: number = 4;
	return y * (rowLength * pixelDataSize ) + (x * pixelDataSize);
}

function getPixel(x: number, y: number, canvas: HTMLCanvasElement): number[] {
	let imageData: ImageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
	let pointer: number = getPixelPointer(x, y, imageData);
	let red = imageData.data[pointer];
	let green = imageData.data[pointer + 1];
	let blue = imageData.data[pointer + 2];
	let alpha = imageData.data[pointer + 3];
	return [red, green, blue, alpha];
}

function getBrightness(pointer: number, imageData: ImageData): number {
	let alpha = imageData.data[pointer + 3];
	return alpha;
}

function setBrightness(pointer: number, imageData: ImageData, brightness: number) {
	imageData.data[pointer + 3] = brightness;
}

// this has side effects on the imageData array.
function addBrightness(pointer: number, imageData: ImageData, brightness: number) {
	let value = getBrightness(pointer, imageData);
	value = value + brightness;
	// clip signal output
	if (value > 255) {
		value = 255;
	}
	setBrightness(pointer, imageData, value);
}

function testFilter(xI: number, yI: number, kernel: number[]) {

	let k = 0;
	for (let y = (yI - KernelRadius); y <= (yI + KernelRadius); y++) {
		for (let x = (xI - KernelRadius); x <= (xI + KernelRadius); x++) {
			// only operate when the kernel is not overlapping the
			// edge of the image
			if (y >= 0 && x >= 0 && y < ScreenResolution.height && x < ScreenResolution.width) {
				console.log('(' + x.toString() + ',' + y.toString() + ')' + ' at ' + k.toString());
			}
			k++;
			if (k > kernel.length) {
				console.log('you fucked up');
				return;
			}
		}
	}
}

// This has side effects on the output data array.
// The 'I' in 'xI' is for impulse.
function filterPixel(xI: number, yI: number, inputData: ImageData,  kernel: number[], outputData: ImageData) {

	let pointer = getPixelPointer(xI, yI, inputData);
	let inputVal = getBrightness(pointer, inputData);
	let k = 0;

	for (let y = (yI - KernelRadius); y <= (yI + KernelRadius); y++) {
		for (let x = (xI - KernelRadius); x <= (xI + KernelRadius); x++) {
			// only operate when the kernel is not overlapping the
			// edge of the image
			if (y >= 0 && x >= 0 && y < inputData.height && x < inputData.width) {
				let outputVal = inputVal * kernel[k];
				pointer = getPixelPointer(x, y, outputData);
				addBrightness(pointer, outputData, outputVal);
			}
			k++;
			if (k > kernel.length) {
				console.log('you fucked up');
				return;
			}

		}
	}
}

function convolution(inputData: ImageData, kernel: number[], outputData: ImageData) {
	let x = 0;
	let y = 0;
	for (y = 0; y < inputData.height; y++) {
		for (x = 0; x < inputData.width; x++) {
			filterPixel(x, y, inputData, kernel, outputData);

			//let pointer = getPixelPointer(x, y, inputData);
			//let currentValue = getBrightness(pointer, inputData);
			//setBrightness(pointer, outputData, currentValue);
			//addBrightness(pointer, outputData, 10); 

		}
	}
}

function feedback() {
	console.log('feeding back...');
	let tv = <HTMLCanvasElement> document.getElementById("tvscreen");
	let ctx = tv.getContext("2d");

	let thisIteration = ctx.getImageData(0, 0, tv.width, tv.height);
	let nextIteration = ctx.createImageData(tv.width, tv.height);
	convolution(thisIteration, FilterKernel, nextIteration);

	ctx.putImageData(nextIteration, 0, 0);
}

function setupScreen() {
	// initial content
	//
	let tv = <HTMLCanvasElement> document.getElementById("tvscreen");
	// Note that for the canvas element, width and height
	// are *different* to the css/style width and height.
	tv.width = ScreenResolution.width;
	tv.height = ScreenResolution.height;

	let ctx = tv.getContext("2d");
	let x = ScreenResolution.width / 2;
	let y = ScreenResolution.height / 2;
	
	ctx.font = "30px Arial";
	ctx.strokeText("Hello World", x, y);
	//ctx.fillRect(x,y,75,75);
	document.getElementById('iterator').addEventListener('click', feedback);
}

document.addEventListener('DOMContentLoaded', setupScreen);

