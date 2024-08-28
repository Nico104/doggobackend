import { Body, Controller, Get, Post, UseGuards, Request, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { CollarTag, TagModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TagService } from './tag.service';
import { MediaType, S3uploadService } from 'src/s3upload/s3upload.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { GlobalService } from 'src/utils/global.service';
import { AdminAuthGuard, TokenIdAuthGuard } from 'src/auth/custom_auth.guard';

// var directoryPath = GlobalService.rootPath + 'MediaFiles/';
var directoryPath = GlobalService.rootPath + 'TagFiles/';

@Controller('tag')
export class TagController {

    constructor(
        private readonly tagService: TagService,
        private readonly s3uploadService: S3uploadService,
    ) { }


    //!Tag Functions for Administartion
    //! Only Mod Rights
    @UseGuards(AdminAuthGuard)
    @Post('uploadCollarTagPicture')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1, },
    ], {
        storage: diskStorage({
            destination: directoryPath + "uploads",
        }),
    }
    ))
    async uplouploadCollarTagPictureadPicture(
        @UploadedFiles() files: { picture?: Express.Multer.File[] },
    ): Promise<string> {
        if (files.picture != null) {
            console.log("picture is not null");
            let filename: string = files.picture[0]['filename'];
            // var picturePath = 'uploads/' + filename + '.png';
            let bucketName: string = 'collartags';
            let s3PicturePath: string = bucketName + '/' + 'pictures/' + filename;
            /**
            * Upload Pet Picture to Vultr
            */
            await this.s3uploadService.upload(files.picture[0]['path'],
                filename, MediaType.Image, 'pictures/', bucketName);

            return s3PicturePath;
        } else {
            console.log("picture is null");
            return null;
        }
    }

    //! Only Mod Rights
    @UseGuards(AdminAuthGuard)
    @Get('getAllTags')
    async getAllTags(): Promise<CollarTag[]> {
        return this.tagService.Tags({});
    }

    //! Only Mod Rights
    @UseGuards(AdminAuthGuard)
    @Get('checkTagId/:tagid')
    async checkTagId(@Param('tagid') tagid: string): Promise<Boolean> {
        return this.tagService.checkTagIdAvailable({
            tagId: tagid
        });
    }

    //! Only Mod Rights
    @UseGuards(AdminAuthGuard)
    @Post('createTag')
    async createTag(
        @Body() data: {
            publicCode: string;
            activationCode: string;
            collarTag_id: string;
            // picturePath: string;
            tagModel_shortName: string;
            sku: string;
        },
    ): Promise<CollarTag> {
        return this.tagService.createTag(
            {
                activationCode: data.activationCode,
                collarTag_id: data.collarTag_id,
                // picturePath: data.picturePath,
                publicCode: data.publicCode,
                model: {
                    connect: {
                        tagModel_shortName: data.tagModel_shortName
                    }
                },
                sku: data.sku
            }
        );
    }

    //! Only Mod Rights
    @UseGuards(AdminAuthGuard)
    @Post('createTagModel')
    async createTagModel(
        @Body() data: {
            tagModel_Description: string;
            tagModel_Label: string;
            picturePath: string;
            tagModel_shortName: string;
        },
    ): Promise<TagModel> {
        return this.tagService.createTagModel(
            {
                picturePath: data.picturePath,
                tagModel_Description: data.tagModel_Description,
                tagModel_shortName: data.tagModel_shortName,
                tagModel_Label: data.tagModel_Label
            }
        );
    }


    //!Tag Functions for Client

    @UseGuards(TokenIdAuthGuard)
    @Get('getUserTags')
    async getUserTags(@Request() req: any): Promise<CollarTag[]> {
        return this.tagService.Tags({
            where: {
                user: {
                    uid: req.user.uid
                }
            },
            orderBy: {
                assignedDate: 'desc'
            }
        });
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getTag/:tagid')
    async getTag(@Param('tagid') tagid: string): Promise<CollarTag> {
        return this.tagService.Tag({
            collarTag_id: tagid
        });
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getUserProfileTags/:petProfileId')
    async getUserProfileTags(
        @Request() req: any,
        @Param('petProfileId') petProfileId: string,
    ): Promise<CollarTag[]> {
        return this.tagService.Tags({
            where: {
                user: {
                    uid: req.user.uid
                },
                petProfile_id: Number(petProfileId),
            },
            orderBy: {
                assignedDate: 'desc'
            }
        });
    }


    @UseGuards(TokenIdAuthGuard)
    @Post('assignTagToUser')
    async assignTagToUser(
        @Request() req: any,
        @Body() data: {
            activationCode: string;
        },
    ): Promise<CollarTag> {
        console.log("Email = " + req.user.useremail);
        return this.tagService.connectTagToUser(
            {
                activationCode: data.activationCode,
                uid: req.user.uid,
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('disconnectTagFromUser')
    async disconnectTagFromUser(
        @Body() data: {
            tagId: string
        },
    ): Promise<CollarTag> {
        //TODO Check if user has the rights to
        return this.tagService.disconnectTagFromUser(
            {
                tagId: data.tagId
            }
        );
    }
}
