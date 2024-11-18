// /Users/roopeshvishwakarma/Pace/NODEJS/app.js
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./src/db');
const syncMetaController = require('./src/controllers/syncMetaController');

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRouter = require('./src/routes');
app.use('/api', indexRouter);

const startServer = async () => {
  try {
    await syncMetaController.initializeSyncMeta();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

