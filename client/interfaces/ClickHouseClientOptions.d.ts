/// <reference types="node" />
import { ClickHouseCompressionMethod, ClickHouseConnectionProtocol, ClickHouseDataFormat } from "../enums";
import * as http from "http";
import * as https from "https";
export declare class ClickHouseSettings {
    /**
     * Enables or disables X-ClickHouse-Progress HTTP response headers in clickhouse-server responses.
     *
     * Default: 0
     */
    send_progress_in_http_headers?: 0 | 1;
    /**
     * You can enable response buffering on the server-side. The buffer_size and wait_end_of_query URL parameters are provided for this purpose.
     * buffer_size determines the number of bytes in the result to buffer in the server memory.
     *
     * If a result body is larger than this threshold, the buffer is written to the HTTP channel, and the remaining data is sent directly to the HTTP channel.
     * To ensure that the entire response is buffered, set wait_end_of_query=1. In this case, the data that is not stored in memory will be buffered in a temporary server file.
     *
     * Default: 1
     */
    wait_end_of_query?: 0 | 1;
    /**
     * You can enable response buffering on the server-side. The buffer_size and wait_end_of_query URL parameters are provided for this purpose.
     * buffer_size determines the number of bytes in the result to buffer in the server memory.
     *
     * If a result body is larger than this threshold, the buffer is written to the HTTP channel, and the remaining data is sent directly to the HTTP channel.
     * To ensure that the entire response is buffered, set wait_end_of_query=1. In this case, the data that is not stored in memory will be buffered in a temporary server file.
     *
     * Default: 1048576
     */
    buffer_size?: number;
}
export declare class ClickHouseClientOptions {
    /**
     * ClickHouse Server Identifier
     *
     * Default: CLICKHOUSE_DEFAULT
     */
    name?: string;
    /**
     * ClickHouse Host
     *
     * Default: 127.0.0.1
     */
    host?: string;
    /**
     * ClickHouse Port
     *
     * Default: 8123
     */
    port?: number;
    /**
     * ClickHouse Username
     *
     * Default: default
     */
    username?: string;
    /**
     * ClickHouse Password
     *
     * Default: <empty>
     */
    password?: string;
    /**
     * ClickHouse Database
     *
     * Default: default
     */
    database?: string;
    /**
     * HTTP Interface Protocol
     *
     * Default: HTTP
     */
    protocol?: ClickHouseConnectionProtocol;
    /**
     * HTTP Agent
     *
     * `httpAgent` define a custom agent to be used when performing http requests, in node.js.
     * This allows options to be added like `keepAlive` that are not enabled by default.
     *
     * Default: `undefined`
     */
    httpAgent?: http.Agent;
    /**
     * HTTPS Agent
     *
     * `httpsAgent` define a custom agent to be used when performing https requests in node.js
     * This allows options to be added like `keepAlive` that are not enabled by default.
     *
     * Default: `undefined`
     */
    httpsAgent?: https.Agent;
    /**
     * HTTP Interface Compression Method
     *
     * Default: NONE
     */
    compression?: ClickHouseCompressionMethod;
    /**
     * Input & Output Data Format
     *
     * Default: JSON
     * @note Currently, only JSON is supported.
     */
    format?: ClickHouseDataFormat;
    /**
     * HTTP Interface Connection Settings
     */
    settings?: ClickHouseSettings;
    /**
     * Logger Instance
     *
     * Default: console
     * @note A logger instance must implement `Console` interface
     */
    logger?: Console;
    /**
     * ClickHouse Connection Options
     */
    constructor();
}
