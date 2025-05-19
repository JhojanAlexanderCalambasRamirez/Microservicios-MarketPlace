const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const rutas = require('./routes/notificacionesRoutes');
app.use('/notificaciones', rutas);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🔔 Notification-service corriendo en puerto ${PORT}`);
});
