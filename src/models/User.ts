// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

// import { mongoose } from './../db';

interface IUserDoc extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    tokens: any;
    generateAuthToken(): Promise<string>;
}

interface IUserModel extends mongoose.Model<IUserDoc> {
    findByCredentials(email: string, password: string): Promise<IUserDoc>;
}

const userSchema = new mongoose.Schema<IUserDoc>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // validate: {
        //     validator: function (props) { return validatorJs.isEmail(props.value) },
        //     msg: 'Email invalid!'
        // }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre<IUserDoc>('save', async function (next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: 86400
    })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Invalid login credentials')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials')
    }
    return user
}

export const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)
