// 数据保存情况
let allData = [];
// 总共循环次数
let loopNum = 12;
// 中场休息时间,单位秒
let restTime = 30;
// 中场休息间隔次数
let restMaxNumber = 5;

// 每次按键的移动距离
// let step = 6;
let stepArry1 = [1,2,10,11];
let stepArry2 = [6,6,6,6];
// let stepArry2 = undefined;

// 时间延迟数组，单位ms
let delayArry = [0];
// let delayArry = [0,60,120,180,240,300,360,480];

// 方框大小
let squLength = 72;
// 中间方块大小
let squLength2 = 72;
// 阈值时间
let middleTime = 10;
let maxTime = 15;

// 四个角放得位置距离
let lengthX = 712;
let lengthY = 712;
// 小球大小
let cirLength = 12;

// 显示箭头时间，单位毫秒
let resultTime = 2000;
// 显示错误信息时间，单位毫秒
let errorTime = 1000;

// 移动小球后延迟显示时间,单位毫秒
let delayTime = 1000

let rand_num;
let nowTime;
let nowNum = 0;
let oneData = {
    keyCollect:[],//所有的按键操作
    disTime:0,//移动的时间差,单位秒
    index:0,//第几次做
    isRepeat: 'no',
};
var res;
let stepArry;
let nowdelay;//当前移动延迟时间。

// 计算随机出现得无关箭头
let randArry = [];
// 使用两种状态
let randArry2 = [];
// 重复出现不同的移动延迟
let delayRandArry = [];

function initArry() {
    // 生成条件组成的总数组
    randArry = [];
    for (let index = 0; index < delayArry.length; index++) {
        let element = [delayArry[index]];
        for (let index1 = 0; index1 < 2; index1++) {
            element[1] = index1;
            for (let index2 = 0; index2 < 3; index2++) {
                element[2] = index2;
                randArry.push(element.join(','));
            }
        }
    }

    // 随机排序数组;
    // 取所有index
    randArry2 = [];
    let indexRandArr = Array.from({length:randArry.length}).map((item,index)=>{return index});
    indexRandArr = indexRandArr.sort(function () { return Math.random() - 0.5; });
    let indexRandArr1= Array.from({length:loopNum}).map((item,index)=>{return indexRandArr[index%indexRandArr.length];});
    randArry2 = indexRandArr1.sort(function () { return Math.random() - 0.5; });


    // // 对应随机出现无关箭头
    // let tempnum = parseInt(loopNum/3);
    // randArry = [];
    // for (let index = 0; index < tempnum; index++) {
    //     let randnumber = parseInt(Math.random() * loopNum + 1);
    //     if (!randArry.includes(randnumber)) {
    //         randArry.push(randnumber);
    //     } else {
    //         index--;
    //     }              
    // }

    // // 对应两种状态第二个
    // let tempnum1 = parseInt(loopNum/2);
    // randArry2 = [];
    // for (let index = 0; index < tempnum1; index++) {
    //     let randnumber = parseInt(Math.random() * loopNum + 1);
    //     if (!randArry2.includes(randnumber)) {
    //         randArry2.push(randnumber);
    //     } else {
    //         index--;
    //     }              
    // }

    // // 随机初始化一个延迟数组
    // let indexArr= Array.from({length:loopNum}).map((item,index)=>{return index%delayArry.length;});
    // delayRandArry = indexArr.sort(function () { return Math.random() - 0.5; });
    // console.log(delayRandArry,'suijishuj');

    // console.log(randArry2);
    // 初始化各类样式
    $(".main_contain").css('width',`${lengthX}px`);
    $(".main_contain").css('height',`${lengthY}px`);
    $(".circle").css('width',`${cirLength}px`);
    $(".circle").css('height',`${cirLength}px`);
    $(".circle").css('margin-top',`-${cirLength/2}px`);
    $(".circle").css('margin-left',`-${cirLength/2}px`);
    $(".square1").css('width',`${squLength}px`);
    $(".square1").css('height',`${squLength}px`);
    $(".square2").css('width',`${squLength2}px`);
    $(".square2").css('height',`${squLength2}px`);
    $(".square2").css('margin-top',`-${squLength2/2}px`);
    $(".square2").css('margin-left',`-${squLength2/2}px`);
}
// 对4个框中随机一个变颜色
function changebac() {
    rand_num = parseInt(Math.random() * 4 + 0);
    $('.square1').css('background','none');
    $('.square1')[rand_num].style.background = "blue";
}

