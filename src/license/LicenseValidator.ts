import fs from 'fs';
import crypto from 'crypto';

interface License {
    payload: { domains: string[], issuedAt: string }
    signature: string
}

let license: License
let publicKey: string

try {
    const raw = fs.readFileSync('license.json', 'utf-8')
    license = JSON.parse(raw)
    publicKey = fs.readFileSync('public.pem', 'utf-8')
} catch (error) {
    console.error('License or public key missing/invalid.', error);
    process.exit(1)
}

export function validateDomain(hostname: string): boolean {
    const { payload, signature } = license;
    const verifier = crypto.createVerify('SHA256');
    verifier.update(JSON.stringify(payload));
    verifier.end();

    const isValid = verifier.verify(publicKey, signature, 'base64');
    const domainAllowed = payload.domains.includes(hostname);
    console.log(`Domain validation for ${hostname}: ${isValid}, Allowed: ${domainAllowed}`);
    

    return isValid && (domainAllowed || hostname === 'localhost');
}