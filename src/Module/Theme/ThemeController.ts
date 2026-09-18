import mongoose from "mongoose"
import { BaseController } from "../BaseControllers"
import { AuthenticateRequest } from "@abserve/Interfaces/Requests"
import { Response } from "express"
import { uploadToLocal, cloudinaryUpload } from "@abserve/Module/FileUpload"
import { FolderConfig } from "../FileUpload/FolderConfig"
import Booking from "@abserve/Module/Listing/Model/Booking"
import Ads from "@abserve/Module/Ads/Model/Ads"
import Cms from "@abserve/Module/Cms/Cms"
import CustomError from "@abserve/errors/index"
import Gallery from "@abserve/Module/Gallery/Gallery"
import Theme from "@abserve/Module/Theme/Theme"

class ThemeController extends BaseController {
    constructor() {
        super()
    }

    static readonly addTheme = async (req: AuthenticateRequest, res: Response) => {
        let response = {
            message: 'Unprocessable Entity',
            statusCode: 500,
            status: false,
            data: {}
        }
        try {
            const { name, title, description, categories, categorizedBy, lat, lng, location }: any = req.body
            const { files }: any = req
            let uploadedImages = [];
            for (const file of files) {
                // const imagePath = await uploadToLocal(file, FolderConfig.Theme)
                const cloudImage = await cloudinaryUpload( file.buffer, FolderConfig.Theme )
                uploadedImages.push({
                    // imagePath,
                    path: cloudImage.url,
                    publicId: cloudImage.publicId,
                });
            }
            // const images = (req.files as any)?.map((file: any) => file.path)

            let parsedCategories: any
            if (typeof categories === 'string') parsedCategories = JSON.parse(categories)

            let categoriesList: any = [];
            if (Array.isArray(parsedCategories)) {
                categoriesList = parsedCategories.reduce((acc: mongoose.Types.ObjectId[], cat: any) => {
                    if (mongoose.Types.ObjectId.isValid(cat)) {
                        acc.push(new mongoose.Types.ObjectId(cat));
                    } else {
                        console.error(`Invalid ObjectID for category: ${cat}`);
                    }
                    return acc;
                }, []);
            }

            const updatedData = {
                name,
                title,
                description,
                lat,
                lng,
                location,
                'theme.images': uploadedImages || [],
                'theme.categories': categoriesList,
                'theme.categorizedBy': new mongoose.Types.ObjectId(categorizedBy),
            }

            const theme = await Theme.create(updatedData)
            if (!theme) throw new CustomError.BadRequestError('THEME_NOT_CREATED')


            // RESPONSE
            response.status = true
            response.statusCode = 200
            response.message = 'THEME_CREATED_SUCCESSFULLY'
            response.data = theme
        } catch (error) {
            console.error('Error', error.message)
            response.status = false
            response.message = error.message || response.message
            response.statusCode = error.statusCode || response.statusCode
        }
        return res.status(response.statusCode || 500).json(response).end()
    }


    static readonly editTheme = async (req: AuthenticateRequest, res: Response) => {
        let response = {
            message: 'Unprocessable Entity',
            statusCode: 500,
            status: false,
            data: {}
        }
        try {
            let groupImagesPath: any = []
            const { name, title, description, categories, categorizedBy, lat, lng, location, selectedImages }: any = req.body

            let parsedCategories: any
            if (typeof categories === 'string') parsedCategories = JSON.parse(categories)

            let parsedImages: any
            if (typeof selectedImages === 'string') parsedImages = JSON.parse(selectedImages)

            let categoriesList: any = [];
            if (Array.isArray(parsedCategories)) {
                for (let i = 0; i < parsedCategories.length; ++i) {
                    let cat = parsedCategories[i];
                    if (mongoose.Types.ObjectId.isValid(cat)) {
                        categoriesList.push({ _id: new mongoose.Types.ObjectId(cat), order: i })
                    }
                }
            }

            if (parsedImages && Array.isArray(parsedImages) && parsedImages.length > 0) {
                for (let imagesId of parsedImages) {
                    if (mongoose.isValidObjectId(imagesId)) {
                        const galleryData = await Gallery.findOne({ _id: imagesId }).lean().exec()
                        if (!galleryData) throw new CustomError.BadRequestError('IMAGE_NOT_FOUND')
                        groupImagesPath.push({ ImageId: galleryData._id, imagePath: galleryData.path })
                    }
                }
            }

            const updatedData = {
                name,
                title,
                description,
                lat,
                lng,
                location,
                'theme.images': groupImagesPath || [],
                'theme.categories': categoriesList,
                'theme.categorizedBy': new mongoose.Types.ObjectId(categorizedBy),
            }

            const theme = await Theme.findOneAndUpdate(
                { status: 'active' },
                updatedData,
                { new: true }
            )
            if (!theme) throw new CustomError.BadRequestError('THEME_NOT_UPDATED')


            // RESPONSE
            response.status = true
            response.statusCode = 200
            response.message = 'THEME_UPDATED_SUCCESSFULLY'
            response.data = theme
        } catch (error) {
            console.error('Error', error.message)
            response.status = false
            response.message = error.message || response.message
            response.statusCode = error.statusCode || response.statusCode
        }
        return res.status(response.statusCode || 500).json(response).end()
    }


