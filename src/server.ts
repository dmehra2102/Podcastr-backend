import App from "./app";
import AuthRoute from "./routes/auth.routes";
import MediaRoute from "./routes/media.routes";
import UserRoute from "./routes/user.routes";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new MediaRoute()]);

app.listen();
