# David Gail Smith Art Portfolio Website

Modern portfolio website for showcasing the art of David Gail Smith.

## Overview

This website is designed as a static website deployed on Digital Ocean App Platform using Docker. It features a modern, responsive design with dark mode support, optimized asset loading, and a database-free architecture for improved performance and reduced hosting costs.

## Features

- Modern, clean design optimized for desktop and mobile viewing
- Dark mode support that remembers user preference
- Fast-loading static site architecture
- Project filtering and searching capabilities
- Contact form with email integration
- Social media sharing for artwork
- Responsive image gallery

## Architecture

The application follows a modern JAMstack-inspired architecture:

1. **Database-free**: All content is stored in JSON files
2. **Static Generation**: EJS templates are pre-rendered to static HTML
3. **Modern JavaScript**: Uses ES modules and modern browser features
4. **CSS Variables**: Implements theming with CSS custom properties
5. **Dockerized Deployment**: Uses Nginx to serve static assets efficiently

## Development Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env` file:

```bash
# Database settings (only needed if importing from existing database)
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Email settings
MAIL_HOST=your_mail_host
MAIL_PORT=465
MAIL_SECURE=true
MAIL_AUTH_TYPE=SSL/TLS
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_mail_password
MAIL_TLS=true
MESSAGE_FROM=your_email
MESSAGE_TO=recipient_email
RECAPTCHA_SECRET_KEY=your_recaptcha_key
```

4. Run the development server:

```bash
npm run dev
```

## Building for Production

The site can be built into a static site for production hosting:

1. Export database content to JSON (if needed):

```bash
node utils/db-to-json.js
```

2. Build the static site:

```bash
npm run build
```

3. Test the build:

```bash
./build-and-test.sh
```

This will generate a `dist` folder with all static assets ready for deployment.

```bash
git clone https://github.com/dgsmith7/david-gail-smith-dot-com-2024.git
cd david-gail-smith-dot-com-2024
```

2. Install dependencies

```bash
npm install
```

3. Run in development mode

```bash
npm run dev
```

## Building the Site

1. Export database to JSON (only needed once or when database changes)

```bash
npm run export-db
```

2. Build the static site

```bash
npm run build
```

3. Serve the built site locally

```bash
npm run serve
```

## Deployment

The site is automatically deployed to Digital Ocean App Platform when changes are pushed to the main branch, using GitHub Actions.

### Automatic Deployment (recommended)

1. Push your changes to the main branch
2. GitHub Actions will:
   - Build the static site
   - Create a Docker image
   - Deploy to Digital Ocean App Platform

### Manual Deployment

1. Export DB to JSON (if needed): `npm run export-db`
2. Build the static site: `npm run build`
3. Build the Docker image: `docker build -t davidgailsmith .`
4. Push to Digital Ocean Registry:
   ```bash
   doctl registry login
   docker tag davidgailsmith registry.digitalocean.com/your-registry/davidgailsmith
   docker push registry.digitalocean.com/your-registry/davidgailsmith
   ```
5. Deploy the image using Digital Ocean dashboard or CLI

## Content Management

Now that the site uses JSON files instead of a database, you have several options for managing content:

1. **Direct JSON Editing**: Edit the JSON files in the `data` directory and commit the changes
2. **One-time DB Export**: If you still want to use the database for content management, run `npm run export-db` after making changes to the database
3. **Custom Admin Panel**: In the future, you could develop a simple admin interface that updates the JSON files directly

## Testing and Validation

The project includes automated testing to ensure everything works correctly:

1. **Build and Test Script**: Run `./build-and-test.sh` to:

   - Verify data files exist
   - Build the static site
   - Test the homepage and error pages
   - Validate deployment readiness

2. **Manual Testing**:
   - Start the server with `npm run serve`
   - Visit http://localhost:3000 to test the site
   - Test browser compatibility and responsive design
   - Test dark mode functionality

## Error Handling

The site includes improved error handling:

1. **Custom 404 Page**: Modern design with easy navigation back to home
2. **Server-side Logging**: Enhanced logging for debugging
3. **Graceful Fallbacks**: For missing images or content

## Future Enhancements

- [ ] Implement CDN for global delivery
- [ ] Add e-commerce functionality (PayPal/Square)
- [ ] Implement print-on-demand with Printify
- [ ] Add multi-photo gallery option
- [ ] Create email subscription service
- [ ] Implement authentication for admin features
- [ ] Add shipping calculator for physical art
- [ ] Add more animation and interactive elements
- [ ] Add image lazy loading for improved performance
- [ ] Implement offline functionality with service workers

## License

MIT License © David Gail Smith, DGS Creative, LLC
