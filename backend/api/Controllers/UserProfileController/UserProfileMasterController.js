const multer          = require('multer')
const randomString    = require('crypto-random-string');
const path            = require('path')
const mongoose        = require('mongoose');
var batch             = require('batchflow');



const UserProfile = require('../../Models/Master/UserProfileMaster');
const UserData = require('../../Models/Master/UserDataMaster')

exports.uploadProfile = (req , res) =>{
    const userProfile = new UserProfile()
    const storage = multer.diskStorage({
        destination: './public/images' , 
        filename: function(req, file , cb){
            cb(null, randomString(10) + path.extname(file.originalname));
        }
    })

    const upload = multer({
        storage:storage
    }).single('myimage')

    upload(req, res, function (err,result) {
        if (err instanceof multer.MulterError) {
            console.log('1');
           return res.status(500).send('internal server error')
        } else if (err) {
            console.log('2');
            return res.status(415).send('internal server error')
        }
        console.log(req.file.path);
        userProfile.imgPath = req.file.path
        console.log(req.file.originalname);
        userProfile.imgName = req.file.filename
        console.log(req.file.filename);
        userProfile.save(function(err , result){
            if(err){
                res.status(500).send({message:"Internal server error"})
            }
            else {
                res.status(200).send({message:"Data saved successfully", data: result})
            }
        })
        // res.status(200).send({data:' file uploaded'})
      })
    // var fileinfo = req.file;
    // res.send(fileinfo);
};

exports.getProfileImage = (req, res) => {
    UserProfile.find({_id: mongoose.Types.ObjectId(req.body.userId)} , function(err , result){
        if(err){
            res.status(401).send({message:'internal server error'})
        }
        else{
           console.log(result);
           const data = []
           const temp ={}
           temp.imgPath = 'http://'+req.hostname +':4000/' +result[0].imgName
           temp.imgName = result[0].imgName
           data.push(temp)
            res.status(200).send(data)
        }
    })
}

exports.uploadimages = (req , res) =>{
   
    const storage = multer.diskStorage({
        destination: './public/images' , 
        filename: function(req, files , cb){
            cb(null, randomString(10) + path.extname(files.originalname));
        }
    })

    const upload = multer({
        storage:storage
    }).array('myimages', 4)

    upload(req, res, async function (err,result) {
        if (err instanceof multer.MulterError) {
            console.log('1');
           return res.status(500).send('internal server error')
        } else if (err) {
            console.log('2');
            return res.status(415).send('internal server error')
        }
        else if(req.files.length == 0){
           return res.send({message: 'please select atleast 1 file'})
        }
        else {
            console.log(req.files);
            const files = req.files
            const random = randomString(10)
            var Result = []
            batch(files).sequential()
            .each(function(i, item, next) {
                    console.log(item , 'item');
                    const userProfile = new UserProfile()
                    userProfile.uniqueId = random
                    userProfile.imgPath = item.path
                    userProfile.imgName = item.filename
                    userProfile.save(async function(err, result){
                        console.log(result , 'result');
                        Result.push(result)
                        console.log(Result , 'Result');
                        next()
                    })
                    
            }).end(function(results) {
                console.log('sending response');
                res.status(200).send({message:' files uploaded' , data : Result})
            });
            // files.map(data => {
            //     const userProfile = new UserProfile()
            //     userProfile.uniqueId = random
            //     userProfile.imgPath = data.path
            //     userProfile.imgName = data.filename
            //     userProfile.save(async function(err, result){
            //         console.log(result , 'result');
            //         Result.push(result)
            //         console.log(Result , 'Result');
            //     })
            // })
            // res.status(200).send({message:' files uploaded' , data : Result})
        }
      })
};

exports.getUploadedImages = (req , res) => {
    UserProfile.find({uniqueId:req.body.uniqueId} , function(err , result){
        if(err){
            res.status(401).send({message:'internal server error'})
        }
        else {
           console.log(result);
           const array = []
           result.map(data => {
                 const temp ={}
                 console.log(data.imgName , 'image name')
                temp.imgPath = 'http://'+req.hostname +':4000/' + data.imgName
                temp.imgName = data.imgName
                array.push(temp)
           })
           res.status(200).send(array)
        }
    })
}

exports.uploadMultipleImagesWithFields = (req,res) => {
    const storage = multer.diskStorage({
        destination: './public/images' , 
        filename: function(req, files , cb){
            cb(null, randomString(10) + path.extname(files.originalname));
        }
    })

    const upload = multer({storage:storage}).fields([
        { name : 'profileImage' , maxCount : 1},
        { name : 'aadharCard' , maxCount : 1},
        {name : 'panCard' , maxCount : 1}
    ])

    upload(req , res , async function(err , result){
        if (err instanceof multer.MulterError) {
            console.log('1');
           return res.status(500).send('internal server error')
        } else if (err) {
            console.log('2');
            return res.status(415).send('internal server error')
        }else{
            console.log(req.files['profileImage'][0]['path']);
            const userData = new UserData()
            userData.profileimgPath = req.files['profileImage'][0]['path']
            userData.profileimgName = req.files['profileImage'][0]['filename']
            userData.aadharCardimgPath = req.files['aadharCard'][0]['path']
            userData.aadharCardimgName = req.files['aadharCard'][0]['filename']
            userData.panCardimgPath = req.files['panCard'][0]['path']
            userData.panCardimgName = req.files['panCard'][0]['filename']
            userData.save(function(err , result){
                if(err){
                    res.status(500).send({message:"Internal server error"})
                }
                else {
                    res.status(200).send({message:"Data saved successfully", data: result})
                }
            })
        }
    })

}

exports.getMultipleImagesWithFields = (req, res) => {
    UserData.find({_id: mongoose.Types.ObjectId(req.body.userId)} , function(err , result){
        if(err){
            res.status(401).send({message:'internal server error'})
        }
        else{
           console.log(result);
           const data = []
           const temp ={}
           temp.profileimgPath = 'http://'+req.hostname +':4000/' +result[0].profileimgName
           temp.profileimgName = result[0].profileimgName
           temp.aadharCardimgPath = 'http://'+req.hostname +':4000/' +result[0].aadharCardimgName
           temp.aadharCardimgName = result[0].aadharCardimgName
           temp.panCardimgPath = 'http://'+req.hostname +':4000/' +result[0].panCardimgName
           temp.panCardimgName = result[0].panCardimgName
           data.push(temp)
            res.status(200).send({message: 'data retrived' , data : data})
        }
    })
}