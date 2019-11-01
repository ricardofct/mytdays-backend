import { MongoClient, Db } from 'mongodb';

// const uri = 'mongodb+srv://bmd:XROUK6czFfldXKxB@daymanager-ssikq.mongodb.net/test?retryWrites=true&w=majority';

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new MongoClient(url, { useUnifiedTopology: true });

const connect = async (callback: (db: Db) => any) => {
    try {
        await client.connect();
        const mongodb = client.db(dbName);
        // const collection = mongodb.collection('users');
        // const find = collection.find({});
        // return await find.toArray();
        console.log('tried');
        return await callback(mongodb);
    } catch (e) {
        console.log(`Error: ${e}`);
    } finally {
        client.close();
        console.log('closed');
    }
}

const users = (mongodb: Db) => mongodb.collection('users');

export {
    connect,
    users
};