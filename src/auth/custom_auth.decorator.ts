// // https://stackoverflow.com/questions/58714466/in-nestjs-is-there-any-way-to-pass-data-from-guards-to-the-controller
// import { ExecutionContext, createParamDecorator } from '@nestjs/common';
// import * as admin from 'firebase-admin';

// export const Authorization = createParamDecorator((_, req) => {
//     // const headers = ctx.switchToHttp().getRequest().headers;
//     // const { authorization: idToken } = headers;
//     // console.log(idToken);
//     // admin.auth().verifyIdToken(idToken)
//     //     .then(function (decodedToken) {
//     //         var uid = decodedToken.uid;
//     //         // ...
//     //         console.log("Uid: " + uid);
//     //         return uid;
//     //     }).catch(function (error) {
//     //         // Handle error
//     //         console.log(error);
//     //         throw new Error("Invalid Id Token");
//     //     });
//     console.log("Req: " + req.user);
// });



// // export const RequestHeader = createParamDecorator(
// //     async (value: any, ctx: ExecutionContext) => {
// //         // extract headers
// //         const headers = ctx.switchToHttp().getRequest().headers;
// //         // Convert headers to DTO object
// //         const dto = plainToClass(value, headers, {excludeExtraneousValues: true});
// //         const errors: ValidationError[] = await validate(dto);

// //         if (errors.length > 0) {
// //             //Get the errors and push to custom array
// //             let validationErrors = errors.map(obj => Object.values(obj.constraints));
// //             throw new HttpException(`Request Header Validation failed with following Errors: ${validationErrors}`, HttpStatus.BAD_REQUEST);
// //         }
// //         // return header dto object
// //         return dto;
// //     }
// // );

// // //Using in controller:
// //  @Post('my-details')
// //     async myData(
// //       @Req() req,
// //       @Res() res,
// //       @Body() body: myBody,
// //       @RequestHeader(MyHeaderDto) myHeader: MyHeaderDto,
// //   ):Promise<MyCustomDataDto> {