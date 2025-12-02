import type { Express } from "express";
import { setupPatientRoutes } from "./patients";
import { setupLaboratoryRoutes } from "./laboratory";
import { setupPrescriptionRoutes } from "./prescriptions";
import { setupPatientExtendedRoutes } from "./patient-extended";
import publicApiRouter from "./public-api";
import mobileApiRouter from "./mobile-api";
import apiKeysRouter from "./api-keys";
import apiDocsRouter from "./api-docs";
import accessControlRouter from "./access-control";
import organizationsRouter from "./organizations";
import authRouter from "./auth";
import healthRouter from "./health";
import profileRouter from "./profile";
import { setupTabConfigRoutes } from "./tab-configs";
import { setupTabPresetRoutes } from "./tab-presets";
// import { setupAppointmentRoutes } from "./appointments";
// import { setupAnalyticsRoutes } from "./analytics";
// import { setupIntegrationRoutes } from "./integrations";
// import { setupSuggestionRoutes } from "./suggestions";
// import { setupNotificationRoutes } from "./notifications";
// import { setupPatientPortalRoutes } from "./patient-portal";
// import { setupBillingRoutes } from "./billing";
// import { setupSystemRoutes } from "./system";

/**
 * Sets up all route modules for the healthcare management system
 * This replaces the monolithic routes.ts file with organized, domain-specific modules
 */
export function setupRoutes(app: Express): void {
  console.log("=== SETTING UP MODULAR ROUTES ===");
  
  // Health check routes (for monitoring)
  console.log("Setting up health check routes...");
  app.use('/api/health', healthRouter);
  
  // Authentication routes (must be first for security)
  console.log("Setting up authentication routes...");
  app.use('/api/auth', authRouter);
  
  // Profile routes
  console.log("Setting up profile routes...");
  app.use('/api/profile', profileRouter);
  
  // Core healthcare functionality - ONLY modules that exist
  console.log("Setting up patient routes...");
  const patientRouter = setupPatientRoutes();
  app.use('/api', patientRouter);
  
  console.log("Setting up laboratory routes...");
  const laboratoryRouter = setupLaboratoryRoutes();
  app.use('/api', laboratoryRouter);
  
  console.log("Setting up prescription routes...");
  const prescriptionRouter = setupPrescriptionRoutes();
  app.use('/api', prescriptionRouter);
  
  console.log("Setting up patient extended routes (allergies, immunizations, imaging, procedures)...");
  const patientExtendedRouter = setupPatientExtendedRoutes();
  app.use('/api', patientExtendedRouter);
  
  // Public REST API routes
  console.log("Setting up public API routes...");
  app.use('/api/v1', publicApiRouter);
  
  // Mobile-optimized API routes
  console.log("Setting up mobile API routes...");
  app.use('/api/mobile', mobileApiRouter);
  
  // API Keys management routes
  console.log("Setting up API keys management routes...");
  app.use('/api/api-keys', apiKeysRouter);
  
  // API Documentation routes
  console.log("Setting up API documentation routes...");
  app.use('/api/docs', apiDocsRouter);
  
  // Access Control & Role Management routes
  console.log("Setting up access control routes...");
  app.use('/api/access-control', accessControlRouter);
  
  // Organization Management routes
  console.log("Setting up organization management routes...");
  app.use('/api/organizations', organizationsRouter);
  
  // Tab Configurations routes
  console.log("Setting up tab configurations routes...");
  setupTabConfigRoutes(app);
  
  // Tab Presets routes
  console.log("Setting up tab presets routes...");
  setupTabPresetRoutes(app);
  
  // TODO: Add remaining modules as they are migrated from routes.ts:
  // setupAppointmentRoutes(app);
  // setupAnalyticsRoutes(app);
  // setupBillingRoutes(app);
  // setupIntegrationRoutes(app);
  // setupPatientPortalRoutes(app);
  // setupSuggestionRoutes(app);
  // setupNotificationRoutes(app);
  // setupSystemRoutes(app);
  
  console.log("=== ROUTES SETUP COMPLETE ===");
}