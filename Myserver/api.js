// var express = require('express')
var Web = require('./fristpage').Web
//上传图片引入的第三方
var formidable = require('formidable')
//时间模块
var sd = require('silly-datetime')
var fs = require('fs')
// 上传图片存放路径，注意在本项目public文件夹下面新建ratation文件夹
var RATATION_UPLOAD_FOLDER = '/ratation/'

exports.UpImg = function(req,res,next){
    const form = new formidable.IncomingForm();
    form.uploadDir = 'public' + RATATION_UPLOAD_FOLDER//上传路径
    form.keepExtensions = true ;//保持文件扩展名
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(err)
        }
        let body = fields
        console.log(fields)
        console.log(files)
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
        //放进模板
        const web = new Web({
            //图片名称
            title:body.title,
            //图片地址
            image_url: imgpath,
            //图片链接
            context:body.context
        })
        fs.rename(files.image_url.path,newpath,(err)=>{
            if(err){
                next(err)
            }
            console.log('上传成功')
        })
        web.save((err,data) =>{
            if(err){
                return next(err)
            }
            return res.json({
                status:200,
                messege:'上传成功',
                result:data
            })
    })
})
}