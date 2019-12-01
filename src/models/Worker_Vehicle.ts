// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { Permissions } from './Permission';

// import { mongoose } from './../db';

interface IWorkerVehicleDoc extends mongoose.Document {
    workerId: string,
    vehicleId: string,
    active: boolean,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
}

interface IWorkerVehicleModel extends mongoose.Model<IWorkerVehicleDoc> {
}

const workerVehicleSchema = new mongoose.Schema<IWorkerVehicleDoc>({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
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

export const WorkerVehicle = mongoose.model<IWorkerVehicleDoc, IWorkerVehicleModel>('WorkerVehicle', workerVehicleSchema)
