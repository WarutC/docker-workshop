const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Hello from Node.js</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 50px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            font-size: 18px;
          }
          .emoji {
            font-size: 80px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="emoji">🚀</div>
          <h1>สวัสดี จาก Node.js!</h1>
          <p>Container กำลังทำงานบน Podman</p>
          <p><strong>Container ID:</strong> ${require('os').hostname()}</p>
          <p><strong>Node Version:</strong> ${process.version}</p>
        </div>
      </body>
    </html>
  `;

  res.end(html);
});

server.listen(port, hostname, () => {
  console.log(`✅ Server running at http://${hostname}:${port}/`);
  console.log(`📦 Container ID: ${require('os').hostname()}`);
  console.log(`🟢 Node Version: ${process.version}`);
});
