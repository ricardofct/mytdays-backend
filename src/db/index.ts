import { connect } from 'mongoose';

const url = process.env.MONGODB_URL;

connect(`${url}`, { useUnifiedTopology: true, useNewUrlParser: true });