module.exports = {
	// port: process.env.PORT,
  port: process.env.PORT,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  adminEmail: process.env.ADMIN_EMAIL,
  rapidApi: {
  	accountNumber: process.env.RAPID_API_ACCOUNT_NUMBER,
  	projectName: process.env.RAPID_API_PROJECT_NAME
  },
  giphyApiKey: process.env.GIPHY_API_KEY,
  twilio: {
  	accountSid: process.env.TWILIO_ACCOUNT_SID,
  	authToken: process.env.TWILIO_AUTH_TOKEN,
  	from: process.env.TWILIO_FROM_NUMBER,
  	gifUrl: process.env.TWILIO_GIF_URL
  },
  enableRateLimit: process.env.ENABLE_RATE_LIMIT == 'true'
};