// 初始化函数
$(function(){
    //初始化一个随机矩阵展示无箭头图片
    initArry();
    keyDown();
    $("input:radio").click(function(){
        // debugger
        var strength = $(this).val();
        oneData.strength = strength;

        $(".main_contain").hide();
        $("#inone").hide();        
        allData.push(oneData);
        oneData = {
            keyCollect:[],//所有的按键操作
            disTime:0,//移动的时间差,单位秒
            index:0,//第几次做
            isRepeat: 'no',
        };
        $("#infoshow").show();
        let tempto1 = setTimeout(function(){
            $("#infoshow").hide(); 
            // $("#inone").show();
            keyDown();
            clearTimeout(tempto1);             
            if (!(nowNum<loopNum)) {
                $('#end_contain').show();
                handleDownload(allData,'result')
                console.log(allData);
                return;
            }  
            if (nowNum%restMaxNumber==0) {
                nowRest();
                return;
            }  
            // zjx
            // $(".enter_before").show();  
            reset();
        }, resultTime); 
               
    });
});
// 下载json文件
function handleDownload(content,name){
    // 下载保存json文件
    var eleLink = document.createElement("a");
    eleLink.download = name+'.json';
    eleLink.style.display = "none";
    // 字符内容转变成blob地址
    var data = JSON.stringify(content, undefined, 4);
    var blob = new Blob([data], { type: "text/json" });
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}

