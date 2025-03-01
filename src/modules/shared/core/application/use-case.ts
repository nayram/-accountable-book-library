export type UseCase<Request, Response> = (request: Request) => Promise<Response>;
