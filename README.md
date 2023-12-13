# Larsen Toulousaine

Votre agenda metal toulousain !

# Starter project

This is the starter project for the fullstack tutorial with Next.js and Prisma. You can find the final version of this project in the [`final`](https://github.com/prisma/blogr-nextjs-prisma/tree/final) branch of this repo.

# Dev

The database and image storage used are the same in prod and in development: be careful.

## Commands

Pull env var:

`npx vercel pull env`

Run server:

`npm run dev`

### Prisma

You need to update the database every time your Prisma schema file is changing by running the following command:

`npx prisma generate`

### Tools

This projet uses Next.js, Vercel for deployment & analytics, Cloudinary for images storage.
