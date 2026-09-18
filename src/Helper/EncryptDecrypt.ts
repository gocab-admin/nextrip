import crypto from 'crypto'

class EncryptDecrypt {
    static readonly encrypt = async (plainText: any, secretKey: any) => {
        let m = crypto.createHash('md5');
        m.update(secretKey);
        let key = m.digest();
        let iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
        let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let encoded = cipher.update(plainText, 'utf8', 'hex');
        encoded += cipher.final('hex');
        return encoded;
    }

    static readonly decrypt = async (encText: any, secretKey: any) => {
        let m = crypto.createHash('md5');
        m.update(secretKey)
        let key = m.digest();
        let iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
        let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decoded = decipher.update(encText, 'hex', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }
}

export { EncryptDecrypt }