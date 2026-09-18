import crypto from 'crypto';
import fs from 'fs';

export class LicenseService {
    static createKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
        fs.writeFileSync('public.pem', publicKey.export({ type: 'pkcs1', format: 'pem' }));
        fs.writeFileSync('private.pem', privateKey.export({ type: 'pkcs1', format: 'pem' }));
    }

    static generateLicense(domains: string[]) {
        const privateKey = fs.readFileSync('private.pem', 'utf8');
        const payload = { domains, issueAt: new Date().toISOString() };
        const dataStr = JSON.stringify(payload)
        const sign = crypto.createSign('SHA256');
        sign.update(dataStr);
        sign.end();

        const signature = sign.sign(privateKey, 'base64');
        const license = { payload, signature };
        fs.writeFileSync('license.json', JSON.stringify(license, null, 2));
        console.log(`✅ License generated for domains: ${domains.join(', ')}`);
    }
}