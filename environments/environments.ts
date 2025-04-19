export const environment = {
  production: true,
  // apiUrl: 'http://localhost:3000',
  // apiUrl: 'https://reverse-job-board-backend.onrender.com',
  apiUrl: 'https://www.angulartalents.com',
  // apiUrl: '/api',
  // recaptcha: {
  //   siteKey: '6LdJ-BkrAAAAAE1f-Y-fC8vuM4RhsOz2q78DJ2se', // Replace with your actual site key
  // },
  // hcaptcha: {
  //   siteKey: '18921824-1850-471c-a00c-cc787de25b9e', // This is hCaptcha's test key
  // },
  cloudinary: {
    cloud_name: '${CLOUDINARY_CLOUD_NAME}',
    api_key: '${CLOUDINARY_API_KEY}',
    api_secret: '${CLOUDINARY_API_SECRET}',
    upload_preset: '${CLOUDINARY_UPLOAD_PRESET}'
  }
};
