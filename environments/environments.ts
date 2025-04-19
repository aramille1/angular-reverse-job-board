export const environment = {
  production: true,
  // Direct backend URL - use this if CORS is properly configured on the backend
  apiUrl: 'https://angular-talents-backend.onrender.com',

  // If using proxy is necessary, uncomment this instead:
  // apiUrl: '/api',

  cloudinary: {
    cloud_name: '${CLOUDINARY_CLOUD_NAME}',
    api_key: '${CLOUDINARY_API_KEY}',
    api_secret: '${CLOUDINARY_API_SECRET}',
    upload_preset: '${CLOUDINARY_UPLOAD_PRESET}'
  }
};
