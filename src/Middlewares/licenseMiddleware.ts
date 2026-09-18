import { Request, Response, NextFunction } from "express";
import { validateDomain } from "@abserve/license/LicenseValidator";

export function licenseMiddleware(req: Request, res: Response, next: NextFunction) {
    const hostname = (req.headers.origin || '').toLowerCase();
    console.log(`Validating domain: ${hostname}`);
    

    if(!validateDomain(hostname)) {
        return res.status(403).json({ error: 'Invalid or unauthorized domain license' })
    }

    next()
}