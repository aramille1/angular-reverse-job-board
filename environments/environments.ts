export const environment = {
  production: true,
  // apiUrl: 'http://localhost:3000',
  // apiUrl: 'https://reverse-job-board-backend.onrender.com',
  apiUrl: 'https://angular-talents-backend.onrender.com',
  // apiUrl: '/api',
  ecaptcha: {
    siteKey: '${YOUR_RECAPTCHA_SITE_KEY}'
  },
  cloudinary: {
    cloud_name: '${CLOUDINARY_CLOUD_NAME}',
    api_key: '${CLOUDINARY_API_KEY}',
    api_secret: '${CLOUDINARY_API_SECRET}',
    upload_preset: '${CLOUDINARY_UPLOAD_PRESET}'
  }
};
