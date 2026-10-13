const async           = require('async')
const { validationResult } = require("express-validator");
const mongoose        = require('mongoose')

const Corporate = require('../../Models/Master/CorporateMaster')

exports.createCorporateType = async function(request , response){ 
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
    const {userId ,corporateType , corporateDescription} = request.body

    var  corporateCheck = await Corporate.aggregate([
         
        {
           $addFields : {"corporateTypeLc": { $toLower: "$corporateType" },"corporateDescriptionLc": { $toLower:"$corporateDescription" }}
        },
        {
           $match:{
                    isActive:true,
        
                    $or:[
                          { corporateTypeLc:corporateType.toLowerCase()},
                          { corporateDescriptionLc: corporateDescription.toLowerCase()},
                       ]
                 }                
        },
     ]);
     console.log("corporateCheck", Object.keys(corporateCheck).length);
   
     if (Object.keys(corporateCheck).length !== 0) 
     {
       return response.status(409).send(
          {
             status: 'FAILURE',
             message: 'Duplicate corporate entry found',
          }); 
     }

   const corporate = new Corporate()  
   corporate.corporateType = corporateType
   corporate.corporateDescription = corporateDescription
   corporate.save(function(err , corporateResult){
       if(err){
        response.status(500).send({message: 'internal server error'})     
       }
       else{
        userArray.push(corporateResult)
        response.status(200).send(userArray)
       }
   })
}

exports.updateCorporateType = async function(request , response){
    const errors = validationResult(request);
    const extractedErrors = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 

    const {userId , corporateTypeId, corporateType , corporateDescription , requestType } = request.body
    if(requestType ==="update"){
        var corporateCheck = await Corporate.aggregate([
            {
                $addFields : {'corporateTypeLc': { $toLower: '$corporateType'}, 'corporateDescriptionLc': {$toLower:'corporateDescription'}}
            },
            {
                $match: {
                    isActive: true ,
                    _id:{$ne: mongoose.Types.ObjectId(corporateTypeId)},
                    $or: [
                        {corporateTypeLc:corporateType.toLowerCase()},
                        {corporateDescriptionLc: corporateDescription.toLowerCase()}
                    ]
                }
            }
        ]);
        console.log('corporateCheck' , Object.keys(corporateCheck).length);
        if(Object.keys(corporateCheck).length !== 0){
            return response.status(409).send(
                {
                    status: 'Failure',
                    message: 'Duplicate Corporate Type entry found'
                })
        }
    }
    const model = await Corporate.find({isActive:true ,_id:mongoose.Types.ObjectId(corporateTypeId)});
    console.log(model , 'model');
     if(requestType ==="activate"){
         model[0].isPublished = true
     }
     else if(requestType ==="deactivate"){
         model[0].isPublished = false
     }
     else if(requestType ==="update"){
         model[0].userId = userId
         model[0].corporateType = corporateType
         model[0].corporateDescription = corporateDescription
     }
     else {
         return response.status(422).json({
             status: 'FAILURE',
             message: ['Invalid requestType']
         })
     }
      
     model[0].save(function(err , saveCorprateDetails){
         if(err){
             return response.status(500).send({
                 status: 'Failure',
                 message: 'internal server error',
                 err : err
             })
         }

         return response.status(200).send({
             status:'success',
             message: 'Corporate Data updated successfully',
             data: saveCorprateDetails
         })
     })

    // Corporate.find({_id:mongoose.Types.ObjectId(userid)}).exec(function(err , corporateResult){
    //     if(err){
    //         response.status(400).send({message: 'inernal server error'});
    //     }
    //     else{
    //         corporateResult[0].corporateType= corporateType
    //         corporateResult[0].corporateDescription = corporateDescription
    //         corporateResult[0].save(function(err , corporateSaveResult){
    //             if(err){
    //                 response.status(400).send({message: 'internal server error'})
    //             }
    //             else {
    //                 response.status(200).send({data: corporateSaveResult , message: 'data has been updated successfully'})
    //             }
    //         })
    //     }
    // })
}

exports.getAllCorporateType = async function(request,response){
        
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
        var query = Corporate.aggregate([
            {
                $addFields : {"corporateTypeLc": { $toLower: "$corporateType" },"corporateDescriptionLc": { $toLower:"$corporateDescription" }}
             },
             {
                $match:{
                         isActive:true,
             
                         $or:[
                               { corporateTypeLc:searchValue.toLowerCase()},
                               { corporateDescriptionLc:searchValue.toLowerCase() }, 
                               { corporateTypeLc:{$regex: new RegExp(searchValue.toLowerCase())} }, 
                               { corporateDescriptionLc:{$regex: new RegExp(searchValue.toLowerCase())} }, 
                            ]
                      }                
             },
             {
                $addFields : {"corporateTypeId": "$_id"}
             },
             {
                $project:{ updatedAt:0, _id:0, __v:0,corporateTypeLc:0, corporateDescriptionLc:0}
             } 
        ])
    }
    if(requestType === "default")
    {
       if(isPublished === "true")
       {
          var query = Corporate.aggregate([
             {
                $match:{isActive:true, isPublished:true}
             },
             {
                $addFields : {"corporateTypeId": "$_id"}
    
             },
             {
                $project:{ updatedAt:0, __v:0}
             }
          ]);
       }
       else
       {
          var query = Corporate.aggregate([
             {
                $match:{isActive:true}
             },
             {
                $addFields : {"corporateTypeId": "$_id"}
    
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
    else if(sortingType === 'corporateType'){
        var option = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort:{corporateType:parseInt(sortingAction)},
            pagingCounter:true,
            allowDiskUse: true
         }; 
    }

    Corporate.aggregatePaginate(query,option).then(function(peginationResult){
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
              message: 'Corporate type list successfully retrived',
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

exports.getOneCorporateType = async function(request, response){
    const errors = validationResult(request);
    const extractedErrors = []
    
    errors.array({ onlyFirstError: true }).map(err => extractedErrors.push( err.msg ));
    
    if (!errors.isEmpty()) {
       return response.status(422).json({
          status:"FAILURE",
          message: extractedErrors
       });
    } 

    const{userId, CorporateTypeId}=request.body

    const query = await Corporate.aggregate([
                                                   {
                                                      $match:{isActive:true, _id:mongoose.Types.ObjectId(CorporateTypeId)}
                                                   },
                                                   {
                                                      $addFields : {"CorporateTypeId": "$_id"}

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
