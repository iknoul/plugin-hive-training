import fs from 'fs';
import path from 'path';


const setupEnv = () => {
    const examplePath = path.join(process.cwd(), './', '.env.example');
    const envPath = path.join(process.cwd(), './', '.env');

    if (fs.existsSync(envPath)) {
        // fs.copyFileSync(examplePath, envPath);
        console.log(`.env already exists  skipping.`);
        return;
    }

    if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, envPath);
        console.log(`Created .env from .env.example`);
    } else {
        throw new Error('Can\'t find the env.example file.')
    }
}

setupEnv();