    static readonly getTheme = async (req: AuthenticateRequest, res: Response) => {
        let response = {
            message: 'Unprocessable Entity',
            statusCode: 500,
            status: false,
            data: {}
        }
        try {
            let pipeline: any
            if (req.query.type == 'ads'){
                pipeline = [
                    {
                        $match: {
                            status: { $eq: 'active' }
                        }
                    },
                    {
                        $lookup: {
                            from: 'adscategories',
                            let: { categoryIds: '$theme.categories._id', categoryOrders: '$theme.categories.order' },
                            pipeline: [
                                { $match: { $expr: { $in: ['$_id', '$$categoryIds'] } } },
                                { $addFields: { tempOrder: { $arrayElemAt: ['$$categoryOrders', { $indexOfArray: ['$$categoryIds', '$_id'] }] } } },
                                { $sort: { tempOrder: 1 } },
                                { $project: { tempOrder: 0 } }
                            ],
                            as: 'theme.categories'
                        }
                    },
                    {
                        $lookup: {
                            from: 'adscategories',
                            localField: 'theme.categorizedBy',
                            foreignField: '_id',
                            as: 'theme.categorizedBy'
                        }
                    },
                    { $unwind: '$theme.categorizedBy' },
                    {
                        $project: {
                            name: 1,
                            title: 1,
                            description: 1,
                            'theme.images': 1,
                            'theme.categories': 1,
                            'theme.categorizedBy': 1
                        }
                    },
                ]

            } else {
            pipeline = [
                {
                    $match: {
                        status: { $eq: 'active' }
                    }
                },
                {
                    $lookup: {
                        from: 'propertycategories',
                        let: { categoryIds: '$theme.categories._id', categoryOrders: '$theme.categories.order' },
                        pipeline: [
                            { $match: { $expr: { $in: ['$_id', '$$categoryIds'] } } },
                            { $addFields: { tempOrder: { $arrayElemAt: ['$$categoryOrders', { $indexOfArray: ['$$categoryIds', '$_id'] }] } } },
                            { $sort: { tempOrder: 1 } },
                            { $project: { tempOrder: 0 } }
                        ],
                        as: 'theme.categories'
                    }
                },
                {
                    $lookup: {
                        from: 'propertycategories',
                        localField: 'theme.categorizedBy',
                        foreignField: '_id',
                        as: 'theme.categorizedBy'
                    }
                },
                { $unwind: '$theme.categorizedBy' },
                {
                    $project: {
                        name: 1,
                        title: 1,
                        description: 1,
                        'theme.images': 1,
                        'theme.categories': 1,
                        'theme.categorizedBy': 1
                    }
                },
            ]
        }
            const themeData = await Theme.aggregate(pipeline)
            if (!themeData?.length) throw new CustomError.BadRequestError('THEMES_NOT_FOUND')


            // RESPONSE
            response.status = true
            response.statusCode = 200
            response.message = 'THEME_FETCHED'
            response.data = themeData
        } catch (error) {
            console.error('Error', error.message)
            response.status = false
            response.message = error.message || response.message
            response.statusCode = error.statusCode || response.statusCode
        }
        return res.status(response.statusCode || 500).json(response).end()
    }


