// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { Permissions } from './Permission';

// import { mongoose } from './../db';

interface IWorkerDoc extends mongoose.Document {
    workerId: string,
    carId: string,
    active: boolean,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
}

interface IWorkerModel extends mongoose.Model<IWorkerDoc> {
}

const workerSchema = new mongoose.Schema<IWorkerDoc>({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    },
    active: {
        type: Boolean,
        default: true
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

export const Worker = mongoose.model<IWorkerDoc, IWorkerModel>('Worker', workerSchema)
