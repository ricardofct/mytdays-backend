import * as express from 'express';
// import { v4 } from 'uuid';

import { routes } from './routes';
import './db';

const port = process.env.PORT
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}!`)
});


