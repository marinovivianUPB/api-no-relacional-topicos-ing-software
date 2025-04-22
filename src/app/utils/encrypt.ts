export interface Encrypt {
    encrypt(data: object): string;
    decrypt(token: string): boolean;
}