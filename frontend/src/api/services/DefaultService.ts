/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Memo } from '../models/Memo';
import type { MemoSummary } from '../models/MemoSummary';

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
     * @returns Memo Ok
     * @throws ApiError
     */
    public static findMemo({
        memoId,
        authorization,
    }: {
        memoId: number,
        authorization: string,
    }): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/memo/{memoId}',
            path: {
                'memoId': memoId,
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
        memoId,
        authorization,
        requestBody,
    }: {
        memoId: number,
        authorization: string,
        requestBody: {
            memo: Memo;
        },
    }): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/memo/{memoId}',
            path: {
                'memoId': memoId,
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
        memoId,
        authorization,
    }: {
        memoId: number,
        authorization: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/memo/{memoId}',
            path: {
                'memoId': memoId,
            },
            headers: {
                'authorization': authorization,
            },
        });
    }

    /**
     * @returns MemoSummary Ok
     * @throws ApiError
     */
    public static listMemo({
        authorization,
    }: {
        authorization: string,
    }): CancelablePromise<Array<MemoSummary>> {
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
    }: {
        authorization: string,
    }): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memo',
            headers: {
                'authorization': authorization,
            },
        });
    }

}
