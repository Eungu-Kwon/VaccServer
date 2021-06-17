const port = 42108;
var mongoose = require("mongoose");
var express = require("express");
var request = require("request");
var _ = require("lodash");
var sync_request = require("sync-request");

var juso_url = "https://dapi.kakao.com/v2/local/search/address.json";

mongoose.connect(
    "mongodb://root:ahqkdlf2@155.230.52.58:42112/admin",
    {
        useNewUrlParser: true,
        useUnifiedTopology:true
    }
);
const db = mongoose.connection;

const listSchema = mongoose.Schema({
    dywk: String,
    endTm: String,
    hldyYn: String,
    lunchEndTm: String,
    lunchSttTm: String,
    orgTlno: String,
    orgZipaddr: String,
    orgcd: String,
    orgnm: String,
    slrYmd: String,
    sttTm: String,
    roadAddr: String,
    hasAddr: Boolean,
    x: Number,
    y: Number
});

var options = {
    uri: "http://api.odcloud.kr/api/apnmOrg/v1/list",
    qs:{
      serviceKey: "6mUmVjTSN14UAMtK5zBGM3Ld3AIXZI1Jc+kNd+qSGrNW9YaHTtYnl964Muhe0Ki2ryg0TEkYQg/3TRjJXrC4GQ==",
      perPage: 100,
      page: 1
    }
};

// schema
var List = mongoose.model("List", listSchema);

db.once("open", () => {
    console.log("Connected DB!");
    get_data();
});

function delay(ms) {
    return new Promise((r) => 
        setTimeout(r, ms));
}

// ~ 153
async function get_data(){
    var b = true;
    while(b){
        request.get(options, async function(err, res, body){
            var obj = JSON.parse(body);
            pages = obj.totalCount / 100 + 1;
            console.log(obj.currentCount);
            obj.data.forEach(function(e){
                try{
                    e.hasAddr = false;
                    const list = List.create(e);
                } catch(err){
                    console.log(err);
                }
            }); 
            if(obj.currentCount != 100) b = false;
        });
        options.qs.page += 1;
        await delay(500);
    }
    db.close();
}


