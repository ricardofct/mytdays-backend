import * as mongoose from 'mongoose';
import { InviteStatus } from '../contants';

export interface IInviteDoc extends mongoose.Document {
    owner: string,
    invitedEmail: string,
    emailAlreadyExist: boolean,
    token: string,
    expiresAt: Date,
    status: number,
    sented: boolean,
    error: string
}

export interface IInviteModel extends mongoose.Model<IInviteDoc> {
}

const inviteSchema = new mongoose.Schema<IInviteDoc>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invitedEmail: {
        type: String,
        required: true,
        lowercase: true,
    },
    emailAlreadyExist: {
        type: Boolean,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        default: InviteStatus.PENDENT,
        required: true
    },
    sented: {
        type: Boolean,
        default: false,
        required: true
    },
    error: {
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
})

export const Invite = mongoose.model<IInviteDoc, IInviteModel>('Invite', inviteSchema)


