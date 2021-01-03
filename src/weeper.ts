import { HTTPOptions } from "https://deno.land/std@0.83.0/http/server.ts";
import { Server, ServerRequest, parseAddrFromStr } from '../deps.ts'

type handler = (req: ServerRequest) => void

// https://stackoverflow.com/a/49094809
class RouteMap {
    private map: {
        [path: string]: {
            [method: string]: handler
        }
    }

    constructor () {
        this.map = {}
    }


    public get (path: string, method: string): handler | undefined {
        if (!this.map[path]) {
            return undefined
        }
        return this.map[path][method]
    }

    public set (path: string, method: string, cb: handler): void {
        if (!this.map[path]) this.map[path] = {}
        this.map[path][method] = cb
    }
}

class Weeper {
    private routes: RouteMap
    private errorHandlers: Map<number, handler>

    constructor () {
        this.routes = new RouteMap()
        this.errorHandlers = new Map<number, handler>()
    }

    handle (path: string, method: string, cb: handler) {
        this.routes.set(path, method, cb)
    }

    setErrorHandler (code: number, cb: handler) {
        this.errorHandlers.set(code, cb)
    }

    async listen (addr: string | HTTPOptions) {
        if (typeof addr == 'string') addr = parseAddrFromStr(addr)
        const listener = Deno.listen(addr)
        const server = new Server(listener)

        for await (const req of server) {
            const url = req.url.split('?')[0]
            const handler = this.routes.get(url, req.method)

            console.log(this.routes)

            if (handler !== undefined) {
                handler(req)
            } else {
                const errorHandler = this.errorHandlers.get(404)
                console.log(req.url)
                if (errorHandler) errorHandler(req)
            }
        }
    }
}

export default Weeper
