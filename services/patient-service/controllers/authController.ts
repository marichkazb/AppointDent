import { type Request, type Response } from 'express';
import database from '../db/config';
import crypto from 'crypto';

interface Patient {
  email: string
  pass: string
}

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, pass } = req.body;

    if (database === undefined) {
      sendServerError(res);
      return;
    }

    const patient = database.prepare('SELECT * FROM patients WHERE email = ?').get(email) as Patient;

    if (patient === undefined) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    try {
      const hashedInputPass = crypto.createHash('sha256').update(pass).digest('hex');

      const passwordMatch: boolean = hashedInputPass === patient.pass;

      if (!passwordMatch) {
        sendUnauthorized(res, 'Invalid email or password');
        return;
      }

      sendSuccess(res, 'Login successful');
    } catch (compareError) {
      console.error('Error during logging in:', compareError);
      sendServerError(res);
    }
  } catch (error) {
    console.error('Error during logging in:', error);
    sendServerError(res);
  }

  function sendServerError (res: Response): Response {
    return res.status(500).json({ message: 'Server Error' });
  }

  function sendUnauthorized (res: Response, message: string): Response {
    return res.status(401).json({ message });
  }

  function sendSuccess (res: Response, message: string): Response {
    return res.status(200).json({ message });
  }
};