//  按键监听函数
function keyDown() {
    document.onkeyup = function (event) {
        if (($("#start_contain").css('display')!='none'|| $(".rest_info").css('display')!='none')) {
            if(event.key == 'q'){
                $("#start_contain").hide();
                $(".rest_info").hide();
                // zjx
                // $(".enter_before").show(); 
                reset();

                // $(".move_before").show();
                // setTimeout(()=>{
                //     $(".move_before").hide();
                //     $(".main_contain").show();
                // },500);        
                // timeReset();
                // changebac();
                // stepArry = stepArry1;
                // if (stepArry2!=undefined) {
                //     if (randArry2.includes(nowNum + 1)) {
                //         stepArry = stepArry2;            
                //     }
                // }
                return;
            }
            return;
        }else if ($(".main_contain").css('display')!='none') {
            let rand_test = parseInt(Math.random() * 4 + 0);
        
            // console.log(stepArry);
            switch(event.key) {
                case "ArrowLeft":
                    document.onkeyup = null;
                    oneData.keyCollect.push(event.key);
                    let temptime = setTimeout(()=>{
                        $("#movecir").css("left",`-=${stepArry[rand_test]}px`);
                        judgeNext();
                        clearTimeout(temptime);
                    },nowdelay); 
                    // $("#movecir").css("left",`-=${stepArry[rand_test]}px`);
                    break;
                case "ArrowUp":
                    document.onkeyup = null;
                    oneData.keyCollect.push(event.key);
                    let temptime1 = setTimeout(()=>{
                        $("#movecir").css("top",`-=${stepArry[rand_test]}px`);
                        judgeNext();
                        clearTimeout(temptime1);
                    },nowdelay);  
                    // $("#movecir").css("top",`-=${stepArry[rand_test]}px`);
                    break;
                case "ArrowRight":
                    document.onkeyup = null;
                    oneData.keyCollect.push(event.key);
                    let temptime2 = setTimeout(()=>{
                        $("#movecir").css("left",`+=${stepArry[rand_test]}px`);
                        judgeNext();
                        clearTimeout(temptime2);
                    },nowdelay);  
                    // $("#movecir").css("left",`+=${stepArry[rand_test]}px`);
                    break;
                case "ArrowDown":
                    document.onkeyup = null;
                    oneData.keyCollect.push(event.key);
                    let temptime3 = setTimeout(()=>{
                        $("#movecir").css("top",`+=${stepArry[rand_test]}px`);
                        judgeNext();
                        clearTimeout(temptime3);
                    },nowdelay); 
                    // $("#movecir").css("top",`+=${stepArry[rand_test]}px`);
                    break;
                default: break;
            }
            return;
        }else if ($('.enter_before').css('display')!='none') {
            if(event.key == 'Enter') {
                reset();
                return;
            }   
            return;
        }else{
            return;
        }
        
    }
};
function judgeNext() {
    keyDown();
    if(parseInt($("#movecir").css("top")) < squLength - cirLength/2 && parseInt($("#movecir").css("top")) > cirLength/2 
        && parseInt($("#movecir").css("left")) < squLength - cirLength/2  && parseInt($("#movecir").css("left")) > cirLength/2  && rand_num==0) {
        correctNext();
    }else if(parseInt($("#movecir").css("top")) < squLength - cirLength/2  && parseInt($("#movecir").css("top")) > cirLength/2  
        && parseInt($("#movecir").css("left")) > lengthX - squLength +cirLength/2  && parseInt($("#movecir").css("left")) < lengthX - cirLength/2  && rand_num==1){
        correctNext();
    }else if(parseInt($("#movecir").css("top")) > lengthY - squLength +cirLength/2  && parseInt($("#movecir").css("top")) < lengthY - cirLength/2  &&
        parseInt($("#movecir").css("left")) < squLength - cirLength/2  && parseInt($("#movecir").css("left")) > cirLength/2   && rand_num==2){
        correctNext();
    }else if(parseInt($("#movecir").css("top")) > lengthY - squLength +cirLength/2  && parseInt($("#movecir").css("top")) < lengthY - cirLength/2 
        &&  parseInt($("#movecir").css("left")) > lengthX - squLength +cirLength/2  && parseInt($("#movecir").css("left")) < lengthX - cirLength/2  && rand_num==3){
        correctNext();
    }
}
function timeReset() {
    clearInterval(res);
    let time = new Date();
    nowTime = time.getTime();
    let count = 1;
    res = setInterval(function(){
		count++;
        if (count > maxTime) {
            $(".main_contain").hide();
            $('.error_info').show();
            clearInterval(res);
            setTimeout(function(){
                $('.error_info').hide();
                oneData.isRepeat = 'yes';
                reset();
            }, errorTime);   
        }
	},1000);
}
function correctNext() {
    clearInterval(res);
    // sucessDelay = true;
    document.onkeyup = null;
    let time = new Date();
    let disTime = time.getTime() - nowTime;
    disTime = disTime/1000;
    oneData.disTime = disTime;
    $("#use_time").html(disTime);            
    nowNum = nowNum + 1;
    oneData.index = nowNum;
    oneData.stepArry = stepArry;
    // 比对情况
    // oneData.imageShow = disTime < middleTime ? 'up' : 'down';
    // if (randArry[randArry2[nowNum-1]].split(',')[2] == '1') {
    //     oneData.imageShow = 'middle';
    // }
    // 平均分布
    if (randArry[randArry2[nowNum-1]].split(',')[2] == '0') {
        oneData.imageShow = 'up';
    }else if (randArry[randArry2[nowNum-1]].split(',')[2] == '1') {
        oneData.imageShow = 'middle';
    }else if (randArry[randArry2[nowNum-1]].split(',')[2] == '2') {
        oneData.imageShow = 'down';
    }

    // console.log(disTime);
    let tempto = setTimeout(() => {
        $(".main_contain").hide();
        $("#inone").show();
        $(".image_time").hide();
        // 比对情况
        // if (randArry[randArry2[nowNum-1]].split(',')[2] == '1') {
        //     $(".image_time")[2].style.display='block';            
        // }else{
        //     let isshow = disTime < middleTime ? 0 : 1;
        //     $(".image_time")[isshow].style.display='block';
        // }   
        // 平均分布
        $(".image_time")[Number(randArry[randArry2[nowNum-1]].split(',')[2])].style.display='block';
            
        clearTimeout(tempto);    
        // let tempto1 = setTimeout(function(){
        //     $("#infoshow").hide(); 
        //     $("#inone").show();
        //     clearTimeout(tempto1); 
        //     // reset();
        // }, resultTime); 
    }, delayTime);
    
}
function reset() {
    document.onkeyup = null;
    $('.enter_before').hide();
    stepArry = stepArry1;
    if (stepArry2!=undefined) {
        if (randArry[randArry2[nowNum]].split(',')[1] == '1') {
            stepArry = stepArry2;            
        }
    }
    // let rand_test = Math.floor(Math.random() * delayArry.length + 0);
    // nowdelay = delayArry[rand_test];
    nowdelay = Number(randArry[randArry2[nowNum]].split(',')[0]);
    oneData.delayTime = nowdelay;
    // console.log(nowdelay);
    $(".move_before").show();
    setTimeout(()=>{
        $(".move_before").hide();
        $(".main_contain").show();
    },500);   
    changebac();
    $("#movecir").css("top",`${lengthY/2}px`);
    $("#movecir").css("left",`${lengthX/2}px`);
    $("#movecir").hide();
    $("input:radio").removeAttr("checked");
    let timeout2 = setTimeout(()=>{
        keyDown();
        $("#movecir").show();
        timeReset();
        clearTimeout(timeout2);
    },2000);
}
function nowRest() {
    $('.rest_info').show();
    // $('#rest_time').text(restTime);
    // let tempTime = restTime;
    // setTimeout(()=>{
    // let restime = setInterval(()=>{
    //     tempTime--;
    //     $('#rest_time').text(tempTime);
    //     if (tempTime==0) {
    //         $('.rest_info').hide();
    //         clearInterval(restime);
    //         reset();
    //     }
    // },1000) 
    // },restTime*1000)
    
}