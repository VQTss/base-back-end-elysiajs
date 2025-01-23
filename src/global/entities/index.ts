import { StatusCodes } from '../enums/index'

export interface IResponseData<TData> {
    data: TData;
    status: StatusCodes;
    message: string;
    description?: string;
    errors?: { [key: string]: any }[];
    stack?: any,
    redirect?: {
        path: string;
    };
    type?: string;
    fieldsModified?: number;
    documentsModified?: number;
}


export interface IResponseDataPaginated extends IResponseData<unknown> {
    page: number;
    limit: number;
    filterCount: number;
    totalCount?: number;
}

export type ID = string | number