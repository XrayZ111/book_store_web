# Book Store Website
Disclaimer:
This is a part of 01204351-65 Database System subject at the Computer Engineering department of Kasetsart University

![Image1](https://github.com/XrayZ111/book_store_web/blob/main/Image/1.png?raw=true)

This project is a website, which allows users to purchase and sell their products, the book.

## Feature
- User Authentication: Sign-in and Sign-up
- Search and Filter: Users be able to search specific book or author and filter by genre
- Sell: User can sell their book by adding the product

## Used tools
- Next.js
- PostgreSQL
- CSS

## Process to implement this project
1. clone this repository
2. Setup database with PostgreSQL
3. Install dependency with `npm install`
4. Environment dot file 
    - create `.env.local` then write this file
```
DB_USER={your_user}
DB_HOST={your_host}
DB_DATABASE=postgres
DB_PASSWORD={your_password}
DB_PORT={your port}
NEXTAUTH_SECRET={your_key}
NEXTAUTH_URL=http://localhost:3000
```
5. edit a code if you want
6. run the server by `npm run dev`
7. look at `http:localhost:3000`

## License
- [LICENSE.txt]

## Meet the team
- ก้องสกุล พันธุ์ยาง  6610505276
- อลงกต วิมลสุข  6610505624
- ภากร ตันติวัฒนากุล  6610505535
- ธนาธิป จินดามณี  6610505411