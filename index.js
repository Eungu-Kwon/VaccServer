const port = 42108;
mongoose = require("mongoose");
express = require("express");
app = express();
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
});

// schema
var List = mongoose.model("List", listSchema);

db.once("open", () => {
    console.log("Connected DB!");
});

app.get("/list", async (req, res, next) => {
    try{
        var to = 0;
        if(req.query.start != undefined){
            to = req.query.start * 1;
        }
        var end = 10;
        if(req.query.count != undefined){
            end = req.query.count * 1;
        }
        delete req.query.start;
        delete req.query.count;
        req.query.hasAddr = true;
        const list = await List.find(req.query).skip(to).limit(end);
        
        var ret = {
            result: list
        }
        res.status(200).json(ret);
    } catch(err){
        console.log(err);
        next(err);
    }
});
/*
app.post("/list", async (req, res, next) => {
    try{
        const event = await Event.create(req.query);
        var ret = {
            result: event
        }
        res.status(201).json(ret);
        console.log(req.query);
    } catch(err){
        console.log(err);
        next(err);
    }
    
});

app.patch("/event/:id", async (req, res, next) => {
    try{
        const result = await Event.update({ _id: req.params.id}, req.query);
        res.json(result);
        console.log(req.query);
    } catch(err){
        console.log(err);
        next(err);
    }
    
});

app.delete("/event/:id", async (req, res, next) => {
    try{
        const result = await Event.remove({ _id: req.params.id});
        res.json(result);
        console.log(req.query);
    } catch(err){
        console.log(err);
        next(err);
    }
});
*/
app.listen(port, () => {
    console.log('The server has started!');
});