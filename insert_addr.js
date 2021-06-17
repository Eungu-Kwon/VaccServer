const port = 42108;
var mongoose = require("mongoose");
var express = require("express");
var request = require("request");
var _ = require("lodash");

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
    addr1: String,
    addr2: String,
    hasAddr: Boolean,
    x: Number,
    y: Number
});

var juso_options = {
	uri: juso_url,
	headers: {
		Authorization: 'KakaoAK f9985eac9f0c552c726d8be49cad53e6'
	},
	qs: {
		query: ""
	}
}
// schema
var List = mongoose.model("List", listSchema);

var count = 0;
var total_len = 0;
async function update_juso(e){
    var name = e.orgZipaddr.split(',')[0];

	juso_options.qs.query = name;

	request.get(juso_options, async function(err, res, body){
        count += 1;
        if(err) {
            console.log('error in request');
            return;
        }
        try{
            var obj = JSON.parse(body);
            if(obj.meta.total_count == 0) {
                return;
            }
            e.roadAddr = obj.documents[0].address_name;
            e.x = obj.documents[0].x;
            e.y = obj.documents[0].y;
            e.addr1 = obj.documents[0].address.region_1depth_name;
            e.addr2 = obj.documents[0].address.region_2depth_name.split(' ')[0];
            e.hasAddr = true;
            console.log(count + ": " + e.roadAddr);
            const list = await List.updateOne({_id: e._id}, e);
        } catch(err){
            console.log('error in try-catch');
            return;
        }
        //console.log(count + ": done");
        if(count == total_len) {
            db.close();
            console.log('DB closed');
        }
	});
}

db.once("open", () => {
    console.log("Connected DB!");
    update_data();
});

function delay(ms) {
    return new Promise((r) => 
        setTimeout(r, ms));
}

// const result = await Event.update({ _id: req.params.id}, req.query);

async function update_data(){
    var list = await List.find({});
    total_len = list.length;
    for(var i = 0; i < total_len; i++){
        update_juso(list[i]);
        //console.log(i + ": start");
        await delay(200);
    }
    //db.close();
}


