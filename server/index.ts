import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Healthcare platform route
app.get('/health', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bluequee Healthcare Management</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #1e40af 50%, #1d4ed8 75%, #2563eb 100%);
            min-height: 100vh;
            color: white;
            overflow-x: hidden;
          }
          .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .logo { font-size: 3.5rem; margin-bottom: 16px; display: block; }
          .title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 12px;
            background: linear-gradient(90deg, #ffffff, #e0e7ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .subtitle { font-size: 1.25rem; margin-bottom: 32px; opacity: 0.9; color: #e0e7ff; }
          .status {
            background: linear-gradient(90deg, #10b981, #059669);
            padding: 12px 24px;
            border-radius: 50px;
            display: inline-block;
            font-weight: 600;
            margin-bottom: 32px;
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
          }
          .features {
            text-align: left;
            background: rgba(255, 255, 255, 0.05);
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 24px;
          }
          .feature {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 1.1rem;
          }
          .feature:last-child { margin-bottom: 0; }
          .feature-icon { margin-right: 12px; font-size: 1.2rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">🏥</div>
            <h1 class="title">Bluequee</h1>
            <p class="subtitle">Digital Healthcare Management Platform</p>
            
            <div class="status">✅ System Online & Ready</div>
            
            <div class="features">
              <div class="feature">
                <span class="feature-icon">👥</span>
                <span>Patient Management & Records</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🧪</span>
                <span>Laboratory Results & Orders</span>
              </div>
              <div class="feature">
                <span class="feature-icon">💊</span>
                <span>Pharmacy & Prescription Management</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📊</span>
                <span>Analytics & Revenue Tracking</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📱</span>
                <span>Mobile-First Responsive Design</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🔒</span>
                <span>Secure Multi-Tenant Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Simple test route
app.get('/test', (req, res) => {
  res.send(`
    <html>
      <head><title>Test</title></head>
      <body style="font-family: Arial; padding: 20px; background: #f0f8ff;">
        <h1 style="color: #2563eb;">🏥 Bluequee Test Page</h1>
        <p>Server is running correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });



  // Serve the direct login page
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bluequee Healthcare - Login</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #1e40af 50%, #1d4ed8 75%, #2563eb 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .login-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 40px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 16px;
            display: block;
        }
        .title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: white;
        }
        .subtitle {
            font-size: 1rem;
            margin-bottom: 32px;
            color: #e0e7ff;
            opacity: 0.9;
        }
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: #e0e7ff;
            font-weight: 500;
        }
        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 16px;
            backdrop-filter: blur(10px);
        }
        .form-input::placeholder {
            color: rgba(224, 231, 255, 0.6);
        }
        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        .login-button {
            width: 100%;
            padding: 12px 24px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
        }
        .login-button:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
        }
        .login-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .demo-accounts {
            margin-top: 24px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .demo-title {
            color: #e0e7ff;
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .demo-account {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #cbd5e1;
        }
        .error-message {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fecaca;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
            display: none;
        }
        .loading {
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">🏥</div>
        <h1 class="title">Bluequee</h1>
        <p class="subtitle">Healthcare Management Platform</p>
        
        <form id="loginForm">
            <div id="errorMessage" class="error-message"></div>
            
            <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" name="username" class="form-input" placeholder="Enter your username" required>
            </div>
            
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" name="password" class="form-input" placeholder="Enter your password" required>
            </div>
            
            <button type="submit" id="loginButton" class="login-button">
                <span id="buttonText">Access Dashboard</span>
            </button>
        </form>
        
        <div class="demo-accounts">
            <div class="demo-title">Demo Accounts</div>
            <div class="demo-account">
                <span>Administrator:</span>
                <span>admin / admin123</span>
            </div>
            <div class="demo-account">
                <span>Doctor:</span>
                <span>doctor / doctor123</span>
            </div>
            <div class="demo-account">
                <span>Nurse:</span>
                <span>nurse / nurse123</span>
            </div>
        </div>
    </div>

    <script>
        console.log('Healthcare login interface loaded successfully');
        
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');
            const button = document.getElementById('loginButton');
            const buttonText = document.getElementById('buttonText');
            
            // Clear previous errors
            errorDiv.style.display = 'none';
            
            // Show loading state
            button.disabled = true;
            button.classList.add('loading');
            buttonText.textContent = 'Signing in...';
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Store authentication data
                    localStorage.setItem('clinic_token', data.token);
                    localStorage.setItem('clinic_user', JSON.stringify(data.user));
                    
                    // Redirect to main application
                    window.location.href = '/app';
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Invalid username or password');
                }
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
            } finally {
                // Reset button state
                button.disabled = false;
                button.classList.remove('loading');
                buttonText.textContent = 'Access Dashboard';
            }
        });
    </script>
</body>
</html>`);
  });

  // Serve React application for authenticated routes
  app.get('/app*', (req, res, next) => {
    // Let Vite handle this in development
    if (app.get("env") === "development") {
      return next();
    }
    // Serve static files in production
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
