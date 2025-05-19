const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importación de rutas
const authRoutes = require('./routes/authRoutes');

// Montaje de rutas
app.use('/', authRoutes); // ← Esto es lo que expone /register, /login, etc.

// Puerto
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🔐 Auth-service corriendo en puerto ${PORT}`);
});
