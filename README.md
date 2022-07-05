[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=archbuddy_backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=archbuddy_backend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=archbuddy_backend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=archbuddy_backend)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=archbuddy_backend&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=archbuddy_backend)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=archbuddy_backend&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=archbuddy_backend)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=archbuddy_backend&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=archbuddy_backend)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=archbuddy_backend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=archbuddy_backend)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=archbuddy_backend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=archbuddy_backend)


# backend
Backend to handle all application interaction, authentication and so on

Swagger url: http://localhost:3000/doc

Create a `.env` file with this content:
```
LOG_LEVEL=debug
APP_PORT=3000
MONGO_DBNAME=archBuddy
MONGO_PORT=27017
MONGO_USER=
MONGO_PWD=
MONGO_SSL=false
AUTH_PROVIDERS=google
AUTH_PROVIDER_GOOGLE_ID=
AUTH_PROVIDER_GOOGLE_AUTH_ENDPOINT=
AUTH_JWT_SECRET=
#When ommited cors is disabled
CORS_ORIGIN=http://localhost:3001
```
