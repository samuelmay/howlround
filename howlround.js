var ScreenResolution = {
    width: 768,
    height: 576
};
function setupScreen() {
    var tv = document.getElementById("tvscreen");
    // Note that for the canvas element, width and height
    // are *different* to the css/style width and height.
    tv.width = ScreenResolution.width;
    tv.height = ScreenResolution.height;
    var ctx = tv.getContext("2d");
    ctx.font = "30px Arial";
    var x = ScreenResolution.width / 2;
    var y = ScreenResolution.height / 2;
    ctx.strokeText("Hello World", x, y);
}
document.addEventListener("DOMContentLoaded", setupScreen);
