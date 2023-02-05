import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET,
        })
    }

    async validate(payload: any) {
        // const user = aait this.userService.getUser(payload.username) -> mit den konn man zusätzliche sochen zrugschicken de net in Payload sein
        return {
            username: payload.username
            //...user  donn konnsch den user mitgeben um olle Daten oder olle de willsch fan User zrugzuschicken
        }
    }
}