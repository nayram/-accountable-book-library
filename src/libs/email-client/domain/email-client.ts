export interface EmailClient {
  send(parms: { to: string; subject: string; from: string; payload: string }): Promise<void>;
}
