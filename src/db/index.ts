// import { MongoClient, Db } from 'mongodb';
import { connect } from 'mongoose';

// const uri = 'mongodb+srv://bmd:XROUK6czFfldXKxB@daymanager-ssikq.mongodb.net/test?retryWrites=true&w=majority';

const url = process.env.MONGODB_URL;
const dbName = 'test';

connect(`${url}/${dbName}`, { useUnifiedTopology: true, useNewUrlParser: true });