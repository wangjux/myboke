var express = require('express')
var Web = require('./fristpage').Web
var Hot = require('./fristpage').Hot
var WebFront = require('./fristpage').WebFront
var Random = require('./fristpage').Random
var Inter = require('./fristpage').Inter
var Speak = require('./fristpage').Speak
var Comments = require('./fristpage').Comments
var Mylife = require('./fristpage').Mylife
var Other = require('./fristpage').Other
var Html = require('./fristpage').Html
var Css = require('./fristpage').Css
var Javascript = require('./fristpage').Javascript
//上传图片引入的第三方
var formidable = require('formidable')
//时间模块
var sd = require('silly-datetime')
//文件模块
var fs = require('fs')
//路径模块
var path = require('path')
//调用api中的函数
var UpImg = require('./api').UpImg
// 上传图片存放路径，注意在本项目public文件夹下面新建ratation文件夹
var RATATION_UPLOAD_FOLDER = '/ratation/'
var WEB_UPLOAD_FOLDER = '/webfront/'
var INTER_UPLOAD_FOLDER = '/inter/'
var SPEAK_UPLOAD_FOLDER = '/speak/'
var COMMENTS_UPLOAD_FOLDER = '/comments/'
var MYLIFE_UPLOAD_FOLDER = '/mylife/'
var OTHER_UPLOAD_FOLDER = '/other/'
var HTML_UPLOAD_FOLDER = '/html/'
var CSS_UPLOAD_FOLDER = '/css/'
var JAVASCRIPT_UPLOAD_FOLDER = '/javascript/'

const router = express.Router()

//轮播图数据
router.get('/',(req,res) =>{
    Web.find((err,data)=>{
        if(err){
            return res.status(500).send('error')
        }
        return res.json({
            status:200,
            ratation:data
        })
    }) 
})
//获取今日热点的数据
router.get('/hot',(req,res)=>{
    Hot.find((err,data)=>{
        if(err){
            return res.status(500).send('error')
        }
        return res.json({
            status:200,
            hot:data
        })
    })
})
//获取WEB前端的数据
router.get('/webfronts',(req,res)=>{
    WebFront.find((err,data)=>{
        if(err){
            return res.status(500).send('error')
        }
        return res.json({
            status:200,
            webfront:data
        })
    })
})
//获取随机热文的数据
router.get('/random',(req,res)=>{
    Random.find((err,data)=>{
        if(err){
            return res.status(500).send('error')
        }
        return res.json({
            status:200,
            random:data
        })
    })
})

//获取畅想互联网数据
router.get('/inters',(req,res)=>{
    Inter.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            inter:data
        })
    })
})

//获取随便说点数据
router.get('/speaks',(req,res)=>{
    Speak.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            speak:data
        })
    })
})

//mylife数据
router.get('/mylifes',(req,res)=>{
    Mylife.find((err,data) =>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            mylife:data
        })
    })
})

//获取最新评论数据
router.get('/comment',(req,res)=>{
    Comments.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            comments:data
        })
    })
})

//其它页面数据
router.get('/others',(req,res)=>{
    Other.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            other:data
        })
    })
})

//html
router.get('/htmls',(req,res)=>{
    Html.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            html:data
        })
    })
})

//css
router.get('/csses',(req,res)=>{
    Css.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            css:data
        })
    })
})

//javascript
router.get('/javascripts',(req,res)=>{
    Javascript.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        return res.json({
            status:200,
            javascript:data
        })
    })
})

//上传图片
router.post('/upimg',(req,res,next)=>{
        UpImg(req,res,next)
})

//上传今日热点数据
router.post('/hot',(req,res)=>{
    new Hot(req.body).save((err,data) =>{
        if(err){
            return res.status(500).send('error')
        }
        return res.json({
            status:200,
            result:data
        })
    })
})

//上传web前端数据
router.post('/webfront',(req,res)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + WEB_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    //解析form
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(500).send(err)
        }
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + WEB_UPLOAD_FOLDER + newname

        //放进模板
        const webfront = new WebFront({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            //观看人数
            look:body.look,
            //点赞人数
            nice:body.nice
        })
        
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        webfront.save((err,data)=>{
            console.log(data)
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                result:data
            })
        })
    })
})

