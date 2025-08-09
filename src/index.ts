import type { NextApiRequest, NextApiResponse } from 'next'


interface GenericResponse {
    status: (code: number) => GenericResponse; 
    end: () => void; 
}

type NextFunction = () => void; 
type GenericRequest = {}; 

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

        const errorRate = options.errorRate ?? 0; 
        if(Math.random() < errorRate) {
            console.log("[Chaos] Injecting a 500 Internal Server Error")

            res.status(500).end(); 
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