// import validator from 'validator'
import * as mongoose from 'mongoose';

export interface DayMoment {
    date: Date,
    flag: string,
    euro: string,
    km: string,
    justification: string,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
}

const dayMomentSchema = {
    date: {
        type: Date,
        required: [true, 'Data é obrigatória!'],
    },
    flag: {
        type: String,
        required: [true, 'Bandeirada - marca é obrigatória!'],
    },
    euro: {
        type: String,
        required: [true, 'Euros - marca é obrigatório!'],
    },
    km: {
        type: String,
        required: [true, 'Km - marcava é obrigatório!'],
    },
    justification: {
        type: String
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
};

export interface IWorkdayDoc extends mongoose.Document {
    workerId: string,
    vehicleId: string,
    startDate: DayMoment,
    endDate: DayMoment,
    fuel: Number,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
}

interface IWorkdayModel extends mongoose.Model<IWorkdayDoc> {
}

const workdaySchema = new mongoose.Schema<IWorkdayDoc>({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    startDate: {
        type: dayMomentSchema
    },
    endDate: {
        type: dayMomentSchema
    },
    fuel: {
        type: Number
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



export const Workday = mongoose.model<IWorkdayDoc, IWorkdayModel>('Workday', workdaySchema)
