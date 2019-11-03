import * as express from 'express';
import * as morgan from 'morgan';
// import { v4 } from 'uuid';

import { routes } from './routes';
import './db';

const port = process.env.PORT
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(routes);

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}!`)
});


