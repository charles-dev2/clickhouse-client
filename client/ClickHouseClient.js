"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickHouseClient = void 0;
const axios_1 = require("axios");
const Pick = require("stream-json/filters/Pick");
const StreamArray = require("stream-json/streamers/StreamArray");
const zlib = require("zlib");
const stream_json_1 = require("stream-json");
const rxjs_1 = require("rxjs");
const enums_1 = require("./enums");
const ClickHouseClientOptions_1 = require("./interfaces/ClickHouseClientOptions");
class ClickHouseClient {
    /**
     * ClickHouse Service
     */
    constructor(options) {
        this.options = options;
        this.options = Object.assign(new ClickHouseClientOptions_1.ClickHouseClientOptions(), options);
    }
    /**
     * Prepare request options
     */
    _getRequestOptions(query, withoutFormat = false) {
        let url = this._getUrl();
        if (!withoutFormat) {
            query = `${query.trimEnd()} FORMAT ${this.options.format}`;
        }
        const params = {
            query,
            database: this.options.database
        };
        if (this.options.compression != enums_1.ClickHouseCompressionMethod.NONE) {
            params['enable_http_compression'] = 1;
        }
        const requestOptions = {
            url,
            params,
            responseType: 'stream',
            method: 'POST',
            auth: {
                username: this.options.username,
                password: this.options.password
            },
            httpAgent: this.options.httpAgent,
            httpsAgent: this.options.httpsAgent,
            transformResponse: (data) => {
                if (this.options.compression == enums_1.ClickHouseCompressionMethod.BROTLI) {
                    return data.pipe(zlib.createBrotliDecompress());
                }
                else {
                    return data;
                }
            },
            headers: this._getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        };
        return requestOptions;
    }
    /**
     * Prepare headers for request
     */
    _getHeaders() {
        const headers = {};
        switch (this.options.compression) {
            case enums_1.ClickHouseCompressionMethod.GZIP:
                headers['Accept-Encoding'] = 'gzip';
                break;
            case enums_1.ClickHouseCompressionMethod.DEFLATE:
                headers['Accept-Encoding'] = 'deflate';
                break;
            case enums_1.ClickHouseCompressionMethod.BROTLI:
                headers['Accept-Encoding'] = 'br';
        }
        return headers;
    }
    /**
     * Get ClickHouse HTTP Interface URL
     */
    _getUrl() {
        switch (this.options.protocol) {
            case enums_1.ClickHouseConnectionProtocol.HTTP:
                return `http://${this.options.host}:${this.options.port}`;
            case enums_1.ClickHouseConnectionProtocol.HTTPS:
                return `https://${this.options.host}:${this.options.port}`;
        }
    }
    /**
     * Promise based query
     * @private
     */
    _queryPromise(query) {
        return new Promise((resolve, reject) => {
            const _data = [];
            this._queryObservable(query).subscribe({
                error: (error) => {
                    return reject(error);
                },
                next: (row) => {
                    _data.push(row);
                },
                complete: () => {
                    return resolve(_data);
                }
            });
        });
    }
    /**
     * Observable based query
     * @private
     */
    _queryObservable(query) {
        return new rxjs_1.Observable((subscriber) => {
            axios_1.default
                .request(this._getRequestOptions(query))
                .then((response) => {
                const stream = response.data;
                if (this.options.format == enums_1.ClickHouseDataFormat.JSON) {
                    const pipeline = stream
                        .pipe(new stream_json_1.Parser({
                        jsonStreaming: true
                    }))
                        .pipe(new Pick({
                        filter: 'data'
                    }))
                        .pipe(new StreamArray());
                    pipeline
                        .on('data', (row) => {
                        subscriber.next(row.value);
                    })
                        .on('end', () => {
                        subscriber.complete();
                    });
                }
                else {
                    throw new Error('Unsupported data format. Only JSON is supported for now.');
                }
            })
                .catch((reason) => {
                if (reason && reason.response) {
                    let err = '';
                    reason.response.data
                        .on('data', (chunk) => {
                        err += chunk.toString('utf8');
                    })
                        .on('end', () => {
                        this.options.logger.error(err.trim());
                        subscriber.error(err.trim());
                        err = '';
                    });
                }
                else {
                    this.options.logger.error(reason);
                    subscriber.error(reason);
                }
            });
        });
    }
    /**
     * Observable based query
     */
    query(query) {
        return this._queryObservable(query);
    }
    /**
     * Promise based query
     */
    queryPromise(query) {
        return this._queryPromise(query);
    }
    /**
     * Insert data to table (Observable)
     */
    insert(table, data) {
        return new rxjs_1.Observable((subscriber) => {
            let query = `INSERT INTO ${table}`;
            let _data;
            switch (this.options.format) {
                case enums_1.ClickHouseDataFormat.JSON:
                    query += ` FORMAT JSONEachRow`;
                    _data = data.map((d) => JSON.stringify(d)).join('\n');
                    break;
            }
            axios_1.default
                .request(Object.assign(this._getRequestOptions(query, true), {
                responseType: 'stream',
                method: 'POST',
                data: _data,
                httpAgent: this.options.httpAgent,
                httpsAgent: this.options.httpsAgent
            }))
                .then((response) => {
                const stream = response.data;
                stream
                    .on('data', (data) => {
                    // currently nothing to do here
                    // clickhouse http interface returns an empty response
                    // with inserts
                })
                    .on('end', () => {
                    subscriber.complete();
                });
            })
                .catch((reason) => {
                subscriber.error(reason);
                this.options.logger.error(reason);
            });
        });
    }
    /**
     * Insert data to table (Promise)
     */
    insertPromise(table, data) {
        return new Promise((resolve, reject) => {
            this.insert(table, data).subscribe({
                error: (error) => {
                    return reject(error);
                },
                next: (row) => {
                    // currently nothing to do here
                    // clickhouse http interface returns an empty response
                    // with inserts
                },
                complete: () => {
                    return resolve();
                }
            });
        });
    }
    /**
     * Pings the clickhouse server
     *
     * @param timeout timeout in milliseconds, defaults to 3000.
     */
    ping(timeout = 3000) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(`${this._getUrl()}/ping`, {
                timeout,
                httpAgent: this.options.httpAgent,
                httpsAgent: this.options.httpsAgent
            })
                .then((response) => {
                if (response && response.data) {
                    if (response.data == 'Ok.\n') {
                        return resolve(true);
                    }
                }
                return resolve(false);
            })
                .catch((reason) => {
                return reject(reason);
            });
        });
    }
}
exports.ClickHouseClient = ClickHouseClient;
//# sourceMappingURL=ClickHouseClient.js.map