//还没能逐条执行动作。。
function createTable(width,height,pos) {
    var table = document.getElementById('table');
    var tr_arr = [];
    for (var i = 0; i < width; i++) {
        tr_arr[i] = document.createElement("tr");
        table.appendChild(tr_arr[i]);
        for (var j = 0; j < height; j++) {
            var td_arr = [];
            td_arr[j] = document.createElement("td");
            tr_arr[i].appendChild(td_arr[j]);
            if (i == 0) {
                td_arr[j].setAttribute("class", "clear_border");
                if (j > 0) td_arr[j].innerHTML = j;
            }
            if (j == 0) {
                td_arr[0].setAttribute("class", "clear_border");
                if (i > 0) td_arr[0].innerHTML = i;
            }
        }
    }
    return {"width":width-1,"height":height-1,"pos":pos}
}

//正则分割内容框里的内容,扩展命令，添加数字
function enhanceCommand(str) {
    var filter = /\n/g;
    var inputArr = str.split(filter);
    return inputArr;
}
var robot = document.getElementById('robot_box');
var cmd_btn = document.getElementById('command_button');
var deg = 0; //初始化角度
var face = 0; //初始化方向  0: 上, 1: 右, 2: 下, 3: 左;
var whInfo = createTable(11,21,50);
var xPos = whInfo.pos;
var yPos = whInfo.pos;
var RobotBox = {
    xPos: function() {
        xPos += "px";
        return robot.style.top
    },
    yPos: function() {
        yPos += "px"
        return robot.style.left
    },
    face: function() {
        face = face % 4;
        if (face == 0) {
            // console.log(face, "朝上");
            return face;
        } else if (face == 1) {
            // console.log(face, "朝左");
            return face;
        } else if (face == 2) {
            // console.log(face, "朝下");
            return face;
        } else if (face == 3) {
            // console.log(face, "朝右");
            return face;
        } else {
            throw "啊？"
        }
    },
    go: function(str) {
        var Li = document.getElementById('command_display_count').getElementsByTagName("li");
        switch (str) {
            case "GO":
                switch (face) {
                    case 0:
                        RobotBox.transTop();
                        break;
                    case 1:
                        RobotBox.transLeft();
                        break;
                    case 2:
                        RobotBox.transBottom();
                        break;
                    case 3:
                        RobotBox.transRight();
                        break;
                    default:
                        alert("???");
                        break;
                }
                break;
            case "TUN LEF":
                RobotBox.turnLeft();
                break;
            case "TUN RIG":
                RobotBox.turnRight();
                break;
            case "TUN BAC":
                RobotBox.turnBack();
                break;
            case "TRA LEF":
                RobotBox.transLeft()
                break;
            case "TRA TOP":
                RobotBox.transTop()
                break;
            case "TRA RIG":
                RobotBox.transRight()
                break;
            case "TRA BOT":
                RobotBox.transBottom();
                break;
            case "MOV LEF":
                RobotBox.moveLeft();
                break;
            case "MOV TOP":
                RobotBox.moveTop();
                break;
            case "MOV RIG":
                RobotBox.moveRight();
                break;
            case "MOV BOT":
                RobotBox.moveBottom();
                break;
            default: //处理错误的命令所对应的行数
                break;
        }
    },
    turnLeft: function() {
        face = face % 4;
        deg -= 90;
        robot.style.transform = "rotate(" + deg + "deg)";
        face++;
        RobotBox.face();
    },
    turnRight: function() {
        face = face % 4;
        deg += 90;
        robot.style.transform = "rotate(" + deg + "deg)";
        face += 3;
        RobotBox.face();
    },
    turnBack: function() {
        deg += 180;
        robot.style.transform = "rotate(" + deg + "deg)";
        face += 2;
        RobotBox.face();
    },
    transLeft: function() {
        setTimeout(function() {
            if (xPos > 50) {
                xPos -= 50;
                robot.style.left = xPos + 'px';
            }
        }, 20)
    },
    transTop: function() {
        setTimeout(function() {
            if (yPos > 50) {
                yPos -= 50;
                robot.style.top = yPos + 'px';
            }
        }, 20)
    },
    transRight: function() {
        setTimeout(function() {
            if (xPos < whInfo.height*whInfo.pos) {
                xPos += 50;
                robot.style.left = xPos + 'px';
            }
        }, 20)
    },
    transBottom: function() {
        setTimeout(function() {
            if (yPos < whInfo.width*whInfo.pos) {
                yPos += 50;
                robot.style.top = yPos + 'px';
            }
        }, 20)
    },
    moveLeft: function() {
        setTimeout(function () {
            if (face != 1) { //如果方向不同
                RobotBox.turnLeft();
                setTimeout(arguments.callee, 10);
            } else {
                setTimeout(RobotBox.transLeft, 500);
            };
        }, 10);
    },
    moveTop: function() {
        setTimeout(function () {
            if (face != 0) { //如果方向不同
                RobotBox.turnLeft();
                setTimeout(arguments.callee, 10);
            } else {
                setTimeout(RobotBox.transTop, 500);
            };
        }, 10);
    },
    moveRight: function() {
        setTimeout(function() {
            if (face != 3) { //如果方向不同
                RobotBox.turnLeft();
                setTimeout(arguments.callee, 10);//运用链式达到Interval的效果，arguments.callee的用法参考《高程设计》P611
            } else {
                setTimeout(RobotBox.transRight, 500);
            }
        },10)
        
    },
    moveBottom: function() {
        setTimeout(function() {
            if (face != 2) { //如果方向不同
                RobotBox.turnLeft();
                setTimeout(arguments.callee, 10);
            } else {
                setTimeout(RobotBox.transBottom, 500);
            };
        }, 10);
    },
}

