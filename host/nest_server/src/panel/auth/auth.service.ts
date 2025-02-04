import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Auth, AuthDocument } from "../../models/auth.model";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


interface RequestBody {
    login: string;
    password: string;
}

interface RequestBodyChangePassword {
    login: string;
    password: string;
    newPassword: string;
  }

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Auth') private readonly authModel: Model<AuthDocument>,
        private readonly jwtService: JwtService
    ) {}

    async login(body: RequestBody): Promise<{ access_token: string } | { error: string }> {
        try {
            const auth = await this.authModel.findOne({ login: body.login });
            if (!auth) {
                throw new UnauthorizedException('Wrong login');
            }

            const authPassword = await bcrypt.compare(body.password, auth.password);
            if (!authPassword) {
                throw new UnauthorizedException('Wrong password');
            }

            const payload = {login: auth.login};

            const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

            return { access_token };
        } catch (error) {
            return { error: error.message };
        }
    }

    async changePassword(body: RequestBodyChangePassword): Promise<{ access_token: string } | { error: string }> {
        try {
            const auth = await this.authModel.findOne({ login: body.login });
            if (!auth) {
                throw new UnauthorizedException('Wrong login');
            }

            const authPassword = await bcrypt.compare(body.password, auth.password);
            if (!authPassword) {
                throw new UnauthorizedException('Wrong password');
            }

            auth.password = await bcrypt.hash(body.newPassword, 10);
            await auth.save();
            
            const payload = {login: auth.login};

            const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

            return { access_token };
        } catch (error) {
            return { error: error.message };
        }
    }
}
