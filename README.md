npm test outside bankly and npm test inside bankly. will probably need to create a .env. For example:

SECRET_KEY=dev-secret
DATABASE_URL=postgresql://user:pass@127.0.0.1:5432/bankly
DATABASE_URL_TEST=postgresql://user:pass@127.0.0.1:5432/bankly_test

in the code/ my own .env i preset user: brandon password: password123
