// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

// import { mongoose } from './../db';

interface IDomainDoc extends mongoose.Document {
    value: string;
    description: string;
    type: string;
    active: boolean
    createdAt: Date;
}

interface IDomainModel extends mongoose.Model<IDomainDoc> {
}

const domainSchema = new mongoose.Schema<IDomainDoc>({
    value: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


export const Domain = mongoose.model<IDomainDoc, IDomainModel>('Domain', domainSchema)
