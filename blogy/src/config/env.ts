// config/env.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvVars {
    PORT: number;
    DB_URL: string;
    JWT_SECRET: string;
    NODE_ENV: string;
}

function getEnv(): EnvVars {
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
    const { DB_URL, JWT_SECRET, NODE_ENV } = process.env;

    if (!PORT || !DB_URL || !JWT_SECRET) {
        throw new Error('Missing environment variables');
    }

    return {
        PORT,
        DB_URL,
        JWT_SECRET,
        NODE_ENV: NODE_ENV || 'development'
    };
}

export const env = getEnv();