//上传随机热文数据
router.post('/random',(req,res)=>{
    console.log(req)
    new Random(req.body).save((err,data) =>{
        if(err){
            return res.status(500).send('error')
        }
        return res.json({
            status:200,
            result:data
        })
    })
})

//上传畅想互联网数据
router.post('/inter',(req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + INTER_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + INTER_UPLOAD_FOLDER + newname

        //放进模板
        const inter = new Inter({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            //观看人数
            look:body.look,
            //点赞人数
            nice:body.nice
        })
        
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        inter.save((err,data)=>{
            console.log(data)
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                result:data
            })
        })
    })
})

//上传随便说点数据
router.post('/speak',(req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + SPEAK_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + SPEAK_UPLOAD_FOLDER + newname

        //放进模板
        const speak = new Speak({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            //观看人数
            look:body.look,
            //点赞人数
            nice:body.nice
        })
        
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('上传成功')
        })
        speak.save((err,data)=>{
            console.log(data)
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                speak:data
            })
        })
    })
})

//评论区
router.post('/comments',(req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + COMMENTS_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        var extName = ''
        switch (files.header_image.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + COMMENTS_UPLOAD_FOLDER + newname

        //放进模板
        const comments = new Comments({
            //图片名称
            name:body.name,
            //图片地址
            header_image: imgpath,
            //文章
            context:body.context
        })
        
        fs.rename(files.header_image.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        comments.save((err,data)=>{
            console.log(data)
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                comments:data
            })
        })
    })
})

//MYLIFE
router.post('/mylife',(req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + MYLIFE_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        console.log(files)
        console.log(fields)
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + MYLIFE_UPLOAD_FOLDER + newname

        //放进模板
        const mylife = new Mylife({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            look:body.look,
            nice:body.nice
        })
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        mylife.save((err,data)=>{
            console.log(data)
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                mylife:data
            })
        })
    })
})

//其他
router.post('/other',(req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + OTHER_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + OTHER_UPLOAD_FOLDER + newname

        //放进模板
        const other = new Other({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            look:body.look,
            nice:body.nice
        })
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('上传成功')
        })
        other.save((err,data)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                other:data
            })
        })
    })
})

//htmls
router.post('/htmls',(req,res,next)=>{
    console.log(req)
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + HTML_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + HTML_UPLOAD_FOLDER + newname

        //放进模板
        const html = new Html({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            look:body.look,
            nice:body.nice
        })
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        html.save((err,data)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                html:data
            })
        })
    })
})

//css
router.post('/csses',(req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + CSS_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + CSS_UPLOAD_FOLDER + newname

        //放进模板
        const css = new Css({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            look:body.look,
            nice:body.nice
        })
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        css.save((err,data)=>{
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                css:data
            })
        })
    })
})

//javascript
router.post('/javascripts',(req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + JAVASCRIPT_UPLOAD_FOLDER //上传路径
    form.keepExtensions = true //保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + JAVASCRIPT_UPLOAD_FOLDER + newname

        //放进模板
        const javascript = new Javascript({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //文章
            context:body.context,
            look:body.look,
            nice:body.nice
        })
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        javascript.save((err,data)=>{
            console.log(data)
            if(err){
                return res.status(500).send(err)
            }
            return res.json({
                status:200,
                javascript:data
            })
        })
    })
})

//修改mylife
router.post('/edit',(req,res,next)=>{
    // console.log(req.body)
    if(req.body){
        Mylife.updateOne({_id:req.body._id},{title:req.body.title,context:req.body.context},(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            return
        })
    }
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + MYLIFE_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(500).send(err)
        }
        let body = fields
        console.log(files)
        console.log(fields)
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + MYLIFE_UPLOAD_FOLDER + newname

        //删除图片
        var name = path.basename(body.url)
        fs.unlink('./public/mylife/'+name,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('删除了')
        })
        //更换路径
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        //更新数据
        Mylife.updateOne({_id:body.id},
            {image_url:imgpath,title:body.title,context:body.context},(err)=>{
            if(err){
                console.log(err)
            }
            return
        })
    })
})

