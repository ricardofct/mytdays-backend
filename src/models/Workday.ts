// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { Permissions } from './Permission';

// import { mongoose } from './../db';

interface IWorkdayDoc extends mongoose.Document {
    workerId: string,
    carId: string,
    createdAt: Date,
    date: Date,
    inDate: Date,
    outDate: Date,
    flag_marked: string,
    flag_mark: string,
    flag_done: string,
    euro_marked: string,
    euro_mark: string,
    euro_done: string,
    km_marked: string,
    km_mark: string,
    km_done: string,
}

interface IWorkdayModel extends mongoose.Model<IWorkdayDoc> {
}

const workdaySchema = new mongoose.Schema<IWorkdayDoc>({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    },
    date: {
        type: Date,
        required: [true, 'Data é obrigatória!'],
    },
    inDate: {
        type: Date,
        required: [true, 'Data de entrada é obrigatória!'],
    },
    outDate: {
        type: Date,
        required: [true, 'Data de saída é obrigatória!'],
    },
    flag_marked: {
        type: String,
        required: [true, 'Bandeirada - marcava é obrigatória!'],
    },
    flag_mark: {
        type: String,
        required: [true, 'Bandeirada - marca é obrigatória!'],
    },
    flag_done: {
        type: String,
        required: [true, 'Bandeirada - efetuado é obrigatória!'],
    },
    euro_marked: {
        type: String,
        required: [true, 'Euros - marcava é obrigatório!'],
    },
    euro_mark: {
        type: String,
        required: [true, 'Euros - marca é obrigatório!'],
    },
    euro_done: {
        type: String,
        required: [true, 'Euros - efetuado é obrigatório!'],
    },
    km_marked: {
        type: String,
        required: [true, 'Km - marcava é obrigatório!'],
    },
    km_mark: {
        type: String,
        required: [true, 'Km - marca é obrigatório!'],
    },
    km_done: {
        type: String,
        required: [true, 'Km - efetuado é obrigatório!'],
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
