# Dot Share Server

## Installation

1.  Clone repository in your favourite local direction and go to this direction

```bash
git clone https://github.com/Nicccccolas/dot-share.git

cd dot-share
```

2. Install all dependencies

```bash
npm install
```

3. Run Server

```bash
npm run dev
```

4. Run migrates PrismaORM

```bash
npx prisma migrate dev --name init

#or

npx prisma db push
```

5. If you want, explore Prisma Studio

```bash
npx prisma studio
```

## Stack

- Typescript
- Express
- Prisma
- Docker
- Postgres

## Authors

- Yoel Valverde
- Nicolás Pantoja
