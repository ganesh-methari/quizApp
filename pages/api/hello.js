// Simple test in pages/api folder
export default function handler(req, res) {
  res.json({ message: 'Hello from pages/api!', timestamp: new Date().toISOString() });
}
