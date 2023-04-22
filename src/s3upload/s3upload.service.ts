import { Injectable } from '@nestjs/common';
// import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';


import { S3 } from 'aws-sdk';
import { Console } from 'console';

export enum MediaType {
    PetPicture,
}

@Injectable()
export class S3uploadService {
    async upload(filepath: string, filename: string, type: MediaType, bucket: string) {

        //get right configuration
        let key: string = 'petpictures/' + filename;
        let contentType: string = 'image';

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
}
