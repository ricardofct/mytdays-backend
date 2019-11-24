// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

// import { mongoose } from './../db';

interface ICarDoc extends mongoose.Document {
    name: string;
    plate: string;
    plateDate: Date;
    ownerId: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

interface ICarModel extends mongoose.Model<ICarDoc> {
}

const carSchema = new mongoose.Schema<ICarDoc>({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório!'],
        trim: true
    },
    plate: {
        type: String,
        required: [true, 'Matricula é obrigatória!'],
        lowercase: true,
    },
    plateDate: {
        type: Date,
        required: [true, 'Data de matricula é obrigatória!']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})


export const Car = mongoose.model<ICarDoc, ICarModel>('Car', carSchema)
