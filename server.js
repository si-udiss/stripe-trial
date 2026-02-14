/* 
INI ADALAH PEMBAYARAN DENGAN DATA USERS ASLI
DENGAN DIDAFTARKAN DI STRIPE LANGSUNG
*/
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.use(express.json());

// app.use("/api/payment", require("./routes/payment"));

// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({ message: "Internal error" });
// });

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Mongo connected"));

// app.listen(5000, () => console.log("Server running 5000"));

/* 
INI ADALAH PEMBAYARAN DENGAN METODE SESSION,
MENGIRIMKAN URL UNTUK HALAMAN BAYAR
*/
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

app.use("/api/payment/webhook",
  express.raw({type:"application/json"})
);

app.use(express.json());

app.use("/api/payment", require("./routes/payment"));

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("Mongo Connected"));

app.listen(5000,()=>console.log("Server running"));
