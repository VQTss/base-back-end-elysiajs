import { ID, IResponseData, IResponseDataPaginated } from "../entities";


interface IBaseRepository<TData> {
    create(data: TData | TData[]): Promise<IResponseData<TData>>;
    update(data: TData | TData[]): Promise<IResponseData<TData>>;
    delete(id: ID): Promise<IResponseData<TData>>;
    find(id: ID): Promise<IResponseData<TData>>;
    findAll(): Promise<IResponseData<TData[]>>;
    findAllPaginated(page: number, limit: number): Promise<IResponseDataPaginated>;
    count(): Promise<number>;
    search(query: any): Promise<IResponseData<TData[]>>;
    searchPaginated(query: any, page: number, limit: number): Promise<IResponseDataPaginated>;
    exists(id: ID): Promise<boolean>;
}

export default IBaseRepository;