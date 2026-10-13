const async           = require('async')
const { validationResult } = require("express-validator");
const mongoose        = require('mongoose')

const ChannelPartnerFamily = require('../../Models/Master/ChannelPartnerFamilyMaster')

exports.createChannelPartnerFamily = async function(request , response){ 
    const errors = validationResult(request);
    const extractedErrors = []
    const userArray = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 

    // const userArray =[]
    const {userId , channelPartnerFamilyName , channelPartnerFamilyDescription} = request.body

    var  channelPartnerFamilyCheck = await ChannelPartnerFamily.aggregate([
         
        {
           $addFields : {"channelPartnerFamilyNameLc": { $toLower: "$channelPartnerFamilyName" },"channelPartnerFamilyDescriptionLc": { $toLower:"$channelPartnerFamilyDescription" }}
        },
        {
           $match:{
                    isActive:true,
        
                    $or:[
                          { channelPartnerFamilyNameLc: channelPartnerFamilyName.toLowerCase()},
                          { channelPartnerFamilyDescriptionLc: channelPartnerFamilyDescription.toLowerCase()},
                       ]
                 }                
        },
     ]);
     console.log("channelPartnerFamilyCheck", Object.keys(channelPartnerFamilyCheck).length);
   
     if (Object.keys(channelPartnerFamilyCheck).length !== 0) 
     {
       return response.status(409).send(
          {
             status: 'FAILURE',
             message: 'Duplicate channelPartnerFamily entry found',
          }); 
     }

   const channelPartnerFamily = new ChannelPartnerFamily()  
   channelPartnerFamily.channelPartnerFamilyName = channelPartnerFamilyName
   channelPartnerFamily.channelPartnerFamilyDescription = channelPartnerFamilyDescription
   channelPartnerFamily.save(function(err , channelPartnerFamilyResult){
       if(err){
        response.status(500).send({message: 'internal server error'})     
       }
       else{
        userArray.push(channelPartnerFamilyResult)
        response.status(200).send(userArray)
       }
   })
}

exports.updateChannelPartnerFamily = async function(request , response){
    const errors = validationResult(request);
    const extractedErrors = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 
    const {userId , channelPartnerFamilyId, channelPartnerFamilyName , channelPartnerFamilyDescription , requestType } = request.body
    if(requestType ==="update"){
        var channelPartnerFamilyCheck = await ChannelPartnerFamily.aggregate([
            {
                $addFields : {'channelPartnerFamilyNameLc': { $toLower: '$channelPartnerFamilyName'}, 'channelPartnerFamilyDescriptionLc': {$toLower:'channelPartnerFamilyDescription'}}
            },
            {
                $match: {
                    isActive: true ,
                    _id:{$ne: mongoose.Types.ObjectId(channelPartnerFamilyId)},
                    $or: [
                        {channelPartnerFamilyNameLc: channelPartnerFamilyName.toLowerCase()},
                        {channelPartnerFamilyDescriptionLc: channelPartnerFamilyDescription.toLowerCase()}
                    ]
                }
            }
        ]);
        console.log('channelPartnerFamilyCheck' , Object.keys(channelPartnerFamilyCheck).length);
        if(Object.keys(channelPartnerFamilyCheck).length !== 0){
            return response.status(409).send(
                {
                    status: 'Failure',
                    message: 'Duplicate channelPartnerFamily entry found'
                })
        }
    }

    const model = await ChannelPartnerFamily.find({isActive:true ,_id:mongoose.Types.ObjectId(channelPartnerFamilyId)});
    if(requestType ==="activate"){
        model[0].isPublished = true
    }
    else if(requestType ==="deactivate"){
        model[0].isPublished = false
    }
    else if(requestType ==="update"){
        model[0].userId = userId
        model[0].channelPartnerFamilyName = channelPartnerFamilyName
        model[0].channelPartnerFamilyDescription = channelPartnerFamilyDescription
    }
    else {
        return response.status(422).json({
            status: 'FAILURE',
            message: ['Invalid requestType']
        })
    }

    model[0].save(function(err , saveChannelPartnerFamilyDetails){
        if(err){
            return response.status(500).send({
                status: 'Failure',
                message: 'internal server error',
                err : err
            })
        }

        return response.status(200).send({
            status:'success',
            message: 'ChannelPartnerFamily Data updated successfully',
            data: saveChannelPartnerFamilyDetails
        })
    })
}

