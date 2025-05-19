const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

app.use('/', authRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🔐 Auth-service corriendo en puerto ${PORT}`);
});
