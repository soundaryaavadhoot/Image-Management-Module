const Router  = require('express').Router()
const { check } = require("express-validator");

const corporateController = require('../Controllers/CorporateController/CorporateMasterController')
const channelPartnerFamily = require('../Controllers/ChannelPartnerFamilyController/ChannelPartnerFamilyMasterController');
const channelPartnerType = require('../Controllers/ChannelPartnerTypeController/ChannelPartnerTypeMasterController');
const userProfileController = require('../Controllers/UserProfileController/UserProfileMasterController')
// -----------------------------------------------CorporateType----------------------------------------------------------------

Router.route('/createCorporateType').post(
    [
        check("userId", "userId is required").notEmpty(),
        check("corporateType", "corporateType is required").notEmpty(),
        check(
          "corporateDescription",
          "corporateDescription is required"
        ).notEmpty(),
      ],corporateController.createCorporateType)

Router.route('/updateCorporateType').post(
    [
        check("userId", "userId is required").notEmpty(),
        check("corporateTypeId", "corporateTypeId is required").notEmpty(),
        check("corporateType", "leadStatusType is required").notEmpty(),
        check(
          "corporateDescription",
          "leadStatusDescription is required"
        ).notEmpty(),
        check("requestType", "requestType is required").notEmpty(),
      ],corporateController.updateCorporateType)

Router.route("/changeCorporateTypeMasterStatus").post(
  [
    check("userId", "userId is required").notEmpty(),
    check("corporateTypeId", "employeeTypeId is required").notEmpty(),
    check("requestType", "requestType is required").notEmpty(),
  ], corporateController.updateCorporateType);

Router.route('/getAllCorporateType').post(
    [
        check("userId", "userId is required").notEmpty(),
        check("page", "page is required").notEmpty(),
        check("limit", "limit is required").notEmpty(),
        check("requestType", "requestType is required").notEmpty(),
        check("sortingType", "sortingType is required").notEmpty(),
        check("sortingAction", "sortingAction is required").notEmpty(),
      ],corporateController.getAllCorporateType)
     
Router.route("/getOneCorporateTypeMaster").post(
  [
    check("userId", "userId is required").notEmpty(),
    check("CorporateTypeId", "CorporateTypeId is required").notEmpty(),
  ],corporateController.getOneCorporateType)


// -------------------------------------------------channelPartnerFamily----------------------------------------------------------

Router.route('/createChannelPartnerFamily').post(
  [
    check("userId", "userId is required").notEmpty(),
    check("channelPartnerFamilyName", "channelPartnerFamilyName is required").notEmpty(),
    check(
      "channelPartnerFamilyDescription",
      "channelPartnerFamilyDescription is required"
    ).notEmpty(),
  ], channelPartnerFamily.createChannelPartnerFamily)

Router.route('/updateChannelPartnerFamily').post(
  [
      check("userId", "userId is required").notEmpty(),
      check("channelPartnerFamilyId", "channelPartnerFamilyId is required").notEmpty(),
      check("channelPartnerFamilyName", "channelPartnerFamilyName is required").notEmpty(),
      check(
        "channelPartnerFamilyDescription",
        "channelPartnerFamilyDescription is required"
      ).notEmpty(),
      check("requestType", "requestType is required").notEmpty(),
    ], channelPartnerFamily.updateChannelPartnerFamily)

Router.route("/changeChannelPartnerFamilyMasterStatus").post(
  [
    check("userId", "userId is required").notEmpty(),
    check("channelPartnerFamilyId", "channelPartnerFamilyId is required").notEmpty(),
    check("requestType", "requestType is required").notEmpty(),
  ], channelPartnerFamily.updateChannelPartnerFamily);

Router.route('/getAllChannelPartnerFamily').post(
  [
      check("userId", "userId is required").notEmpty(),
      check("page", "page is required").notEmpty(),
      check("limit", "limit is required").notEmpty(),
      check("requestType", "requestType is required").notEmpty(),
      check("sortingType", "sortingType is required").notEmpty(),
      check("sortingAction", "sortingAction is required").notEmpty(),
    ], channelPartnerFamily.getAllChannelPartnerFamily)

Router.route('/getOneChannelPartnerFamilyMaster').post(
  [
    check("userId", "userId is required").notEmpty(),
    check("channelPartnerFamilyId", "channelPartnerFamilyId is required").notEmpty(),
  ], channelPartnerFamily.getOneChannelPartnerFamily)

// ---------------------------------------------------ChannelPartnerType-----------------------------------------------

Router.route('/createChannelPartnerType').post( [
    check("userId", "userId is required").notEmpty(),
    check("channelPartnerTypeName", "channelPartnerTypeName is required").notEmpty(),
    check(
      "channelPartnerTypeDescription",
      "channelPartnerTypeDescription is required"
    ).notEmpty(),
  ], channelPartnerType.createChannelPartnerType)

Router.route('/updateChannelPartnerType').post(
  [
      check("userId", "userId is required").notEmpty(),
      check("channelPartnerTypeId", "channelPartnerTypeId is required").notEmpty(),
      check("channelPartnerTypeName", "channelPartnerTypeName is required").notEmpty(),
      check(
        "channelPartnerTypeDescription",
        "channelPartnerTypeDescription is required"
      ).notEmpty(),
      check("requestType", "requestType is required").notEmpty(),
    ], channelPartnerType.updateChannelPartnerType)

Router.route("/changeChannelPartnerTypeMasterStatus").post(
  [
    check("userId", "userId is required").notEmpty(),
    check("channelPartnerTypeId", "channelPartnerTypeId is required").notEmpty(),
    check("requestType", "requestType is required").notEmpty(),
  ], channelPartnerType.updateChannelPartnerType);

Router.route('/getAllChannelPartnerType').post(
  [
      check("userId", "userId is required").notEmpty(),
      check("page", "page is required").notEmpty(),
      check("limit", "limit is required").notEmpty(),
      check("requestType", "requestType is required").notEmpty(),
      check("sortingType", "sortingType is required").notEmpty(),
      check("sortingAction", "sortingAction is required").notEmpty(),
    ], channelPartnerType.getAllChannelPartnerType)

Router.route('/getOneChannelPartnerTypeMaster').post(
  [
    check("userId", "userId is required").notEmpty(),
    check("channelPartnerTypeId", "channelPartnerTypeId is required").notEmpty(),
  ], channelPartnerType.getOneChannelPartnerType)

Router.route('/profileUpload').post(userProfileController.uploadProfile)

Router.route('/getimage').post(userProfileController.getProfileImage)

Router.route('/multipleimages').post(userProfileController.uploadimages)

Router.route('/getmultipleimages').post(userProfileController.getUploadedImages)

Router.route('/multipleimageswithfields').post(userProfileController.uploadMultipleImagesWithFields)

Router.route('/getmultipleimageswithfields').post(userProfileController.getMultipleImagesWithFields)


module.exports = Router