/***********************************输入框区域的函数********************************/


//执行按钮   
function render() {
    var inputArr = enhanceCommand('MOV RIG 1 \ntra RIG 8\nmov bot 1\nmov lef 9\nmov bot 1\nmov rig 9\nmov bot1\nmov lef 9\nmov bot1\nmov rig 9');
    var x = 0;
    (function bigLoop() {
        if (x < inputArr.length) {
            var times = "";
            if (inputArr[x].slice(0, 2).toUpperCase() == "GO") {
                conmmand_input = "GO";
                times = inputArr[x].slice(3) ? Number(inputArr[x].slice(3)) : 1;
            } else if (inputArr[x] == "") {
                conmmand_input = "blank";
                times = 1;
            } else {
                conmmand_input = inputArr[x].slice(0, 7);
                times = inputArr[x].slice(8) ? Number(inputArr[x].slice(8)) : 1;
            }

            if (isNaN(times)) { alert("次数输入有误，请规范书写！"); }
            var i = 0;

            function finalLoop() {
                if (i < times) {
                    RobotBox.go(conmmand_input.toUpperCase())
                    setTimeout(finalLoop, 500);
                    i++;
                } else {
                    x++;
                    setTimeout(bigLoop, 500);
                }
            }
            finalLoop();
        }
    })()
}

// document.getElementById('clean_buttun').addEventListener("click", function() {
//     command_input.value = "";
// }, false);
// document.getElementById("refresh_button").addEventListener("click",function(){location.reload()},false)
// cmd_btn.addEventListener("click", render, false);
// document.getElementById("startDraw").onclick = function(){
    // var speed = document.getElementById("setSpeed").value||200;
    // var degree = document.getElementById("setNum").value||10;
    // draw(5,Number(speed));
// }

function getBlankTd(speed){
    var temptemp = document.getElementsByTagName("td");
    var i;
    var count =0;
    var needArr = [];
    for(i=0,len=temptemp.length;i<len;i++){

        if(temptemp[i].className==""){
            needArr.push(temptemp[i])
        }
    }
    setStyle(needArr,speed);
    console.log(speed)
}

function setStyle(arr,speed){
    var x=0;
    var myTimeout = setTimeout(function(){
        if(x>arr.length-1){
            clearTimeout(myTimeout);
            return
        }
        arr[x].style.visibility = "hidden";

        x++;
        setTimeout(arguments.callee,speed);
        console.log(speed)
    },speed)
}

/**画图*/

function draw(piece,speed){
    var canvas = document.createElement("canvas");
    canvas.style.top =whInfo.pos+"px";
    canvas.style.left = whInfo.pos +"px";
    if(canvas.getContext){
        var context = canvas.getContext("2d");

        var image = document.getElementById("uploadIMG");

        canvas.width = whInfo.height*whInfo.pos;
        canvas.height =whInfo.width*whInfo.pos;
        document.getElementById("wrap").appendChild(canvas);

        context.drawImage(image,0,0);

        var tempW = image.width/piece;//除以10就是每个单元格的像素
        var tempH = image.height/piece;
        var tempArr = [];
        
        var imageData = context.getImageData(0,0,image.width,image.height);
        var data = imageData.data;

        var newArr = [];

        var picWidth = image.width;
        for(var x=2;x<image.width;x+=piece){
            for(var y=2;y<image.height;y+=piece){
                var firstPix = coor(x,y,picWidth);
                var secondPix = coor(x,y,picWidth)+1;
                var thirdPix = coor(x,y,picWidth)+2;
                var fouthPix = coor(x,y,picWidth)+3;

                newArr.push({
                    "red":data[firstPix],
                    "green":data[secondPix],
                    "blue":data[thirdPix],
                    "alpha":data[fouthPix]
                })
            }
        }
        var myCount =0;
        for(var x=0;x<image.width;x+=piece){
            for(var y=0;y<image.height;y+=piece){
                var color = "rgb("+newArr[myCount]["red"]+","+newArr[myCount]["green"]+","+newArr[myCount]["blue"]+")";
                context.fillStyle= color;
                context.fillRect(x,y,piece,piece);
                context.fill();
                myCount++;
            }
        }
        getBlankTd(speed);
        console.log(speed)
    }
}

function coor (x,y,picWidth){//后面的乘4忘了，嫩是让我纠结了半天
    return (picWidth*y+x)*4
}



function createObjectURL(blob){
    if (window.URL){
        return window.URL.createObjectURL(blob);
    } else if (window.webkitURL){
        return window.webkitURL.createObjectURL(blob);
    } else {
        return null;
    }
}
document.getElementById('file-input').addEventListener("change",function(){
    var files = event.target.files
    console.log(files)
    // var reader = new FileReader();
    var Url = createObjectURL(files[0]);
    console.log(Url)
    
    // reader.readAsDataURL(files[0])
    if(Url){
        if(/image/.test(files[0].type)){
            document.getElementById('preView').innerHTML = "<img id='uploadIMG' src="+Url +"\>";
        }else{
            alert("请上传图片")
        }
    }else{
        document.getElementById('preView').innerHTML = "该浏览器不支持object URLs,请更换浏览器再尝试。"
    }
},false)