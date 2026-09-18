module.exports = {
    apps: [
        {
            name: 'Airstar',
            namespace: 'airstar',
            cwd: './', // Optional: can be omitted if PM2 is run from project root
            script: 'node_modules/next/dist/bin/next', // ✅ Direct Next.js production script
            args: 'start -p 4002', // ✅ Use `start` with port
            instances: 1,
            exec_mode: 'cluster',
            max_memory_restart: '450M',
            out_file: './logs/airstar/app-out.log',
            error_file: './logs/airstar/app-error.log',
            log_file: './logs/airstar/app-log.log',
            env: {
                NODE_ENV: 'production',
                PORT: '4002',
                NEXT_PUBLIC_DOMAIN: 'airstar',
                NEXT_PUBLIC_BASE_URL: 'https://airstarapi.abservetechdemo.com/',
                NEXT_PUBLIC_MAP_API_KEY: 'AIzaSyD2jX3t-OXp2qqN-qvnDXQzedU2Vh1QAqQ',
                NEXT_PUBLIC_STRIPE_KEY: 'pk_test_51O8MdmIw4HqN1yrd9dVU3WisIp5gNa1yw1k2pqxAI2BaVomEMfRtLXhB4btdngk4dMUucUFUP9G3mOZ0AjtWtsSV00nO1iVOj7',
                NEXT_PUBLIC_GOOGLE_CLIENTID: '865150565468-54rrc2hprr7jlvgh8q8gtqcthb592lts.apps.googleusercontent.com',
                NEXT_PUBLIC_GOOGLE_CLIENTSECRET: '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',
                NEXT_PUBLIC_GOOGLE_REDIRECT_URI: 'https://airstar.abservetechdemo.com/',
                NEXT_PUBLIC_HIDE_SENTITIVE: 'true'
            }
        }
    ]
};
