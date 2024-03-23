export type TMiddleware = (req: any, res: any, next: Function) => any;
export type TRoute = {
    route: string;
    method?: string;
    handler: TMiddleware;
    middlewares?: Array<TMiddleware>;
};
