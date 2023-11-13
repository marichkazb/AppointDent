import { config } from 'dotenv';
import { type Request, type Response } from 'express';
import database from './db/config';
import { app, port } from './config/config';
import { mqttClient } from './mqtt/mqtt';
import { basename, dirname } from 'path';

const SERVICES_PATH: string = basename(dirname(__dirname));
void mqttClient.setup(SERVICES_PATH);

config();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from: AppointDent - Appointments Service');
});
app.listen(port, () => {
  console.log('AppointDent - Appointments Service');
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Using database: ${database?.name}`);
  console.log(`Database connection: ${((database?.open) ?? false) ? 'OK' : 'ERROR'}`);
});