exports.getAllChannelPartnerFamily = async function(request, response){
            
    const errors = validationResult(request);
    const extractedErrors = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 
    const{userId,page, limit, requestType, isPublished, searchValue, sortingType, sortingAction}=request.body
    if(requestType === 'search'){
        var query = ChannelPartnerFamily.aggregate([
            {
                $addFields : {"channelPartnerFamilyNameLc": { $toLower: "$channelPartnerFamilyName" },"channelPartnerFamilyDescriptionLc": { $toLower:"$channelPartnerFamilyDescription" }}
             },
             {
                $match:{
                         isActive:true,
             
                         $or:[
                               { channelPartnerFamilyNameLc:searchValue.toLowerCase()},
                               { channelPartnerFamilyDescriptionLc:searchValue.toLowerCase() }, 
                               { channelPartnerFamilyNameLc:{$regex: new RegExp(searchValue.toLowerCase())} }, 
                               { channelPartnerFamilyDescriptionLc:{$regex: new RegExp(searchValue.toLowerCase())} }, 
                            ]
                      }                
             },
             {
                $addFields : {"channelPartnerFamilyId": "$_id"}
             },
             {
                $project:{ updatedAt:0, _id:0, __v:0, channelPartnerFamilyNameLc:0, channelPartnerFamilyDescriptionLc:0}
             } 
        ])
    }
    if(requestType === "default")
    {
       if(isPublished === "true")
       {
          var query = ChannelPartnerFamily.aggregate([
             {
                $match:{isActive:true, isPublished:true}
             },
             {
                $addFields : {"channelPartnerFamilyId": "$_id"}
    
             },
             {
                $project:{ updatedAt:0, __v:0}
             }
          ]);
       }
       else
       {
          var query = ChannelPartnerFamily.aggregate([
             {
                $match:{isActive:true}
             },
             {
                $addFields : {"channelPartnerFamilyId": "$_id"}
    
             },
             {
                $project:{ updatedAt:0, __v:0}
             }
          ]);
       }
   
    }
    if(sortingType === 'default'){
        var option = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort:{createdAt:parseInt(sortingAction)},
            pagingCounter:true,
            allowDiskUse: true
         }; 
    }
    else if(sortingType === 'channelPartnerFamily'){
        var option = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort:{channelPartnerFamilyName:parseInt(sortingAction)},
            pagingCounter:true,
            allowDiskUse: true
         }; 
    }
    ChannelPartnerFamily.aggregatePaginate(query,option).then(function(peginationResult){
        console.log("mongoose pagination",peginationResult.docs);
        if(Object.keys(peginationResult.docs).length < 1){
            return response.status(400).send(
                {
                    status: 'FAILURE',
                    message: 'No result found',
                    data:[]
                 })
        }

        const metaData={}
        metaData.totalDocs = peginationResult.totalDocs
        metaData.limit = peginationResult.limit
        metaData.page = peginationResult.page
        metaData.totalPages = peginationResult.totalPages
        metaData.prevPage = peginationResult.prevPage
        metaData.nextPage = peginationResult.nextPage

        return response.status(200).send(
            {
              status: 'SUCCESS',
              message: 'Channel Partner Family type list successfully retrived',
              metaData:metaData,
              data:peginationResult.docs
            });
    }).catch(function(error){
        console.log(error);
        response.status(500).send({ 
            status:"FAILURE",
            message: "Internal Server Error",
            error:error 
     });

    })
}

exports.getOneChannelPartnerFamily = async function(request, response){
    const errors = validationResult(request);
    const extractedErrors = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 

    const{userId, channelPartnerFamilyId}=request.body

    const query = await ChannelPartnerFamily.aggregate([
            {
                $match:{isActive:true, _id:mongoose.Types.ObjectId(channelPartnerFamilyId)}
            },
            {
                $addFields : {"channelPartnerFamilyId": "$_id"}

            },
            {
                $project:{createdAt:0, updatedAt:0, _id:0, __v:0}
            }
        ]);
   if (Object.keys(query).length < 1) {

      return response.status(400).send(
            {
               status: 'FAILURE',
               message: 'No result found',
               data:[]
            }); 

   }

   return response.status(200).send(
      {
        status: 'SUCCESS',
        message: 'Corporate type successfully retrived',
        data:query
      }); 
}
