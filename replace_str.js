var mongoose = require("mongoose");
var request = require("request");
var _ = require("lodash");

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

// schema
var List = mongoose.model("List", listSchema);

var toReplace = [
    {
        from: "서울",
        to: "서울특별시"
    },
    {
        from: "부산",
        to: "부산광역시"
    },
    {
        from: "대구",
        to: "대구광역시"
    },
    {
        from: "인천",
        to: "인천광역시"
    },
    {
        from: "광주",
        to: "광주광역시"
    },
    {
        from: "대전",
        to: "대전광역시"
    },
    {
        from: "울산",
        to: "울산광역시"
    },
    {
        from: "경기",
        to: "경기도"
    },
    {
        from: "강원",
        to: "강원도"
    },
    {
        from: "충북",
        to: "충청북도"
    },
    {
        from: "충남",
        to: "충청남도"
    },
    {
        from: "경북",
        to: "경상북도"
    },
    {
        from: "경남",
        to: "경상남도"
    },
    {
        from: "전북",
        to: "전라북도"
    },
    {
        from: "전남",
        to: "전라남도"
    },]

async function update_sido(){
    for(var count = 0; count < toReplace.length; count++){
        var list = await List.find({addr1: toReplace[count].from});

        for(var i = 0; i < list.length; i++){
            list[i].addr1 = toReplace[count].to;
            console.log(list.length + " : " + i);
            const temp = await List.updateOne({_id: list[i]._id}, list[i]);
        }
    }
    db.close();
}

db.once("open", () => {
    console.log("Connected DB!");
    update_sido();
});

function delay(ms) {
    return new Promise((r) => 
        setTimeout(r, ms));
}

// const result = await Event.update({ _id: req.params.id}, req.query);



