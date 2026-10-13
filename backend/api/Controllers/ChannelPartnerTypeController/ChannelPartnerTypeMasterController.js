const async           = require('async')
const { validationResult } = require("express-validator");
const mongoose        = require('mongoose')

const ChannelPartnerType = require('../../Models/Master/ChannelPartnerTypeMaster')

exports.createChannelPartnerType = async function(request , response){ 
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
    const {userId , channelPartnerTypeName , channelPartnerTypeDescription } = request.body

    var  channelPartnerTypeCheck = await ChannelPartnerType.aggregate([
         
        {
           $addFields : {"channelPartnerTypeNameLc": { $toLower: "$channelPartnerTypeName" },"channelPartnerTypeDescriptionLc": { $toLower:"$channelPartnerTypeDescription" }}
        },
        {
           $match:{
                    isActive:true,
        
                    $or:[
                          { channelPartnerTypeNameLc: channelPartnerTypeName.toLowerCase()},
                          { channelPartnerTypeDescriptionLc: channelPartnerTypeDescription.toLowerCase()},
                       ]
                 }                
        },
     ]);
     console.log("channelPartnerTypeCheck", Object.keys(channelPartnerTypeCheck).length);
   
     if (Object.keys(channelPartnerTypeCheck).length !== 0) 
     {
       return response.status(409).send(
          {
             status: 'FAILURE',
             message: 'Duplicate channelPartnerType entry found',
          }); 
     }

   const channelPartnerType = new ChannelPartnerType()  
   channelPartnerType.channelPartnerTypeName = channelPartnerTypeName
   channelPartnerType.channelPartnerTypeDescription = channelPartnerTypeDescription
   channelPartnerType.save(function(err , channelPartnerTypeResult){
       if(err){
        response.status(500).send({message: 'internal server error'})     
       }
       else{
        userArray.push(channelPartnerTypeResult)
        response.status(200).send(userArray)
       }
   })
}

exports.updateChannelPartnerType = async function(request , response){
    const errors = validationResult(request);
    const extractedErrors = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 
    const {userId , channelPartnerTypeId, channelPartnerTypeName , channelPartnerTypeDescription , requestType } = request.body
    if(requestType ==="update"){
        var channelPartnerTypeCheck = await ChannelPartnerType.aggregate([
            {
                $addFields : {'channelPartnerTypeNameLc': { $toLower: '$channelPartnerTypeName'}, 'channelPartnerTypeDescriptionLc': {$toLower:'channelPartnerTypeDescription'}}
            },
            {
                $match: {
                    isActive: true ,
                    _id:{$ne: mongoose.Types.ObjectId(channelPartnerTypeId)},
                    $or: [
                        {channelPartnerTypeNameLc: channelPartnerTypeName.toLowerCase()},
                        {channelPartnerTypeDescriptionLc: channelPartnerTypeDescription.toLowerCase()}
                    ]
                }
            }
        ]);
        console.log('channelPartnerTypeCheck' , Object.keys(channelPartnerTypeCheck).length);
        if(Object.keys(channelPartnerTypeCheck).length !== 0){
            return response.status(409).send(
                {
                    status: 'Failure',
                    message: 'Duplicate channelPartnerType entry found'
                })
        }
    }

    const model = await ChannelPartnerType.find({isActive:true ,_id:mongoose.Types.ObjectId(channelPartnerTypeId)});
    if(requestType ==="activate"){
        model[0].isPublished = true
    }
    else if(requestType ==="deactivate"){
        model[0].isPublished = false
    }
    else if(requestType ==="update"){
        model[0].userId = userId
        model[0].channelPartnerTypeName = channelPartnerTypeName
        model[0].channelPartnerTypeDescription = channelPartnerTypeDescription
    }
    else {
        return response.status(422).json({
            status: 'FAILURE',
            message: ['Invalid requestType']
        })
    }

    model[0].save(function(err , saveChannelPartnerTypeDetails){
        if(err){
            return response.status(500).send({
                status: 'Failure',
                message: 'internal server error',
                err : err
            })
        }

        return response.status(200).send({
            status:'success',
            message: 'ChannelPartnerType Data updated successfully',
            data: saveChannelPartnerTypeDetails
        })
    })
}

exports.getAllChannelPartnerType = async function(request, response){
            
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
        var query = ChannelPartnerType.aggregate([
            {
                $addFields : {"channelPartnerTypeNameLc": { $toLower: "$channelPartnerTypeName" },"channelPartnerTypeDescriptionLc": { $toLower:"$channelPartnerTypeDescription" }}
             },
             {
                $match:{
                         isActive:true,
             
                         $or:[
                               { channelPartnerTypeNameLc:searchValue.toLowerCase()},
                               { channelPartnerTypeDescriptionLc:searchValue.toLowerCase() }, 
                               { channelPartnerTypeNameLc:{$regex: new RegExp(searchValue.toLowerCase())} }, 
                               { channelPartnerTypeDescriptionLc:{$regex: new RegExp(searchValue.toLowerCase())} }, 
                            ]
                      }                
             },
             {
                $addFields : {"channelPartnerTypeId": "$_id"}
             },
             {
                $project:{ updatedAt:0, _id:0, __v:0, channelPartnerTypeNameLc:0, channelPartnerTypeDescriptionLc:0}
             } 
        ])
    }
    if(requestType === "default")
    {
       if(isPublished === "true")
       {
          var query = ChannelPartnerType.aggregate([
             {
                $match:{isActive:true, isPublished:true}
             },
             {
                $addFields : {"channelPartnerTypeId": "$_id"}
    
             },
             {
                $project:{ updatedAt:0, __v:0}
             }
          ]);
       }
       else
       {
          var query = ChannelPartnerType.aggregate([
             {
                $match:{isActive:true}
             },
             {
                $addFields : {"channelPartnerTypeId": "$_id"}
    
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
    else if(sortingType === 'channelPartnerType'){
        var option = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort:{channelPartnerTypeName:parseInt(sortingAction)},
            pagingCounter:true,
            allowDiskUse: true
         }; 
    }
    ChannelPartnerType.aggregatePaginate(query,option).then(function(peginationResult){
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
              message: 'Channel Partner Type type list successfully retrived',
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

exports.getOneChannelPartnerType = async function(request, response){
    const errors = validationResult(request);
    const extractedErrors = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 

    const{userId, channelPartnerTypeId}=request.body

    const query = await ChannelPartnerType.aggregate([
            {
                $match:{isActive:true, _id:mongoose.Types.ObjectId(channelPartnerTypeId)}
            },
            {
                $addFields : {"channelPartnerTypeId": "$_id"}

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

