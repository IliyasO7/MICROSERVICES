import 'express-async-errors';
import '../../shared/models/index.js';
import './utils/config.js';
import boot from './utils/boot.js';
import express from 'express';
import { sendResponse } from '../../shared/utils/helper.js';
import routes from './routes/index.js';

const app = express();

app.set('reverse proxy', 1);

app.options('/*', (_, res) => {
  res.sendStatus(200);
});

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);
app.get('/', (req, res) => {
  sendResponse(res, 200, 'Server is working');
});
app.use((err, req, res, next) => {
  console.error(err);
  sendResponse(res, 500, 'internal server error', null, err);
});

boot().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Service is listening on port ${process.env.PORT}`);
  });
});

export default app;
