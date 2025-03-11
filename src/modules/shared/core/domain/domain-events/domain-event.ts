import { uuidGenerator } from '../../infrastructure';

export interface DomainEvent<Payload> {
  id: string;
  name: string;
  payload: Payload;
  occurredOn: Date;
}

export function createDomainEvent<Payload>({
  name,
  payload,
}: {
  name: string;
  payload: Payload;
}): DomainEvent<Payload> {
  return {
    id: uuidGenerator.generate(),
    name,
    payload,
    occurredOn: new Date(),
  };
}
