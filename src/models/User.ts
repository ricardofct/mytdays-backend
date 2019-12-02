// import validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { Permissions, IPermissionsDoc } from './Permission';

// import { mongoose } from './../db';

export interface IUserDoc extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    permissions: IPermissionsDoc;
    createdAt: Date;
    tokens: any;
    loginTries: number;
    loginTriesResetAt: Date;
    passwordResetToken: string;
    passwordResetExpires: Date;
    active: boolean;
    generateAuthToken(): Promise<string>;
}

interface IUserModel extends mongoose.Model<IUserDoc> {
    findByCredentials(email: string, password: string): Promise<IUserDoc>;
}

const userSchema = new mongoose.Schema<IUserDoc>({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório!'],
        unique: [true, 'Ocorreu um erro com o seu email, porfavor tente mais tarde! Se o erro persistir contacte a equipa de suporte'],
        lowercase: true,
        // validate: {
        //     validator: function (props) { return validatorJs.isEmail(props.value) },
        //     msg: 'Email invalid!'
        // }
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória!'],
        // select: false,
        minLength: 7
    },
    permissions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permissions',
        // select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tokens: {
        type: [{
            token: {
                type: String,
                required: true
            }
        }],
        // select: false,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginTries: {
        type: Number,
        default: 5,
    },
    loginTriesResetAt: {
        type: Date
    },
    passwordResetToken: {
        type: String,
        // select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    active: {
        type: Boolean,
        default: true
    }

})

userSchema.pre<IUserDoc>('save', async function (next) {
    // Hash the password before saving the user model
    const user = this;

    if (this.isNew) {
        const permissions = new Permissions({ basic: true, worker: false, entrepreneur: false, superhero: false });
        await permissions.save();
        user.permissions = permissions._id;
    }

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this;

    user.tokens = user.tokens.filter(
        oldtoken => {
            try {
                const decoded = jwt.verify(oldtoken.token, process.env.JWT_KEY);
                return decoded ? true : false;
            } catch (err) {
                return false;
            }
        }
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: process.env.TOKEN_LIFE
    })

    user.tokens = user.tokens.concat({ token })
    user.lastLogin = new Date();
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    // Search for a user by email and password.

    const user = await User.findOne({ email });
    const now = new Date();
    if (!user.loginTries && user.loginTriesResetAt > now) {
        const retryDate = ((user.loginTriesResetAt.valueOf() - now.valueOf()) / 1000) / 60;
        throw new Error('Tentativas de entrada excedidas! Por favor, tente novamente dentro de ' + retryDate + ' minutos.')
    }
    if (!user) {
        throw new Error('Credenciais inválidas!')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        user.loginTries--;
        if (!user.loginTries) {
            now.setHours(now.getHours() + 1)
            user.loginTriesResetAt = now;
        }
        user.save();
        throw new Error('Credenciais inválidas!')
    }
    user.loginTries = 3;

    return user
}

export const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)
