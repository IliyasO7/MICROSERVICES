import boot from "./utils/boot.js";
import express from "express";
import { sendResponse } from "../../shared/utils/helper.js";
import routes from "./routes/index.js";
const app = express();

app.set("reverse proxy", 1);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.get("/", (req, res) => {
  sendResponse(res, 200, "Server is working");
});

app.use((err, req, res, next) => {
  //   console.error(err);
  if (err) {
    sendResponse(res, 500, err.message);
  }
});

// app.use((req, res) => {
//   sendResponse(res, 404, "Route Not Found", { path: req.path });
// });

boot().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Service is listening on port ${process.env.PORT}`);
  });
});

export default app;
