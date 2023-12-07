/**
 * mqtt/mqtt.ts
 *
 * @description :: MQTT setup file for the service.
 * @version     :: 1.0
 */

import * as mqtt from 'mqtt';
import { heartbeat } from './heartbeat';

/**
 * @description the MQTT client used to communicate with the MQTT broker.
 * @see mqttClient.setup for more information.
 */
export let client = undefined as mqtt.MqttClient | undefined;
export const mqttClient = {
  setup: async (serviceName: string): Promise<void> => {
    const broker: string = process.env.BROKER ?? 'mqtt://localhost:1883';
    client = mqtt.connect(broker);
    client.on('connect', () => {
      if (client != null) void heartbeat(client, serviceName, 1000);
    });
  }
};