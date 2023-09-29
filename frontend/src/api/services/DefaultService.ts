/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Memo } from '../models/Memo';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @returns string Ok
     * @throws ApiError
     */
    public static login({
        requestBody,
    }: {
        requestBody: {
            password: string;
            username: string;
        },
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns void
     * @throws ApiError
     */
    public static logout({
        authorization,
    }: {
        authorization: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/logout',
            headers: {
                'authorization': authorization,
            },
        });
    }

    /**
     * @returns void
     * @throws ApiError
     */
    public static register({
        requestBody,
    }: {
        requestBody: {
            password: string;
            username: string;
        },
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Memo Ok
     * @throws ApiError
     */
    public static findMemo({
        number,
        authorization,
    }: {
        number: number,
        authorization: string,
    }): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/memo/{number}',
            path: {
                'number': number,
            },
            headers: {
                'authorization': authorization,
            },
        });
    }

    /**
     * @returns Memo Ok
     * @throws ApiError
     */
    public static updateMemo({
        number,
        authorization,
        requestBody,
    }: {
        number: number,
        authorization: string,
        requestBody: {
            tags: Array<string>;
            content: string;
        },
    }): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/memo/{number}',
            path: {
                'number': number,
            },
            headers: {
                'authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns void
     * @throws ApiError
     */
    public static deleteMemo({
        number,
        authorization,
    }: {
        number: number,
        authorization: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/memo/{number}',
            path: {
                'number': number,
            },
            headers: {
                'authorization': authorization,
            },
        });
    }

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public static listMemo({
        authorization,
    }: {
        authorization: string,
    }): CancelablePromise<{
        memos: Array<Memo>;
        tags: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/memo',
            headers: {
                'authorization': authorization,
            },
        });
    }

    /**
     * @returns Memo Ok
     * @throws ApiError
     */
    public static createMemo({
        authorization,
        requestBody,
    }: {
        authorization: string,
        requestBody: {
            tags: Array<string>;
            content: string;
        },
    }): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo',
            headers: {
                'authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
