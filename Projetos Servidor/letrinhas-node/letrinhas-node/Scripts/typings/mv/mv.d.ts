/**
 * Moves a file from one directory to another.
 */
// declare function mv(src: string, dst: string, cb: (err: Error) => void): void;

/**
 * Moves a file from one directory to another.
 */
// declare function mv(src: string, dst: string, options: { mkdirp: boolean; clobber: boolean }, cb: (err: Error) => void): void;

declare module "mv" {
    /**
     * Moves a file from one directory to another.
     */
    function mv(src: string, dst: string, cb: (err: Error) => void): void;
    
    /**
     * Moves a file from one directory to another.
     */
    function mv(src: string, dst: string, options: { mkdirp: boolean; clobber: boolean }, cb: (err: Error) => void): void;

    export = mv;
}