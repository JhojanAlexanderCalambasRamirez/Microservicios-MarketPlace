const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const productosRoutes = require('./routes/productosRoutes');
app.use('/productos', productosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🛍️ Product-service corriendo en puerto ${PORT}`);
});
