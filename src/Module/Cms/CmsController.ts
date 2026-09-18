import Cms , { AppBannerModel } from "./Cms";
import CustomError from "@abserve/errors/index";
import { BaseController } from "../BaseControllers";
import { AuthenticateRequest, MultipleFileRequest } from "@abserve/Interfaces/Requests";
import { Response } from "express";
import { Config } from "@abserve/Config/AppConfig";
import { FolderConfig } from "../FileUpload/FolderConfig";
import { HelperFunctionController as helperCtrl } from "@abserve/Helper/Function";
import { cloudinaryUpload } from "@abserve/Module/FileUpload/index";

class CmsController extends BaseController {
  constructor() {
    super();
  }

  static readonly getLinksAndBanners = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
    };
    try {
      const cmsDoc = await AppBannerModel.findOne({});
      if (!cmsDoc) throw new CustomError.BadRequestError("CMS_BANNERS_NOT_FOUND");


      //RESPONSE
      response.status = true;
      response.statusCode = 200;
      response.message = "CMS_BANNERS_LISTED_SUCCESSFULLY";
      response.data = cmsDoc;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  };


  static readonly createLinks = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
    };
    try {
      let cmsDoc: any;
      const cmsBanners = await AppBannerModel.findOne({}, { bannerImage: 1 });

      const dbObj = {
        banners: cmsBanners || [],
        cmsLinks: req.body.cmsLinks || [],
      };
      if (cmsBanners) {
        cmsDoc = await AppBannerModel.findOneAndUpdate({}, dbObj, { new: true });
      } else {
        cmsDoc = await AppBannerModel.create(dbObj);
      }

      if (!cmsDoc) throw new CustomError.BadRequestError("CMS_DATA_NOT_CREATED_OR_UPDATED");


      //RESPONSE
      response.status = true;
      response.statusCode = 201;
      response.message = "CMS_LINKS_CREATED_SUCCESSFULLY";
      response.data = cmsDoc;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  };


  static readonly createBanners = async (req: MultipleFileRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
    };
    try {
      let cmsDoc: any;
      const cmsLinks = await AppBannerModel.findOne({}, { cmsLinks: 1 });
      console.log("CMSLINKDS_", cmsLinks);

      const bannerImage: any[] = [];
      for (const image of req.files as any) {
        const cloudImage = await cloudinaryUpload(image.buffer, FolderConfig.BannerImage);
        bannerImage.push({
          image: cloudImage.url,
          publicId: cloudImage.publicId
        });
      }

      const dbObj = {
        bannerImage: bannerImage || [],
        cmsLinks: cmsLinks || [],
      };
      if (cmsLinks) {
        cmsDoc = await AppBannerModel.findOneAndUpdate({}, dbObj, { new: true });
      } else {
        cmsDoc = await AppBannerModel.create(dbObj);
      }

      if (!cmsDoc) throw new CustomError.BadRequestError("CMS_DATA_NOT_CREATED_OR_UPDATED");

      
      //RESPONSE
      response.status = true;
      response.statusCode = 201;
      response.message = "CMS_BANNER_CREATED_SUCCESSFULLY";
      response.data = cmsDoc;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  };


  static readonly createCms = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
    };
    try {
      const { type, title, content } = req.body;

      //CHECK DUPLICATE DATA
      const existingCmsDoc = await Cms.findOne({
        title: { $regex: new RegExp(`^${title}$`,"i") },
      });

      if(existingCmsDoc) throw new CustomError.BadRequestError("CMS_ALREADY_EXIST");

      const newCmsDatas = new Cms({
        type,
        title,
        content,
      });

      const savedCms = await newCmsDatas.save();

      if (!newCmsDatas) throw new CustomError.BadRequestError("CMS_NOT_CREATED")


      //RESPONSE
      response.status = true;
      response.data = savedCms;
      response.statusCode = 201;
      response.message = "CMS_CREATED_SUCCESSFULLY";
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  };


  static readonly getCms = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      totalCount: 0,
      data: {},
    };
    try {
      if (req.params?.cmsId) {
        const cmsData= await Cms.findById(req.params.cmsId);
        if (!cmsData) throw new CustomError.BadRequestError("CMS_NOT_FOUND")


        //RESPONSE
        response.data = cmsData;
        response.message = "CMS_FETCHED_SUCCESSFULLY";
        response.statusCode = 200;
        response.totalCount = 1;
        response.status = true;
      } else {
        let cmsList: any;
        const { _page = 1, _limit = 10, type } = req.query;
        const skip = (Number(_page) - 1) * Number(_limit);
        let queryData: any = req.query
        let query: any = type ? { type: queryData.type } : {}

        if (req.query.search) {
          const searchRegex = new RegExp(queryData.search, "i");
          query.title = { $regex: searchRegex };
        }
        if (req.query.title) query.title = { $regex: queryData.title, $options: "i" };
        response.totalCount = await Cms.countDocuments(query);

        cmsList = await Cms.find(query, { _id: 1, title: 1, content: 1, type: 1 }).skip(skip).limit(Number(_limit)).lean();
        if (!cmsList || cmsList.length === 0) throw new CustomError.BadRequestError("NO_CMS_FOUND")

        cmsList = cmsList.map((cms:any) => ({
            ...cms,
            content: cms.content
              .replace(/\[Company Name\]/g, Config.app.appName)
              .replace(/\[Email Address\]/g, Config.emailGateway.smtpConfig.auth.user)
              .replace(/\[Facebook Link\]/g, Config.socialLinks.facebook)
              .replace(/\[Instagram Link\]/g, Config.socialLinks.instagram)
              .replace(/\[Twitter Link\]/g, Config.socialLinks.twitter)
        }));
 

        //RESPONSE
        response.data = cmsList;
        response.status = true;
        response.message = "CMS_LISTED_SUCCESSFULLY";
        response.statusCode = 200;
      }
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  };


  static readonly updateCms = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: "Unprocessable Entity",
      data: {},
      statusCode: 500,
    };
    try {
      const { cmsId, title, content } = req.body;

      if (!cmsId) throw new CustomError.BadRequestError("CMS_ID_IS_REQUIRED")

      const existingCms = await Cms.findById(cmsId);
      if (!existingCms) throw new CustomError.BadRequestError("CMS_NOT_FOUND")

      // Update the CMS
      existingCms.title = title || existingCms.title;
      existingCms.content = content || existingCms.content;
      const updatedCms = await existingCms.save();


      // RESPONSE
      response.data = updatedCms;
      response.status = true;
      response.statusCode = 200;
      response.message = "CMS_UPDATED_SUCCESSFULLY";
    } catch (error: any) {
      console.error("Error", error.message);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  };


  static readonly deleteCms = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
    };
    try{
      let cmsId = req.params.cmsId;
      if(Config.hiddenSettings.mode == "1") throw new CustomError.UnProcessableError("SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_TEST_MODE", [])
      const deletedCms = await Cms.findByIdAndDelete(cmsId);
      if(!deletedCms) throw new CustomError.BadRequestError("FAILED_TO_DELETE_CMS")


      //RESPONSE
      response.message = "CMS_DELETED_SUCCESSSFULLY"
      response.status = true
      response.data = deletedCms
      response.statusCode = 200
    } catch (error: any) {
      console.error("Error", error.message);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }
}

export { CmsController };
