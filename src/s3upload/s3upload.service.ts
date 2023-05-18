import { Injectable } from '@nestjs/common';
// import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';


import { S3 } from 'aws-sdk';
import { Console } from 'console';

import { unlink } from 'fs';

export enum MediaType {
    Image,
    PDF,
}

@Injectable()
export class S3uploadService {
    async upload(filepath: string, filename: string, type: MediaType, keyPath: string, bucket: string) {

        //get right configuration
        let key: string = keyPath + filename;
        let contentType: string = 'image';
        if (type == MediaType.PDF) {
            contentType = 'application/pdf';
        }

        console.log("Content Type: " + contentType);

        //Check if picture

        const aws = require("aws-sdk");
        const fs = require("fs");

        aws.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        // console.log("FilepPath is: " + filepath);
        // Create an S3 client setting the Endpoint to DigitalOcean Spaces
        var spacesEndpoint = new aws.Endpoint('ams1.vultrobjects.com');
        var s3 = new aws.S3({ endpoint: spacesEndpoint });

        console.log

        var params = {
            Bucket: bucket,
            Key: key,
            Body: fs.createReadStream(filepath),
            ACL: 'public-read',
            ContentType: contentType,
        };

        await s3.putObject(params, async function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                fs.unlink(filepath, (err) => {
                    if (err) throw err;
                    console.log(filepath + ' was deleted1');
                });
            }
        });
    }

    async delete(key: string, bucket: string) {

        //get right configuration
        // let key: string = 'petpictures/' + filename;
        // let key: string = bucket + '/' + filename;
        // console.log("Key: " + key);

        //Check if picture

        const aws = require("aws-sdk");

        aws.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        // console.log("FilepPath is: " + filepath);
        // Create an S3 client setting the Endpoint to DigitalOcean Spaces
        var spacesEndpoint = new aws.Endpoint('ams1.vultrobjects.com');
        var s3 = new aws.S3({ endpoint: spacesEndpoint });


        // var params = {
        //     Bucket: bucket,
        //     Key: key,
        //     Body: fs.createReadStream(filepath),
        //     ACL: 'public-read',
        //     ContentType: contentType,
        // };

        var params = {
            Bucket: bucket,
            Key: key,
            /* 
               where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
               - full path name to your file without '/' at the beginning
            */
        };

        s3.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
        });
    }



    /**
     * Resizes and saves image to a jpeg File
     * @param newPath Path where converted Image should be stored
     * @param oldPath Path of the Image which should be converted
     * @param width Resizing to width
     * @param height Resizing to height
     * @param quality Level of Quality which should be converted to
     */
    async resizeAndSaveImageJpeg(newPath: string, oldPath: string, width: number, height: number, quality: number) {
        const sharp = require('sharp');

        const image = await sharp(oldPath)
        const metadata = await image.metadata()
        console.log(metadata.width, metadata.height)

        console.log("PicturePath: " + newPath);

        let _width: number = null;
        let _height: number = null;
        let _maxSize: number = 720;
        if (metadata.width > _maxSize || metadata.height > _maxSize) {
            if (metadata.width > metadata.height) {
                _width = _maxSize;
            } else if (metadata.height > metadata.width) {
                _height = _maxSize;
            } else if (metadata.height == metadata.width) {
                _height = _maxSize;
                _width = _maxSize;
            }
        }

        console.log(_width, _height)

        // await sharp(oldPath).resize(width, height).toFormat("png").png({ quality: quality })
        //     .toFile(newPath).then(() => {
        //         unlink(oldPath, (err) => {
        //             if (err) throw err;
        //             console.log(oldPath + ' was deleted2');
        //         });
        //     });;
        await sharp(oldPath).resize({ width: _width, height: _height }).toFormat("png").png({ quality: quality })
            .toFile(newPath).then(() => {
                unlink(oldPath, (err) => {
                    if (err) throw err;
                    console.log(oldPath + ' was deleted2');
                });
            });;
    }
}
