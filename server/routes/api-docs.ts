import { Router } from "express";

const router = Router();

// OpenAPI 3.0 Specification
const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Bluequee Clinic Management API",
    version: "1.0.0",
    description: "Public REST API for Bluequee clinic management system. Provides access to patient data, appointments, lab results, prescriptions, and more.",
    contact: {
      name: "API Support",
      email: "api@bluequee.com"
    }
  },
  servers: [
    {
      url: "/api",
      description: "Internal API"
    },
    {
      url: "/api/v1",
      description: "Public API v1"
    },
    {
      url: "/api/mobile",
      description: "Mobile Optimized API"
    }
  ],
  tags: [
    { name: "Health", description: "Health check and monitoring endpoints" },
    { name: "Authentication", description: "User authentication and session management" },
    { name: "Profile", description: "User profile management" },
    { name: "Patients", description: "Patient management" },
    { name: "Appointments", description: "Appointment scheduling" },
    { name: "Prescriptions", description: "Prescription management" },
    { name: "Vital Signs", description: "Patient vital signs" }
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
        description: "API key for authentication. Contact your administrator to generate an API key."
      }
    },
    schemas: {
      // Standardized API Response Format
      ApiSuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object", description: "The response payload" },
          message: { type: "string", description: "Optional success message" },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer" },
              limit: { type: "integer" },
              total: { type: "integer" },
              totalPages: { type: "integer" }
            }
          }
        },
        required: ["success", "data"]
      },
      ApiErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              code: { type: "string", enum: ["BAD_REQUEST", "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND", "CONFLICT", "VALIDATION_ERROR", "RATE_LIMITED", "INTERNAL_ERROR"] },
              message: { type: "string" },
              details: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } }
            },
            required: ["code", "message"]
          }
        },
        required: ["success", "error"]
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" }
        }
      },
      Patient: {
        type: "object",
        properties: {
          id: { type: "integer" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          dateOfBirth: { type: "string", format: "date" },
          gender: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          address: { type: "string" },
          allergies: { type: "string" },
          medicalHistory: { type: "string" },
          organizationId: { type: "integer" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Appointment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patientId: { type: "integer" },
          patientName: { type: "string" },
          doctorId: { type: "integer" },
          doctorName: { type: "string" },
          appointmentDate: { type: "string", format: "date" },
          appointmentTime: { type: "string" },
          status: { type: "string", enum: ["scheduled", "confirmed", "completed", "cancelled"] },
          notes: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Prescription: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patientId: { type: "integer" },
          patientName: { type: "string" },
          doctorId: { type: "integer" },
          doctorName: { type: "string" },
          medicationName: { type: "string" },
          dosage: { type: "string" },
          frequency: { type: "string" },
          duration: { type: "string" },
          status: { type: "string" },
          startDate: { type: "string", format: "date" },
          endDate: { type: "string", format: "date" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      VitalSigns: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patientId: { type: "integer" },
          patientName: { type: "string" },
          temperature: { type: "number" },
          bloodPressure: { type: "string" },
          heartRate: { type: "integer" },
          respiratoryRate: { type: "integer" },
          oxygenSaturation: { type: "number" },
          weight: { type: "number" },
          height: { type: "number" },
          recordedAt: { type: "string", format: "date-time" },
          recordedBy: { type: "integer" }
        }
      }
    }
  },
  security: [{ ApiKeyAuth: [] }],
  paths: {
    // ==================== Health Endpoints ====================
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Basic health check",
        description: "Returns OK if server is running",
        security: [],
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/health/detailed": {
      get: {
        tags: ["Health"],
        summary: "Detailed health check",
        description: "Returns detailed health status including database and memory",
        security: [],
        responses: {
          "200": {
            description: "Detailed health status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", enum: ["healthy", "degraded", "unhealthy"] },
                    timestamp: { type: "string", format: "date-time" },
                    version: { type: "string" },
                    uptime: { type: "number" },
                    services: {
                      type: "object",
                      properties: {
                        database: {
                          type: "object",
                          properties: {
                            status: { type: "string" },
                            responseTime: { type: "number" }
                          }
                        },
                        memory: {
                          type: "object",
                          properties: {
                            status: { type: "string" },
                            used: { type: "number" },
                            total: { type: "number" },
                            percentage: { type: "number" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "503": { description: "Service unhealthy" }
        }
      }
    },
    // ==================== Authentication Endpoints ====================
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        description: "Authenticate user and create session",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", minLength: 1, maxLength: 50 },
                  password: { type: "string", minLength: 1, maxLength: 128 }
                },
                required: ["username", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        user: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            username: { type: "string" },
                            role: { type: "string" },
                            organizationId: { type: "integer" }
                          }
                        },
                        requiresOrgSelection: { type: "boolean" }
                      }
                    },
                    message: { type: "string" }
                  }
                }
              }
            }
          },
          "401": { description: "Invalid credentials" },
          "422": { description: "Validation error" },
          "423": { description: "Account locked" },
          "429": { description: "Too many login attempts" }
        }
      }
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "User logout",
        description: "Destroy session and log out user",
        responses: {
          "200": { description: "Logged out successfully" }
        }
      }
    },
    "/auth/session-status": {
      get: {
        tags: ["Authentication"],
        summary: "Check session status",
        description: "Get current session information",
        responses: {
          "200": { description: "Session is valid" },
          "401": { description: "Session invalid or expired" }
        }
      }
    },
    // ==================== Profile Endpoints ====================
    "/profile": {
      get: {
        tags: ["Profile"],
        summary: "Get user profile",
        description: "Get current authenticated user's profile",
        responses: {
          "200": {
            description: "User profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiSuccessResponse" }
              }
            }
          },
          "401": { description: "Not authenticated" }
        }
      },
      put: {
        tags: ["Profile"],
        summary: "Update user profile",
        description: "Update current user's profile information",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", maxLength: 10 },
                  firstName: { type: "string", maxLength: 50 },
                  lastName: { type: "string", maxLength: 50 },
                  phone: { type: "string", maxLength: 20 },
                  email: { type: "string", format: "email" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Profile updated successfully" },
          "401": { description: "Not authenticated" },
          "422": { description: "Validation error" }
        }
      }
    },
    // ==================== Public API Endpoints ====================
    "/patients": {
      get: {
        summary: "List patients",
        description: "Get a list of patients in your organization",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 50 },
            description: "Number of records to return"
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
            description: "Number of records to skip"
          }
        ],
        responses: {
          "200": {
            description: "List of patients",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Patient" }
                    },
                    meta: {
                      type: "object",
                      properties: {
                        limit: { type: "integer" },
                        offset: { type: "integer" },
                        count: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": { description: "Unauthorized - Invalid API key" },
          "403": { description: "Forbidden - Insufficient permissions" }
        }
      }
    },
    "/patients/{id}": {
      get: {
        summary: "Get patient by ID",
        description: "Get detailed information about a specific patient",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": {
            description: "Patient details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Patient" }
                  }
                }
              }
            }
          },
          "404": { description: "Patient not found" }
        }
      }
    },
    "/appointments": {
      get: {
        summary: "List appointments",
        description: "Get a list of appointments with optional filtering",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 50 }
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 }
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["scheduled", "confirmed", "completed", "cancelled"] }
          },
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Filter appointments from this date"
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Filter appointments until this date"
          }
        ],
        responses: {
          "200": {
            description: "List of appointments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Appointment" }
                    },
                    meta: { type: "object" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/prescriptions": {
      get: {
        summary: "List prescriptions",
        description: "Get a list of prescriptions with optional filtering",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 50 }
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 }
          },
          {
            name: "patientId",
            in: "query",
            schema: { type: "integer" }
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "List of prescriptions",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Prescription" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/vital-signs": {
      get: {
        summary: "List vital signs",
        description: "Get a list of vital signs records",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 50 }
          },
          {
            name: "patientId",
            in: "query",
            schema: { type: "integer" }
          },
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date-time" }
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date-time" }
          }
        ],
        responses: {
          "200": {
            description: "List of vital signs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/VitalSigns" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dashboard/stats": {
      get: {
        summary: "Dashboard statistics (Mobile)",
        description: "Get quick statistics for mobile dashboard",
        responses: {
          "200": {
            description: "Dashboard stats",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    patients: { type: "integer" },
                    appointments: { type: "integer" },
                    labs: { type: "integer" },
                    prescriptions: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/appointments/today": {
      get: {
        summary: "Today's appointments (Mobile)",
        description: "Get today's appointments with minimal payload",
        responses: {
          "200": {
            description: "Today's appointments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      patient: { type: "string" },
                      time: { type: "string" },
                      status: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Serve OpenAPI spec as JSON
router.get('/openapi.json', (req, res) => {
  res.json(openApiSpec);
});

// Serve Swagger UI HTML
router.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bluequee API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    }
  </script>
</body>
</html>
  `;
  res.send(html);
});

export default router;
