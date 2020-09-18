var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')


app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

mongoose.connect('mongodb://localhost/myboke',{useNewUrlParser:true,useUnifiedTopology:true})

mongoose.connection.on('open',()=>{
    console.log('数据库连接成功！')
})
mongoose.connection.on('error',(err)=>{
    throw err
})

var WebSchema = mongoose.Schema({
    title:{type:String,required:true},
    image_url:{type:String,required:true},
    context:{type:String,required:true},
})

var HotSchema = mongoose.Schema({
    hot_heat:{type:String,required:true},
    hot_title:{type:String,required:true},
    hot_context:{type:String,required:true}
})

var WebFront = mongoose.Schema({
    title:{type:String,required:true},
    image_url:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var Random = mongoose.Schema({
    title:{type:String,required:true},
    context:{type:String,required:true}
})

var InterSchema = mongoose.Schema({
    image_url:{type:String,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var SpeakSchema = mongoose.Schema({
    image_url:{type:String,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var CommentsSchema = mongoose.Schema({
    header_image:{type:String,required:true},
    name:{type:String,required:true},
    context:{type:String,required:true}
})

var MylifeSchema = mongoose.Schema({
    image_url:{type:String,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var OtherSchema = mongoose.Schema({
    image_url:{type:String,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var HtmlSchema = mongoose.Schema({
    image_url:{type:String,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var CssSchema = mongoose.Schema({
    image_url:{type:String,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var JavascriptSchema = mongoose.Schema({
    image_url:{type:String,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    look:{type:Number,required:false,default:1},
    nice:{type:Number,required:false,default:1}
})

var Web = mongoose.model('Web',WebSchema)
var Hot = mongoose.model('Hot',HotSchema)
var WebFront = mongoose.model('WebFront',WebFront)
var Random = mongoose.model('Random',Random)
var Inter = mongoose.model('Inter',InterSchema)
var Speak = mongoose.model('Speak',SpeakSchema)
var Comments = mongoose.model('Comments',CommentsSchema)
var Mylife = mongoose.model('Mylife',MylifeSchema)
var Other = mongoose.model('Other',OtherSchema)
var Html = mongoose.model('Html',HtmlSchema)
var Css = mongoose.model('Css',CssSchema)
var Javascript = mongoose.model('javascript',JavascriptSchema)


module.exports = {
    Hot,
    Web,
    WebFront,
    Random,
    Inter,
    Speak,
    Comments,
    Mylife,
    Other,
    Html,
    Css,
    Javascript
}