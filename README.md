# Larsen Toulousaine

Votre agenda metal toulousain !

# Starter project

This is the starter project for the fullstack tutorial with Next.js and Prisma. You can find the final version of this project in the [`final`](https://github.com/prisma/blogr-nextjs-prisma/tree/final) branch of this repo.

## Get started

Copy, paste and rename sample.env to **.env** and fill all the variables.

Run server:

`npm run dev`

### Prisma

> ⚠️ **Important (Direct Production Environment):**
> **Never** run `npx prisma db push` or `npx prisma migrate dev` directly against the production database. These commands can trigger a schema reset (`prisma migrate reset`) and destroy production data.

To safely apply Prisma schema changes:

1. **Create a migration folder manually:**
   Create a timestamped directory inside `prisma/migrations/`, for example:
   `prisma/migrations/YYYYMMDDHHMMSS_your_migration_name/`

2. **Create the SQL migration file:**
   Inside that folder, create a `migration.sql` file containing the required DDL statements (`CREATE TABLE`, `ALTER TABLE`, etc.).

3. **Apply the migration to the database:**
   ```bash
   npx prisma migrate deploy

4. **Regenerate the Prisma client:**
   ```bash
   npx prisma generate

### Tools

This projet uses Next.js, Netlify for deployment and Cloudinary for images storage.
