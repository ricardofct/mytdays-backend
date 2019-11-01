import * as express from 'express';
import { v4 } from 'uuid';

import { connect } from './db';
import { routes } from './routes';

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}!`)
});


