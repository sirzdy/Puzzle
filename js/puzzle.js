/**
 * Created by zdy on 2017/5/4.
 */
var url = "img/default.jpg";
var blockCount, orderList = [], blockSize, ps = {}, pe = {}, img = new Image(), ccc = new Image(), validDistance = 80,
    block = blockCount && !isNaN(blockCount) ? blockCount : 4, previewCanvas = document.getElementById("previewCanvas"),
    pCtx = previewCanvas.getContext("2d"),
    startBtn = document.getElementById("startBtn"), previewBtn = document.getElementById("previewBtn"),
    setBlock = document.getElementById("setBlock"), canvas = document.getElementById("puzzleCanvas"),
    mask = document.getElementById("mask"),
    ctx = canvas.getContext("2d");
img.src = url;
load(img);
window.onresize = function () {
    var max = 500;
    var w = window.innerWidth - 20;
    var h = window.innerHeight - 20;
    if (w < h) {
        canvas.style.width = (w >= max) ? max + "px" : w + "px";
        previewCanvas.style.width = (w >= max) ? max + "px" : w + "px";

    } else if (w > h) {
        canvas.style.width = (h >= max) ? max + "px" : h + "px";
        previewCanvas.style.width = (h >= max) ? max + "px" : h + "px";
    }
}
window.onresize();
chooseFile.onchange = function (e) {
    var chooseFile = document.getElementById("chooseFile");
    var file = chooseFile.files[0];
    var reader = new FileReader();
    //将文件以Data URL形式读入页面
    reader.readAsDataURL(file);
    reader.onload = function () {
        img.src = this.result;
        load(img)
    }
}
previewBtn.onclick = function () {
    mask.style.display = "block"
};
mask.onclick = function () {
    mask.style.display = "none"
}
setBlock.onchange = function () {
    document.getElementById("blockCount").innerText = this.value;
    block = this.value;
    start()
}
canvas.removeEventListener("touchstart", touchstart, false);
canvas.addEventListener("touchstart", touchstart, false);
canvas.removeEventListener("touchmove", touchmove, false);
canvas.addEventListener("touchmove", touchmove, false);
canvas.removeEventListener("touchend", touchend, false);
canvas.addEventListener("touchend", touchend, false);
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e.keyCode >= 37 && e.keyCode <= 40) e.preventDefault();
    switch (e.keyCode) {
        case 37:
            move("l");
            break;
        case 38:
            move("t");
            break;
        case 39:
            move("r");
            break;
        case 40:
            move("b");
            break;
        default:
            break;
    }
};
startBtn.onclick = function () {
    chooseFile.click();
};
function load(imgtemp) {
    imgtemp.onload = function () {//图片加载完成后执行
        var realWidth = this.width;
        var realHeight = this.height;
        var size = realWidth >= realHeight ? realHeight : realWidth;
        var sx = realWidth >= realHeight ? (realWidth - realHeight) / 2 : 0;
        var sy = realHeight > realWidth ? (realHeight - realWidth) / 2 : 0;
        pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        pCtx.drawImage(imgtemp, sx, sy, size, size, 0, 0, previewCanvas.width, previewCanvas.height);
        ccc.src = previewCanvas.toDataURL("image/png");
        document.getElementById("loading").style.display="none";
        document.getElementById("btn").style.display="block";
        setTimeout(start, 100);
    }
}
function start() {
    lost = block * block - 1;
    orderList = [];
    for (var i = 0; i < block * block; i++) {
        orderList[i] = i;
    }
    blockSize = canvas.width / block;
    function autoSort(a, b) {
        //生成随机数跟0.5比较
        return Math.random() >= 0.5 ? 1 : -1;
    }
    orderList.sort(autoSort);//往autoSort中两两传入数组元素
    draw();
}
function move(op) {
    var index = orderList.indexOf(lost);
    var anotherIndex;
    switch (op) {
        case "r":
            if (index % block == 0) break;
            anotherIndex = parseInt(parseInt(index) - parseInt(1));
            break;
        case "l":
            if (index % block == block - 1) break;
            anotherIndex = parseInt(parseInt(index) + parseInt(1));
            break;
        case "b":
            if (index <= block - 1) break;
            anotherIndex = parseInt(parseInt(index) - parseInt(block));
            break;
        case "t":
            if (index >= block * (block - 1)) break;
            anotherIndex = parseInt(parseInt(index) + parseInt(block));
            break;
        default:
            break;
    }
    if (anotherIndex != undefined) {
        var temp = orderList[index];
        orderList[index] = orderList[anotherIndex];
        orderList[anotherIndex] = temp;
    }
    draw();
    var sign = true;
    for (var i = 0; i < orderList.length - 1; i++) {
        if (orderList[i] > orderList[i + 1]) {
            sign = false;
        }
    }
    sign == true && success();
}
function success() {
    //alert("恭喜")
    mask.style.display = "block"
    document.getElementById("suc").style.display = "block";
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < block; i++) {
        for (var j = 0; j < block; j++) {
            var cur = orderList[i * block + j];
            var ai = Math.floor(cur / block);
            var aj = cur % block;
            if (cur == lost) continue;
            ctx.drawImage(ccc, blockSize * aj, blockSize * ai, blockSize, blockSize, blockSize * j + 1, blockSize * i + 1, blockSize - 2, blockSize - 2);
        }
    }
}
function touchend(e) {
    if (Math.abs(pe.x - ps.x) > Math.abs(pe.y - ps.y)) {
        //横向
        if (pe.x - ps.x > validDistance) {//右移
            move("r")
        } else if (pe.x - ps.x < 0 - validDistance) {//左移
            move("l")
        }
    } else {
        if (pe.y - ps.y > validDistance) {//下移
            move("b")
        } else if (pe.y - ps.y < 0 - validDistance) {//上移
            move("t")
        }
    }
}
function touchstart(e) {
    ps.x = e.touches[0].pageX;
    ps.y = e.touches[0].pageY;
    e.preventDefault();
}
function touchmove(e) {
    pe.x = e.touches[0].pageX;
    pe.y = e.touches[0].pageY;
    e.preventDefault();
}

