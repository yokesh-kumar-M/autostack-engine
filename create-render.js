const https = require('https');

const data = JSON.stringify({
  type: "web_service",
  name: "autostack-api-production",
  ownerId: "tea-d6mb36paae7s73ffj9gg",
  repo: "https://github.com/yokesh-kumar-M/autostack-engine",
  autoDeploy: "yes",
  branch: "main",
  serviceDetails: {
    env: "docker",
    envSpecificDetails: {
      dockerCommand: "",
      dockerContext: ".",
      "dockerfilePath": "./Dockerfile"
    },
    plan: "free",
    region: "oregon",
    envVars: [
      { key: "GEMINI_API_KEY", value: "AIzaSyDP8Qj5J5ZeAI3vdoYd4GyuXWSvhFhiwwI" },
      { key: "SUPABASE_URL", value: "https://wvurikordzhxnywopuqa.supabase.co" },
      { key: "SUPABASE_ANON_KEY", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2dXJpa29yZHpoeG55d29wdXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDEzNTYsImV4cCI6MjA4ODMxNzM1Nn0.PnCKVbCedtWzC5-gV64rdGSYBcBojXVocTZH0N5oIlc" },
      { key: "GUMROAD_USERNAME", value: "yokeshkumar" },
      { key: "NODE_ENV", value: "production" }
    ]
  }
});

const options = {
  hostname: 'api.render.com',
  path: '/v1/services',
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer rnd_9jsE7WhG8mEysdFmkUM4nioA0QIJ',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(`Status: ${res.statusCode}\nBody: ${body}`));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