//修改other
router.post('/editother',(req,res,next)=>{
    // console.log(req.body)
    if(req.body){
        Other.updateOne({_id:req.body._id},{title:req.body.title,context:req.body.context},(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            return
        })
    }
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + OTHER_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(500).send(err)
        }
        let body = fields
        console.log(files)
        console.log(fields)
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + OTHER_UPLOAD_FOLDER + newname

        //删除图片
        var name = path.basename(body.url)
        fs.unlink('./public/mylife/'+name,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('删除了')
        })
        //更换路径
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        //更新数据
        Other.updateOne({_id:body.id},
            {image_url:imgpath,title:body.title,context:body.context},(err)=>{
            if(err){
                console.log(err)
            }
            return
        })
    })
})

//修改webfront
router.post('/editwebfront',(req,res,next)=>{
    // console.log(req.body)
    if(req.body){
        WebFront.updateOne({_id:req.body._id},{title:req.body.title,context:req.body.context},(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            return
        })
    }
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + WEB_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(500).send(err)
        }
        let body = fields
        console.log(files)
        console.log(fields)
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + WEB_UPLOAD_FOLDER + newname

        //删除图片
        var name = path.basename(body.url)
        fs.unlink('./public/mylife/'+name,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('删除了')
        })
        //更换路径
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        //更新数据
        WebFront.updateOne({_id:body.id},
            {image_url:imgpath,title:body.title,context:body.context},(err)=>{
            if(err){
                console.log(err)
            }
            return
        })
    })
})

//修改inter
router.post('/editinter',(req,res,next)=>{
    // console.log(req.body)
    if(req.body){
        Inter.updateOne({_id:req.body._id},{title:req.body.title,context:req.body.context},(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            return
        })
    }
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + INTER_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(500).send(err)
        }
        let body = fields
        console.log(files)
        console.log(fields)
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + INTER_UPLOAD_FOLDER + newname

        //删除图片
        var name = path.basename(body.url)
        fs.unlink('./public/mylife/'+name,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('删除了')
        })
        //更换路径
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        //更新数据
        Inter.updateOne({_id:body.id},
            {image_url:imgpath,title:body.title,context:body.context},(err)=>{
            if(err){
                console.log(err)
            }
            return
        })
    })
})

//修改speak
router.post('/editspeak',(req,res,next)=>{
    // console.log(req.body)
    if(req.body){
        Speak.updateOne({_id:req.body._id},{title:req.body.title,context:req.body.context},(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            return
        })
    }
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + SPEAK_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(500).send(err)
        }
        let body = fields
        console.log(files)
        console.log(fields)
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + SPEAK_UPLOAD_FOLDER + newname

        //删除图片
        var name = path.basename(body.url)
        fs.unlink('./public/mylife/'+name,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('删除了')
        })
        //更换路径
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        //更新数据
        Speak.updateOne({_id:body.id},
            {image_url:imgpath,title:body.title,context:body.context},(err)=>{
            if(err){
                console.log(err)
            }
            return
        })
    })
})

