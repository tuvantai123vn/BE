const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dg6vuam0z', 
  api_key: '744475612498239', 
  api_secret: '6LBIcPnilFqIBO4Zhn95g_KqG1I' 
});

module.exports = cloudinary;