    static readonly recentBookings = async (req: AuthenticateRequest, res: Response) => {
        let response = {
            message: 'Unprocessable Entity',
            statusCode: 500,
            status: false,
            data: {}
        }
        try {
            let data: any
            if (req.query.type == 'ads'){
                const adsPipeline: any = [
                    {
                        $lookup: {
                            from: 'adscategories',
                            localField: 'category',
                            foreignField: '_id',
                            as: 'categoryName'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                             name: 1,
                             desc: 1,
                             price: 1,
                            'image.coverImage': 1,
                            'image.groupImage': 1,
                            'categoryName.category': 1
                        }
                    },
                    {
                        $sort: { _id: -1 }
                    },
                    {
                        $limit: 10
                    }
                ]
                data = await Ads.aggregate(adsPipeline)
                if (!data?.length) throw new CustomError.BadRequestError('NO_ADS_FOUND')
                response.message = 'RECENT_ADS_LISTED';
            } else {
            const pipeline: any = [
                {
                    $lookup: {
                        from: 'listings',
                        localField: 'listingId',
                        foreignField: '_id',
                        as: 'listingDatas'
                    }
                },
                { $unwind: '$listingDatas' },
                {
                    $lookup: {
                        from: 'listingpricings',
                        localField: 'listingDatas._id',
                        foreignField: 'listingId',
                        as: 'listingDatas.listingPricingDatas'
                    }
                },
                { $unwind: '$listingDatas.listingPricingDatas' },
                {
                    $lookup: {
                        from: 'listingattachments',
                        localField: 'listingDatas._id',
                        foreignField: 'listingId',
                        as: 'listingDatas.listingAttachmentDatas'
                    }
                },
                {
                    $lookup: {
                        from: 'propertycategories',
                        localField: 'listingDatas.propertyCategory',
                        foreignField: '_id',
                        as: 'listingDatas.categoryName'
                    }
                },
                { $unwind: '$listingDatas.categoryName' },
                {
                    $group: {
                        _id: '_id',
                        listingDetails: { $addToSet: '$listingDatas' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        'listingDetails._id': 1,
                        'listingDetails.propertyName': 1,
                        'listingDetails.propertyDesc': 1,
                        'listingDetails.totalRatingCount': 1,
                        'listingDetails.totalReviewCount': 1,
                        'listingDetails.categoryName.category': 1,
                        'listingDetails.listingPricingDatas.pricing.perDay': 1,
                        'listingDetails.listingPricingDatas.pricing.perHour': 1,
                        'listingDetails.listingAttachmentDatas.image.coverImage': 1,
                        'listingDetails.listingAttachmentDatas.image.groupImage': 1,
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: 10
                }
            ]
            data = await Booking.aggregate(pipeline)
            if (!data?.length) throw new CustomError.BadRequestError('NO_BOOKINGS_FOUND')
            response.message = 'RECENT_BOOKINGS_LISTED';
          }

            // const bookings = await Booking.aggregate(pipeline)
            // if (!bookings || !bookings.length) throw new CustomError.BadRequestError('NO_BOOKINGS_FOUND')


            // RESPONSE
            response.status = true
            response.statusCode = 200
            response.message = 'RECENT_BOOKINGS_LISTED'
            response.data = data
        } catch (error) {
            console.error('Error', error.message)
            response.status = false
            response.message = error.message || response.message
            response.statusCode = error.statusCode || response.statusCode
        }
        return res.status(response.statusCode || 500).json(response).end()
    }


    static readonly getDetailedTheme = async (req: AuthenticateRequest, res: Response) => {
        let response = {
            message: 'Unprocessable Entity',
            statusCode: 500,
            status: false,
            data: {}
        }
        try {
            let pipeline: any
            if (req.query.type == 'ads'){
                pipeline = [
                    {
                        $match: {
                            status: { $eq: 'active' }
                        }
                    },
                    {
                        $lookup: {
                            from: 'adscategories',
                            localField: 'theme.categories._id',
                            foreignField: '_id',
                            as: 'theme.categories'
                        }
                    },
                    {
                        $lookup: {
                            from: 'advertisements',
                            localField: 'theme.categorizedBy',
                            foreignField: 'category',
                            as: 'adsDatas'
                        }
                    },
                    { $unwind: '$adsDatas' },
                    {
                        $lookup: {
                            from: 'adscategories',
                            localField: 'adsDatas.category',
                            foreignField: '_id',
                            as: 'adsDatas.categoryName'
                        }
                    },
                    { $unwind: '$adsDatas.categoryName' },
                    {
                        $group: {
                            _id: '$_id',
                            name: { $first: '$name' },
                            title: { $first: '$title' },
                            description: { $first: '$description' },
                            images: { $first: '$theme.images' },
                            categories: { $first: '$theme.categories' },
                            adsDetails: { $push: '$adsDatas' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            title: 1,
                            description: 1,
                            images: 1,
                            categories: 1,
                            'adsDetails._id': 1,
                            'adsDetails.name': 1,
                            'adsDetails.desc': 1,
                            'adsDetails.price': 1,
                            'adsDetails.image.coverImage': 1,
                            'adsDetails.image.groupImage': 1,
                            'adsDetails.categoryName': { $arrayElemAt: ['$adsDetails.categoryName.category', 0] }
                        }
                    }
                ]
            } else {
              pipeline = [
                {
                    $match: {
                        status: { $eq: 'active' }
                    }
                },
                {
                    $lookup: {
                        from: 'propertycategories',
                        localField: 'theme.categories._id',
                        foreignField: '_id',
                        as: 'theme.categories'
                    }
                },
                {
                    $lookup: {
                        from: 'listings',
                        localField: 'theme.categorizedBy',
                        foreignField: 'propertyCategory',
                        as: 'listingDatas'
                    }
                },
                { $unwind: '$listingDatas' },
                {
                    $lookup: {
                        from: 'listingpricings',
                        localField: 'listingDatas._id',
                        foreignField: 'listingId',
                        as: 'listingDatas.listingPricingDatas'
                    }
                },
                { $unwind: '$listingDatas.listingPricingDatas' },
                {
                    $lookup: {
                        from: 'listingattachments',
                        localField: 'listingDatas._id',
                        foreignField: 'listingId',
                        as: 'listingDatas.listingAttachmentDatas'
                    }
                },
                {
                    $lookup: {
                        from: 'propertycategories',
                        localField: 'listingDatas.propertyCategory',
                        foreignField: '_id',
                        as: 'listingDatas.categoryName'
                    }
                },
                { $unwind: '$listingDatas.categoryName' },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        title: { $first: '$title' },
                        description: { $first: '$description' },
                        images: { $first: '$theme.images' },
                        categories: { $first: '$theme.categories' },
                        listingDetails: { $push: '$listingDatas' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        title: 1,
                        description: 1,
                        images: 1,
                        categories: 1,
                        'listingDetails._id': 1,
                        'listingDetails.propertyName': 1,
                        'listingDetails.propertyDesc': 1,
                        'listingDetails.totalRatingCount': 1,
                        'listingDetails.totalReviewCount': 1,
                        'listingDetails.categoryName': { $arrayElemAt: ['$listingDetails.categoryName.category', 0] },
                        'listingDetails.listingPricingDatas.pricing.perDay': 1,
                        'listingDetails.listingPricingDatas.pricing.perHour': 1,
                        'listingDetails.listingAttachmentDatas.image.coverImage': 1,
                        'listingDetails.listingAttachmentDatas.image.groupImage': 1,
                    }
                }
            ]
        }
            const themeDetails = await Theme.aggregate(pipeline)
            if (!themeDetails?.length) throw new CustomError.BadRequestError('THEME_NOT_FETCHED')
            
            const cmsData = await Cms.find({}).select('_id type title').lean();
            themeDetails.forEach((detail) => { detail.cms = cmsData });


            // RESPONSE
            response.message = 'DETAILS_LISTED'
            response.status = true
            response.statusCode = 200
            response.data = themeDetails

        } catch (error) {
            console.log('Error \n', error)
            response.status = false
            response.message = error.message || response.message
            response.statusCode = error.statusCode || response.statusCode
        }
        return res.status(response.statusCode || 500).json(response).end()
    }
}

export { ThemeController }