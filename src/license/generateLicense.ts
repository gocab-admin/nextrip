import { LicenseService } from "./LicenseService";

const domainsArg = process.argv[2];
if(!domainsArg) {
    console.error('Please provide domains: npm run generate-license -- domain1.com,domain2.com');
    process.exit(1)
}

const domains = domainsArg.split(',').map(domain => domain.trim())
LicenseService.generateLicense(domains)