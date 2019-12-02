''// import validator from 'validator';
import * as mongoose from 'mongoose';
import { IVehicleDoc } from './Vehicle';

// import { mongoose } from './../db';

export interface IWorkerDoc extends mongoose.Document {
    ownerId: string,
    userId: string,
    active: boolean,
    vehicles: string[],
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
}

interface IWorkerModel extends mongoose.Model<IWorkerDoc> { }

const workerSchema = new mongoose.Schema<IWorkerDoc>({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    vehicles: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle'
        }],
        required: true
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
''