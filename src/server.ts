import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || "5001";
const MONGO_URI = process.env.MONGO_URI || "no-mongo-uri";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
