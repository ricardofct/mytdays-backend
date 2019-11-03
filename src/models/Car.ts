// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

// import { mongoose } from './../db';

interface ICarDoc extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    tokens: any;
    passwordResetToken: string;
    passwordResetExpires: Date;
    generateAuthToken(): Promise<string>;
}

interface ICarModel extends mongoose.Model<ICarDoc> {
    findByCredentials(email: string, password: string): Promise<ICarDoc>;
}

const carSchema = new mongoose.Schema<ICarDoc>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    plate: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


export const Car = mongoose.model<ICarDoc, ICarModel>('Car', carSchema)