//修改ratation
router.post('/editratation',(req,res,next)=>{
    // console.log(req.body)
    if(req.body){
        Web.updateOne({_id:req.body._id},{title:req.body.title,context:req.body.context},(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            return
        })
    }
    const form = new formidable.IncomingForm()
    form.uploadDir = 'public' + RATATION_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(500).send(err)
        }
        let body = fields
        console.log(files)
        console.log(fields)
        var extName = ''
        switch (files.image_url.type) {
            case 'image/pjpeg':
                extName = 'jpg'
                break;
            case 'image/jpeg':
                extName = 'jpg'
                break;
            case 'image/png':
                extName = 'png'
                break;
            case 'image/x-png':
                extName = 'png'
                break;
        }
        if (extName.length == 0) {
            return res.json({
                code: 404,
                result: "只支持png和jpg格式图片"
            })
        }
        //使用第三方时间模块
        var t = sd.format(new Date(),'YYYYMMDDHHmmss')
        //生成随机数
        var ran = parseInt(Math.random()*8999+10000)
        //生成新图片名称
        var newname = t + '_' + ran + '.' + extName 
        //新图片路径
        var newpath = form.uploadDir + newname
        //设置上传到数据库的图片地址
        var imgpath = 'http://127.0.0.1:2020' + RATATION_UPLOAD_FOLDER + newname

        //删除图片
        var name = path.basename(body.url)
        fs.unlink('./public/ratation/'+name,(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            console.log('删除了')
        })
        //更换路径
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        //更新数据
        Web.updateOne({_id:body.id},
            {image_url:imgpath,title:body.title,context:body.context},(err)=>{
            if(err){
                console.log(err)
            }
            return
        })
    })
})

//删除mylife
router.post('/delet',(req,res)=>{
    console.log(req.body.image_url)
    let name = path.basename(req.body.image_url)
    console.log(name)
    Mylife.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }else{
            fs.unlink('./public/mylife/'+name,(err)=>{
                if(err){
                    console.log('删除失败')
                }
                else{
                    console.log('删除成功')
                }
            })
        }
    })
})

//删除webfront
router.post('/deletwebfront',(req,res)=>{
    console.log(req.body.image_url)
    let name = path.basename(req.body.image_url)
    console.log(name)
    WebFront.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }else{
            fs.unlink('./public/webfront/'+name,(err)=>{
                if(err){
                    console.log('删除失败')
                }
                else{
                    console.log('删除成功')
                }
            })
        }
    })
})

//删除inter
router.post('/deletinter',(req,res)=>{
    console.log(req.body.image_url)
    let name = path.basename(req.body.image_url)
    console.log(name)
    Inter.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }else{
            fs.unlink('./public/inter/'+name,(err)=>{
                if(err){
                    console.log('删除失败')
                }
                else{
                    console.log('删除成功')
                }
            })
        }
    })
})

//删除speak
router.post('/deletspeak',(req,res)=>{
    console.log(req.body.image_url)
    let name = path.basename(req.body.image_url)
    console.log(name)
    Speak.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }else{
            fs.unlink('./public/speak/'+name,(err)=>{
                if(err){
                    console.log('删除失败')
                }
                else{
                    console.log('删除成功')
                }
            })
        }
    })
})

//other删除
router.post('/deletother',(req,res)=>{
    console.log(req.body.image_url)
    let name = path.basename(req.body.image_url)
    console.log(name)
    Other.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }else{
            fs.unlink('./public/other/'+name,(err)=>{
                if(err){
                    console.log('删除失败')
                }
                else{
                    console.log('删除成功')
                }
            })
        }
    })
})

//ratation删除
router.post('/deletratation',(req,res)=>{
    console.log(req.body.image_url)
    let name = path.basename(req.body.image_url)
    console.log(name)
    Web.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }else{
            fs.unlink('./public/ratation/'+name,(err)=>{
                if(err){
                    console.log('删除失败')
                }
                else{
                    console.log('删除成功')
                }
            })
        }
    })
})

//hot删除
router.post('/delethot',(req,res)=>{
    Hot.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }
            console.log('删除成功')
    })
})

//random删除
router.post('/deletrandom',(req,res)=>{
    Random.findByIdAndRemove(req.body._id,(err)=>{
        if(err){
            console.log('删除失败')
        }
            console.log('删除成功')
    })
})

//修改hot
router.post('/edithot',(req,res,next)=>{
        Hot.updateOne({_id:req.body._id},{hot_heat:req.body.hot_heat,hot_title:req.body.hot_title,hot_context:req.body.hot_context},(err)=>{
            if(err){
                return res.status(500).send(err)
            }
            return
        })
})

//修改random
router.post('/editrandom',(req,res,next)=>{
    Random.updateOne({_id:req.body._id},{title:req.body.title,context:req.body.context},(err)=>{
        if(err){
            return res.status(500).send(err)
        }
        return
    })
})

module.exports = router