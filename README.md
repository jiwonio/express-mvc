# Express MVC 🚀

A robust MVC-style boilerplate for Express.js applications with built-in security, logging, and performance optimizations.

## 🌟 Features

- **MVC Architecture**
    - Clear separation of concerns with Models, Views, and Controllers
    - Dynamic controller loading system
    - Static file serving for views

- **Security First 🔒**
    - Helmet.js integration
    - CORS enabled
    - Rate limiting
    - Speed limiting
    - Session management with file store
    - CSRF protection via cookies

- **Advanced Logging 📝**
    - Winston logger with daily rotate
    - Morgan HTTP request logging
    - Separate log files for different environments

- **Performance Optimized ⚡**
    - Express 5.1.0
    - Built-in rate limiting
    - Speed limiting for DDoS protection
    - Static file serving

## 📁 Project Structure

```
express-mvc/
├── bin/
│   └── www           # Application entry point
├── controller/       # Route controllers
├── logs/             # Application logs
├── middleware/       # Custom middleware
├── model/            # Data models
├── modules/          # Reusable modules
├── sessions/         # Session storage
└── view/             # Static files
    ├── images/
    ├── javascripts/
    └── stylesheets/
```


## 🛠 Prerequisites

- Node.js >= 14.x
- PM2 (for production deployment)
- MySQL (optional)

## 📦 Installation

```shell script
# Clone the repository
git clone https://github.com/jiwonio/express-mvc.git

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```


## 🚀 Running the Application

### Development Mode
```shell script
pm2 start ecosystem.config.js --only express-mvc/development
```


### Production Mode
```shell script
pm2 start ecosystem.config.js --only express-mvc/production
```


## 🔧 Configuration

The application can be configured through environment variables in `.env`:

```
DB_HOST=localhost
DB_NAME=sample
DB_USERNAME=root
DB_PASSWORD=root
SESSION_SECRET=YOUR_SESSION_SECRET
```


## 🔍 Optional Enhancements

The following features are prepared but optional:

- HTTPS support via Nginx reverse proxy
- Passport.js authentication
- Caching layer
- Custom authentication/authorization middleware

## 🛡 Security Features

- Helmet.js for security headers
- Rate limiting: 100 requests per 15 minutes
- Speed limiting: Delay after 50 requests
- Session management with FileStore
- CORS protection

## 📝 Logging

Logs are automatically rotated daily and stored in the `logs` directory:
- Access logs
- Error logs
- Application logs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the UNLICENSE - see the LICENSE file for details.