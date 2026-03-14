// Simple status check - no Express, no dependencies
export default function handler(req, res) {
  res.json({
    status: 'working',
    message: 'Serverless function is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
