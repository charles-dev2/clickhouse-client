"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickHouseClientOptions = exports.ClickHouseSettings = void 0;
const enums_1 = require("../enums");
class ClickHouseSettings {
    constructor() {
        /**
         * Enables or disables X-ClickHouse-Progress HTTP response headers in clickhouse-server responses.
         *
         * Default: 0
         */
        this.send_progress_in_http_headers = 0;
        /**
         * You can enable response buffering on the server-side. The buffer_size and wait_end_of_query URL parameters are provided for this purpose.
         * buffer_size determines the number of bytes in the result to buffer in the server memory.
         *
         * If a result body is larger than this threshold, the buffer is written to the HTTP channel, and the remaining data is sent directly to the HTTP channel.
         * To ensure that the entire response is buffered, set wait_end_of_query=1. In this case, the data that is not stored in memory will be buffered in a temporary server file.
         *
         * Default: 1
         */
        this.wait_end_of_query = 1;
        /**
         * You can enable response buffering on the server-side. The buffer_size and wait_end_of_query URL parameters are provided for this purpose.
         * buffer_size determines the number of bytes in the result to buffer in the server memory.
         *
         * If a result body is larger than this threshold, the buffer is written to the HTTP channel, and the remaining data is sent directly to the HTTP channel.
         * To ensure that the entire response is buffered, set wait_end_of_query=1. In this case, the data that is not stored in memory will be buffered in a temporary server file.
         *
         * Default: 1048576
         */
        this.buffer_size = 1048576;
    }
}
exports.ClickHouseSettings = ClickHouseSettings;
class ClickHouseClientOptions {
    /**
     * ClickHouse Connection Options
     */
    constructor() {
        /**
         * ClickHouse Server Identifier
         *
         * Default: CLICKHOUSE_DEFAULT
         */
        this.name = 'CLICKHOUSE_DEFAULT';
        /**
         * ClickHouse Host
         *
         * Default: 127.0.0.1
         */
        this.host = "127.0.0.1";
        /**
         * ClickHouse Port
         *
         * Default: 8123
         */
        this.port = 8123;
        /**
         * ClickHouse Username
         *
         * Default: default
         */
        this.username = "default";
        /**
         * ClickHouse Password
         *
         * Default: <empty>
         */
        this.password = "";
        /**
         * ClickHouse Database
         *
         * Default: default
         */
        this.database = "default";
        /**
         * HTTP Interface Protocol
         *
         * Default: HTTP
         */
        this.protocol = enums_1.ClickHouseConnectionProtocol.HTTP;
        /**
         * HTTP Interface Compression Method
         *
         * Default: NONE
         */
        this.compression = enums_1.ClickHouseCompressionMethod.NONE;
        /**
         * Input & Output Data Format
         *
         * Default: JSON
         * @note Currently, only JSON is supported.
         */
        this.format = enums_1.ClickHouseDataFormat.JSON;
        /**
         * HTTP Interface Connection Settings
         */
        this.settings = new ClickHouseSettings();
        /**
         * Logger Instance
         *
         * Default: console
         * @note A logger instance must implement `Console` interface
         */
        this.logger = console;
        if (this.settings) {
            this.settings = Object.assign(new ClickHouseSettings(), this.settings);
        }
    }
}
exports.ClickHouseClientOptions = ClickHouseClientOptions;
//# sourceMappingURL=ClickHouseClientOptions.js.map