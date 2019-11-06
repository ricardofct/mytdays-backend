import * as mongoose from 'mongoose';

export interface IAuditDoc extends mongoose.Document {
    user: string,
    auditType: number,
    ipConn: string,
    date: Date
}

export interface IAuditModel extends mongoose.Model<IAuditDoc> {
}

const AuditSchema = new mongoose.Schema<IAuditDoc>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    auditType: {
        type: Number,
        required: true,
    },
    ipConn: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

export const Audit = mongoose.model<IAuditDoc, IAuditModel>('Audit', AuditSchema)


