#!/bin/bash

# Environment variable substitution for environments.ts
if [ -f "environments/environments.ts" ]; then
  # Replace environment variables with their values
  sed -i "s|\${CLOUDINARY_CLOUD_NAME:rmsmms}|${CLOUDINARY_CLOUD_NAME:-rmsmms}|g" environments/environments.ts
  sed -i "s|\${CLOUDINARY_API_KEY:323471786184868}|${CLOUDINARY_API_KEY:-323471786184868}|g" environments/environments.ts
  sed -i "s|\${CLOUDINARY_API_SECRET:hG7ZYBoalsywIR5RmZ6sIZkWsdU}|${CLOUDINARY_API_SECRET:-hG7ZYBoalsywIR5RmZ6sIZkWsdU}|g" environments/environments.ts
  sed -i "s|\${CLOUDINARY_UPLOAD_PRESET:yakyhtcu}|${CLOUDINARY_UPLOAD_PRESET:-yakyhtcu}|g" environments/environments.ts

  echo "Environment variable substitution completed."
else
  echo "Error: environments.ts file not found!"
  exit 1
fi

# Run the Angular build
npm run build -- --configuration=production
