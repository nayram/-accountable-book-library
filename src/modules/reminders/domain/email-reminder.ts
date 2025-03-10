export interface EmailReminder {
  from: string;
  to: string;
  payload: {
    message: string;
    subject: string;
  };
}
