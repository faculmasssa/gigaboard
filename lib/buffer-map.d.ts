declare module 'buffer-map' {
    export type BufferLike = Buffer|ArrayBuffer|ArrayBufferView|SharedArrayBuffer
    export class BufferMap<V> {
        constructor(iterable?: Iterable<[BufferLike, V]>);

        readonly size: number;
      
        get(key: BufferLike): V | undefined;
        has(key: BufferLike): boolean;
        set(key: BufferLike, value: V): this;
        delete(key: BufferLike): boolean;
        clear(): void;
      
        [Symbol.iterator](): IterableIterator<[BufferLike, V]>;
        entries(): IterableIterator<[BufferLike, V]>;
        keys(): IterableIterator<BufferLike>;
        values(): IterableIterator<V>;
      
        forEach(callback: (value: V, key: BufferLike, map: BufferMap<V>) => void, thisArg?: any): void;
      
        toKeys(): BufferLike[];
        toValues(): V[];
        toArray(): V[];
        
        [custom](): Map<string, V>;
    }
}