import path from "path";
import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";
import routes from "./controllers/index.js";
import helpers from "./utils/helpers.js";
import sequelize from "./config/connection.js";
import sessionConnect from "connect-session-sequelize";

import { __dirname } from "./utils/fsUtils.js";

const SequelizeStore = sessionConnect(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
  secret: "9da4b246-7fd2-4270-a184-db714d5ec172",
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sess));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
