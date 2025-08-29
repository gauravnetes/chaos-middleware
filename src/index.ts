import type { NextApiRequest, NextApiResponse } from 'next'


interface GenericResponse {
    status: (code: number) => GenericResponse; 
    end: () => void; 
    json: (body: any) => void; 
}

type NextFunction = () => void; 
interface GenericRequest {
    method?: string; 
    query?: Record<string, any> 
}; 

export interface ChaosError {
    /**
     * The HTTP status code to return.
     * @default 500
     */
    status: number; 
    /**
     * An optional Error body to send with the JSON response. 
     */
    body: Record<string, any>
}

// interface of chaosOptions
export interface ChaosOptions {
    /**
     * latency can be a fixed number of miliseconds
     * for variable delay, a tuple [min, max]
     */
    latency?: number | [number, number]; 

    /**
     * Probability of occuring of an error in range of 0 (never) and 1 (always)
     * @default 0
     */
    errorRate?: number; 

    error?: ChaosError; 

    /**
     * An Array of HTTP methods (e.g. 'GET', 'POST') to which chaos will
     * be applied. If not provided, chaos is applied to all methods 
     * @default undefined (all methods)
     */
    methods?: string[]; 

    /**
     * If provided, chaos will only be activated when a query parameter 
     * with this name has a value of 'true' (e.g. ?chaos=true). 
     */
    activationKeyword?: string
}


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 

/**
 * 
 * @param options The config for latency and errorRate
 * @returns An express/next.js compatible middleware function
 */

export const chaosMiddleware = (options: ChaosOptions = {}) => {

    return async (req: GenericRequest, res: GenericResponse, next: NextFunction) => {
        if(process.env.NODE_ENV === 'production') {
            return next(); 
        }

        if(options.activationKeyword) {
            if(!req.query || req.query[options.activationKeyword] !== 'true') 
                return next(); 

            console.log(`[CHAOS] activated by '${options.activationKeyword}=true' query parameter`)
        }


        if(options.methods && options.methods.length > 0) {
            const reqMethod = req.method?.toUpperCase(); 
            const allowedMethods = options.methods.map(m => m.toUpperCase()); 
            if(!reqMethod || !allowedMethods.includes(reqMethod)) {
                return next(); 
            }
        }

        const errorRate = options.errorRate ?? 0; 
        if(Math.random() < errorRate) {
            const customError = options.error; 
            const status = customError?.status || 500; 
            const body = customError?.body; 
            console.log("[Chaos] Injecting a 500 Internal Server Error")

            res.status(status); 
            if(body) 
                res.json(body)
            else 
                res.end()

            return; 
        }

        if(options.latency) {
            let latency_ms = 0; 
            if(Array.isArray(options.latency)) {
                const [min, max] = options.latency
                latency_ms = Math.floor(Math.random() * (max - min + 1) + min)
            } else {
                latency_ms = options.latency
            }

            console.log(`[Chaos] Delaying Response by ${latency_ms}ms...`); 
            await delay(latency_ms); 
        }
        return next(); 
    }
}