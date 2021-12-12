import { Transform, TransformCallback } from 'stream';

export function createJsonStream(params?: { prefix: string; postfix: string; }): NodeJS.ReadWriteStream {
    let prefixSent = false;
    const opts = {
        prefix: '[',
        postfix: ']',
        ...(params ?? {}),
    };
    return new Transform({
        writableObjectMode: true,
        encoding: 'utf8',
        transform(chunk: unknown, _encoding: BufferEncoding, callback: TransformCallback) {
            try {
                const data = JSON.stringify(chunk);
                if (!prefixSent) {
                    callback(undefined, opts.prefix + data);
                    prefixSent = true;
                } else {
                    callback(undefined, ', ' + data);
                }
            } catch (e: any) {
                callback(e);
            }
        },
        flush(callback: TransformCallback) {
            let result = '';
            // If we have empty source stream i.e we did not sent anything
            if (!prefixSent) {
                try {
                    JSON.parse(opts.prefix + opts.postfix);
                    result += opts.prefix + opts.postfix;
                } catch (e) {
                    result += opts.prefix + 'null' + opts.postfix;
                }
            } else {
                result = opts.postfix;
            }
            callback(undefined, result);
        }
    });
}
