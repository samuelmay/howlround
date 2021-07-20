var ScreenResolution = {
    width: 768,
    height: 576
};
var FilterGain = 1.22;
var Dimming = 0.0045;
var FilterKernel = [
    0.000, 0.000, 0.001, 0.001, 0.001, 0.001, 0.001, 0.000, 0.000,
    0.000, 0.001, 0.000, 0.002, 0.004, 0.002, 0.000, 0.001, 0.000,
    0.001, 0.000, 0.005, 0.002, 0.000, 0.002, 0.005, 0.000, 0.001,
    0.001, 0.002, 0.002, 0.033, 0.115, 0.033, 0.002, 0.002, 0.001,
    0.001, 0.004, 0.000, 0.115, 0.312, 0.115, 0.000, 0.004, 0.001,
    0.001, 0.002, 0.002, 0.033, 0.115, 0.033, 0.002, 0.002, 0.001,
    0.001, 0.000, 0.005, 0.002, 0.000, 0.002, 0.005, 0.000, 0.001,
    0.000, 0.001, 0.000, 0.002, 0.004, 0.002, 0.000, 0.001, 0.000,
    0.000, 0.000, 0.001, 0.001, 0.001, 0.001, 0.001, 0.000, 0.000
].map(function (x) { return (FilterGain * x) - Dimming; });
/*const FilterGain = 2;
const FilterKernel = [
    1, 4, 7, 4, 1,
    4,16,26,16, 4,
    7,26,41,26, 7,
    4,16,26,16, 4,
    1, 4, 7, 4, 1
].map(x => FilterGain * (x/271));*/
var KernelRadius = Math.floor(Math.sqrt(FilterKernel.length) / 2);
function getPixelPointer(x, y, imageData) {
    // this is the number of array cells per pixel. There are four:
    // red, green, blue, alpha
    var rowLength = imageData.width;
    var pixelDataSize = 4;
    return y * (rowLength * pixelDataSize) + (x * pixelDataSize);
}
function getPixel(x, y, canvas) {
    var imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    var pointer = getPixelPointer(x, y, imageData);
    var red = imageData.data[pointer];
    var green = imageData.data[pointer + 1];
    var blue = imageData.data[pointer + 2];
    var alpha = imageData.data[pointer + 3];
    return [red, green, blue, alpha];
}
function getBrightness(pointer, imageData) {
    var alpha = imageData.data[pointer + 3];
    return alpha;
}
function setBrightness(pointer, imageData, brightness) {
    imageData.data[pointer + 3] = brightness;
}
// this has side effects on the imageData array.
function addBrightness(pointer, imageData, brightness) {
    var value = getBrightness(pointer, imageData);
    value = value + brightness;
    // clip signal output
    //if (value > 255) {
    //	value = 255;
    //}
    setBrightness(pointer, imageData, value);
}
function testFilter(xI, yI, kernel) {
    var k = 0;
    for (var y = (yI - KernelRadius); y <= (yI + KernelRadius); y++) {
        for (var x = (xI - KernelRadius); x <= (xI + KernelRadius); x++) {
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
function filterPixel(xI, yI, inputData, kernel, outputData) {
    var pointer = getPixelPointer(xI, yI, inputData);
    var inputVal = getBrightness(pointer, inputData);
    var k = 0;
    for (var y = (yI - KernelRadius); y <= (yI + KernelRadius); y++) {
        for (var x = (xI - KernelRadius); x <= (xI + KernelRadius); x++) {
            // only operate when the kernel is not overlapping the
            // edge of the image
            if (y >= 0 && x >= 0 && y < inputData.height && x < inputData.width) {
                var outputVal = inputVal * kernel[k];
                pointer = getPixelPointer(x, y, outputData);
                addBrightness(pointer, outputData, outputVal);
            }
            k++;
        }
    }
}
function convolution(inputData, kernel, outputData) {
    var x = 0;
    var y = 0;
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
var TIMER_RUNNING;
function feedback() {
    var tv = document.getElementById("tvscreen");
    var ctx = tv.getContext("2d");
    var thisIteration = ctx.getImageData(0, 0, tv.width, tv.height);
    var nextIteration = ctx.createImageData(tv.width, tv.height);
    convolution(thisIteration, FilterKernel, nextIteration);
    ctx.putImageData(nextIteration, 0, 0);
    if (TIMER_RUNNING) {
        window.setTimeout(feedback, 5);
    }
}
function startFeedback() {
    TIMER_RUNNING = true;
    feedback();
}
function stopFeedback() {
    TIMER_RUNNING = false;
}
function reset() {
    var tv = document.getElementById("tvscreen");
    // Note that for the canvas element, width and height
    // are *different* to the css/style width and height.
    tv.width = ScreenResolution.width;
    tv.height = ScreenResolution.height;
    var ctx = tv.getContext("2d");
    var x = 180;
    var y = 280;
    ctx.font = "100px Arial";
    //ctx.strokeText("Hello World", x, y);
    ctx.fillText("Hello World", x, y);
    //ctx.fillRect(x,y,75,75);
}
function setupScreen() {
    reset();
    document.getElementById('startButton').addEventListener('click', startFeedback);
    document.getElementById('stopButton').addEventListener('click', stopFeedback);
    document.getElementById('resetButton').addEventListener('click', reset);
}
document.addEventListener('DOMContentLoaded', setupScreen);
