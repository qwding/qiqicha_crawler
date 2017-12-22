'use strict';

const jsdom = require("jsdom/lib/old-api.js");
const fs = require("fs");
var jquery = fs.readFileSync("./jquery.js", "utf-8");
const URL = "http://www.qichacha.com/search?key="
const download = require('./excel.js')



function Search(key,callback) {
   	var url = URL+encodeURI(key)
    console.log("start....");
    jsdom.env({
        url: url,
        src: [jquery],
        headers: {
	    	'Cookie': ''
        },
        done: function(err, window) {
            if (err) {
                if ((callback) &&(typeof callback === "function")){
                    callback(err);
                }
            }
            var companys =[];
            let $ = window.$;
            var length = $(".ma_h1").length;
            console.log("Get ",length ,"company");
            $(".ma_h1").each(function(i,a) {
                companys.push(a.href);
            });
            if ((callback) &&(typeof callback === "function")){
                callback(null,companys)
            }
        }
    });
}


function getCompany(url,callback){
    console.log("getCompany .... ",url);
    jsdom.env({
        url: url,
        src: [jquery],
        done: function(err, window) {
            if (err) {
                console.log("Get commpany error:",url);
                return
            }
            // var company ={};
            var data = [];
            let $ = window.$;

            var name = $(".company-top-name").text();
            console.log("Getting :",name);
            data.push({key:"公司名称",value:name})


            var length = $(".ma_left").length;

            var metadate = [];
            $(".ma_left").each(function() {
                var tmp = $(this).text();
                // console.log("ma_left:",tmp);
                metadate.push(tmp.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
            });


            var length = metadate.length;
            if (length%2 == 1 ){
                metadate.pop();
            }
            // console.log("metadate length:",metadate.length);

            for (var i=0;i < metadate.length;i=i+2){
                // console.log("metadate:",metadate[i],metadate[i+1]);
                // company[metadate[i]] = metadate[i+1];
                var row = {key:metadate[i],
                            value:metadate[i+1]};
                data.push(row);
            }


            // console.log("company:",company);
            if ((callback) &&(typeof callback === "function")){
                callback(data,name)
            }
        }
    });
}

function fetchAll(key){
	Search(key,function(err,companys){
        if (err){
            console.log("Search error:",err);
            return
        }
        // console.log("companys:",companys);

        var res = [];

        companys.forEach(function(company){
            getCompany(company,function(data,name){
                // console.log("data:",data.length);
                download.download(data,name);
            });
        });


    })
}

var key = 'your company'
fetchAll(key);


