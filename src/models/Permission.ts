// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

// import { mongoose } from './../db';

export interface IPermissionsDoc extends mongoose.Document {
    basic: boolean;
    worker: boolean;
    entrepreneur: boolean;
    superhero: boolean;
    owner: string;
    createdAt: Date;
}

interface IPermissionsModel extends mongoose.Model<IPermissionsDoc> {
}

const permissionsSchema = new mongoose.Schema<IPermissionsDoc>({
    basic: {
        type: Boolean,
        required: true
    },
    worker: {
        type: Boolean,
        required: true
    },
    entrepreneur: {
        type: Boolean,
        required: true
    },
    superhero: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    finishedAt: {
        type: Date
    },
})


export const Permissions = mongoose.model<IPermissionsDoc, IPermissionsModel>('Permissions', permissionsSchema)
