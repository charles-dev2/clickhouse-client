import { Observable } from 'rxjs';
import { ClickHouseClientOptions } from './interfaces/ClickHouseClientOptions';
export declare class ClickHouseClient {
    private options;
    /**
     * ClickHouse Service
     */
    constructor(options: ClickHouseClientOptions);
    /**
     * Prepare request options
     */
    private _getRequestOptions;
    /**
     * Prepare headers for request
     */
    private _getHeaders;
    /**
     * Get ClickHouse HTTP Interface URL
     */
    private _getUrl;
    /**
     * Promise based query
     * @private
     */
    private _queryPromise;
    /**
     * Observable based query
     * @private
     */
    private _queryObservable;
    /**
     * Observable based query
     */
    query<T = any>(query: string): Observable<T>;
    /**
     * Promise based query
     */
    queryPromise<T = any>(query: string): Promise<T[]>;
    /**
     * Insert data to table (Observable)
     */
    insert<T = any>(table: string, data: T[]): Observable<void>;
    /**
     * Insert data to table (Promise)
     */
    insertPromise<T = any>(table: string, data: T[]): Promise<void>;
    /**
     * Pings the clickhouse server
     *
     * @param timeout timeout in milliseconds, defaults to 3000.
     */
    ping(timeout?: number): Promise<boolean>;
}
