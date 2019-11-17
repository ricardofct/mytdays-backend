// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

// import { mongoose } from './../db';

interface ICarDoc extends mongoose.Document {
    name: string;
    plate: string;
    owner: string;
    createdAt: Date;
}

interface ICarModel extends mongoose.Model<ICarDoc> {
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
    plateDate: {
        type: Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


export const Car = mongoose.model<ICarDoc, ICarModel>('Car', carSchema)
