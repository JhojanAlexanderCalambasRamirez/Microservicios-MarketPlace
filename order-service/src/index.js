const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ordenesRoutes = require('./routes/ordenesRoutes');
app.use('/ordenes', ordenesRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`📦 Order-service corriendo en puerto ${PORT}`);
});
