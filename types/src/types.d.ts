export type TMiddleware = (req: any, res: any, next: Function) => any;
export type TRoute = {
    path?: string;
    route?: string;
    method?: string;
    handler: TMiddleware;
    middlewares?: Array<TMiddleware>;
};
