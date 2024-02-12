// ==UserScript==
// @name         BiliBili首页视频过滤
// @namespace    http://tampermonkey.net/
// @version      2024-02-11
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

let dontWantLookList = ["吕德华","搞笑", "王者荣耀", "原神", "CF", "动漫","动画","动画短片","影视","国漫","混剪","废柴","一口气","辛普森","重生","精彩操作","虚拟偶像"];

let isLoad;

window.onmousewheel = document.onmousewheel = () => {
    window.setTimeout(()=>{
        dontWantToSee(".bili-video-card__wrap");
        undisplay(".bili-live-card");
        undisplay(".floor-single-card");
        //console.log("滚轮事件");
        undisplay(".header-channel");
    },1000);
}

window.onload = function () {
    //console.log("你好");
    //alert("页面加载完成！");
    let head = document.querySelector("#bili-header-container");
    if (head !== null) {
        head = head.querySelector(".left-entry");
    } else {
        head = document.querySelector(".bili-header__bar").querySelector(".left-entry");
    }
    if(!window.location.href.includes("www.bilibili.com/video/")){
        head.innerHTML = "<div>他说风雨中这点痛算什么，擦干泪，不要怕，至少我们还有梦</div>";
    }
    let foot = document.querySelector(".bili-footer");
    if (foot !== null) {
        foot.innerHTML = "<div></div>";
    }

    dontWantToSee(".feed-card");

    undisplay(".bili-live-card");
    undisplay(".floor-single-card");
    undisplay(".header-channel");

    isLoad = true;
}

function setCard(element){
    element.innerHTML = "<div>不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看不准看</div>";
}

function dontWantToSee(params) {
    let card_link = getCards(params);
    for (let i = 0; i < card_link.length; i++) {
        // console.log(getVideoTags(card_link[index].id));
        if (card_link[i] === null ||
            card_link[i] === undefined
           ) {
            continue;
        }
        getVideoTags(card_link[i].id, (res) => {
            //console.log(res);
            for (let j = 0; j < res.length; j++) {
                for (let k = 0; k < dontWantLookList.length; k++) {
                    if (res[j].includes(dontWantLookList[k])) {
                        setCard(card_link[i].card);
                        //console.log(res[j]);
                    }
                }
            }
        });
    }
}

function undisplay(element) {
    let cards_box = document.querySelectorAll(element);
    for (let k = 0; k < cards_box.length; k++) {
        let element = cards_box[k];
        setCard(element);
    }
}

function getVideoTags(id, callback) {
    let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
    httpRequest.open('GET', 'https://api.bilibili.com/x/tag/archive/tags?bvid=' + id, true);//第二步：打开连接  将请求参数写在url中  ps:"http://localhost:8080/rest/xxx"
    httpRequest.send();//第三步：发送请求  将请求参数写在URL中
    /**
    * 获取数据后的处理程序
    */
    let tags = [];
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            let json = JSON.parse(httpRequest.responseText);//获取到json字符串，还需解析
            //console.log(json);
            if (json === null ||
                json.data === null ||
                json.data === undefined
               ){
                return;
            }
            for (let i = 0; i < json.data.length; i++) {
                tags[i] = json.data[i].tag_name;
            }
        }
        callback(tags);
    };
}

function getCards(params) {
    let cards_box = document.querySelectorAll(params);
    let card_link = [];
    //console.log(card_link.length);
    for (let index = 0; index < cards_box.length; index++) {
        if (cards_box[index].querySelector("a") === null) continue;
        let link = cards_box[index].querySelector("a").href;
        let arr = link.split("/");
        let id = arr[arr.length - 1];
        if (!id.includes("BV")) continue;
        card_link[index] = {};
        card_link[index].id = id;
        card_link[index].card = cards_box[index];
    }
    return card_link;
}
