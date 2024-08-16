const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')




//routes
const authRoutes = require("./src/routes/user");
const adminRoutes = require("./src/routes/admin/auth");
const categoryRoutes = require("./src/routes/category");
const productRoutes = require("./src/routes/product");
const settingsRoutes = require("./src/routes/admin/settings");
const mediaRoutes = require("./src/routes/admin/media");
const addressRoutes = require("./src/routes/address");
const orderRoutes = require("./src/routes/order");
const customersRoute = require("./src/routes/admin/customers");
const attributeRoute = require("./src/routes/admin/attribute");
const brandRoute = require("./src/routes/brand");
const campaignRoute = require("./src/routes/campaign");
const seedRoute = require("./src/routes/admin/seeder");
const reviewRoute = require("./src/routes/review");
const notificationRoute = require("./src/routes/notification");
const {storage} = require('./secretDb.json')
//environment variable or you can say constants
env.config();






//cloudinary config
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: storage.cloudinary.name, 
  api_key: storage.cloudinary.key, 
  api_secret: storage.cloudinary.secret
});


// mongodb connection
//mongodb+srv://root:<password>@cluster0.8pl1w.mongodb.net/<dbname>?retryWrites=true&w=majority
console.log(process.env.MONGO_DB_URL);
mongoose
  .connect(
    `${process.env.MONGO_DB_URL}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", authRoutes);
app.use("/api", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/customer", customersRoute);
app.use("/api/attribute", attributeRoute);
app.use("/api/brand", brandRoute);
app.use("/api/campaign", campaignRoute);
app.use("/api/seeder", seedRoute);
app.use("/api/review", reviewRoute);
app.use("/api/notification", notificationRoute);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile,{swaggerOptions:{persistAuthorization:true}}))



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
