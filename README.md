# Furniro Backend

A REST API used for the [Furniro e-commerce app](https://furniro-app.vercel.app/),designed to handle all server-side logic and database interactions for a furniture store application.

## Features

#### Secure User Authentication

User authentication with Token-Based Authentication with JWT and a refresh token

#### Product Catalog Management

Products CRUD Operations: Full Create, Read, Update, and Delete (CRUD) capabilities for managing the product inventory, With that **Image Management** Supports uploading, storing, and retrieving product images, ensuring that visual data is managed effectively.

#### Order Processing and Management

Order Creation and Tracking that Enables customers to place orders, view order details, and track order status from processing to delivery.

## Security and Best Practices

- **Data Validation** and Sanitization: Validates and cleans input data to prevent SQL injection, XSS, and other vulnerabilities.

- **Password Security**: Uses bcrypt to hash passwords, ensuring they are stored securely.

- **Rate Limiting and Throttling**: Limits the number of client requests to prevent usage abuse.

- **Error Handling and Logging**: Provides robust error handling with minimal error messages.

## Built With

- Node js
- Nest js with Express js platform
- TypeScript
- MongoDB
- Mongoose
- Zod
- Cloudinary
- Handlebars
- Multer
- Nodemailer

## Running Locally

1.  Clone the repository:

```
git clone https://github.com/Abdalrhman-Almarakeby/furniro-backend.git
```

2.  Navigate to the project directory:

```
cd furniro-backend
```

3.  Install dependencies:

```
npm install
```

4. Create .env file with the essential data (Like the .env.example) in the root of the project.

5. Start the local development server:

```
npm run dev
```

## Contact

Github: [Abdalrhman Almarakeby](https://github.com/Abdalrhman-Almarakeby)

Linkedin :[Abdalrhman Almarakeby](https://www.linkedin.com/in/abdalrhman-almarakeby/)

Email: almarakeby.work@gmail.com
