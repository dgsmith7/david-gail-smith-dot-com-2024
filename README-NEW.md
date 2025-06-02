# David Gail Smith - Artist Portfolio Website

A clean, modern portfolio website for artist David Gail Smith, built with Express.js, EJS, and Bootstrap. Features a responsive design, dark mode, project filtering, and contact form functionality.

## 🚀 Features

- **Responsive Design**: Built with Bootstrap 5 for mobile-first responsiveness
- **Dark Mode**: Toggle between light and dark themes
- **Project Gallery**: Filterable and searchable project showcase
- **Contact Form**: Integrated email functionality with spam protection
- **Clean Architecture**: Modular ES6 code structure
- **Static Site Generation**: Can be deployed as static files or dynamic Express app
- **Digital Ocean Ready**: Configured for seamless deployment

## 🛠️ Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript (ES6 modules), Bootstrap 5
- **Templating**: EJS
- **Styling**: Bootstrap 5 + Custom CSS with CSS variables
- **Email**: Nodemailer
- **Deployment**: Digital Ocean App Platform

## 📁 Project Structure

```
├── app.js                 # Main Express application
├── build-clean.js         # Static site generator
├── package.json           # Dependencies and scripts
├── .do/app.yaml          # Digital Ocean deployment config
├── data/
│   ├── projects.json     # Project data
│   └── categories.json   # Project categories
├── public/
│   ├── css/modern.css    # Main stylesheet
│   ├── js/
│   │   ├── index.js      # Main JavaScript module
│   │   ├── project.js    # Project template
│   │   └── ejs.js        # EJS client-side rendering
│   └── images/           # Static assets
├── views/
│   ├── index-clean.ejs   # Main template
│   ├── header-clean.ejs  # Header partial
│   ├── footer-clean.ejs  # Footer partial
│   └── error.ejs         # Error page
└── utils/
    └── utils.js          # Email utilities
```

## 🏃‍♂️ Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/dgsmith7/david-gail-smith-dot-com-2024.git
   cd david-gail-smith-dot-com-2024
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   PORT=3000
   MAIL_HOST=your-smtp-host
   MAIL_PORT=587
   MAIL_SECURE=false
   MAIL_USERNAME=your-email
   MAIL_PASSWORD=your-password
   MAIL_TLS=true
   MESSAGE_FROM=your-email
   MESSAGE_TO=recipient-email
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`

### Production Build

Generate static files for deployment:
```bash
npm run build
```

This creates a `dist/` directory with static HTML, CSS, and JavaScript files.

## 🌐 Deployment

### Digital Ocean App Platform

The project is pre-configured for Digital Ocean App Platform deployment:

1. **Push to GitHub** (main branch)
2. **Create App** in Digital Ocean dashboard
3. **Connect Repository**: Point to your GitHub repo
4. **Configure Environment Variables** in the Digital Ocean dashboard:
   - `MAIL_HOST`
   - `MAIL_PORT`
   - `MAIL_SECURE`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
   - `MAIL_TLS`
   - `MESSAGE_FROM`
   - `MESSAGE_TO`

The `.do/app.yaml` file handles the rest of the configuration automatically.

### Alternative Static Hosting

For static hosting (Netlify, Vercel, etc.):
1. Run `npm run build`
2. Deploy the `dist/` folder
3. Note: Contact form won't work without server-side processing

## 🎨 Customization

### Adding Projects

Edit `data/projects.json` to add new projects:
```json
{
  "id": 1,
  "project_name": "Project Title",
  "category": "Painting",
  "img_url": "https://example.com/image.jpg",
  "project_description": "Description...",
  "price": "1500.00",
  "date_created": "2024",
  "medium": "Oil on canvas",
  "dimensions": "24\" x 36\"",
  "frame": "Framed",
  "notes": "Additional notes..."
}
```

### Styling

The main stylesheet is `public/css/modern.css` which uses:
- CSS custom properties (variables) for theming
- Bootstrap 5 utilities
- Clean, maintainable structure

### Dark Mode

Dark mode is handled via CSS classes and JavaScript:
- Theme state stored in `sessionStorage`
- CSS variables for light/dark color schemes
- Automatic class toggling on all elements

## 📧 Contact Form

The contact form includes:
- Bootstrap validation
- Honeypot spam protection
- Email sending via Nodemailer
- Success/error feedback

## 🧹 Code Quality

This codebase follows:
- **ES6 Modules**: Clean import/export structure
- **DRY Principles**: No code duplication
- **Modular Architecture**: Separated concerns
- **Bootstrap-First**: Minimal custom CSS
- **Semantic HTML**: Accessible markup
- **Performance Optimized**: Minimal dependencies

## 🚀 Recent Improvements

- ✅ Removed unused database dependencies (MySQL)
- ✅ Eliminated blockchain/wallet connection code
- ✅ Consolidated duplicate templates
- ✅ Cleaned up CSS files
- ✅ Modularized JavaScript
- ✅ Simplified build process
- ✅ Optimized for Digital Ocean deployment
- ✅ Added proper error handling
- ✅ Improved accessibility

## 📝 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

**David Gail Smith**  
DGS Creative, LLC  
[davidgailsmith.com](https://www.davidgailsmith.com)
