import { Router } from "express";
import { authenticateToken, type AuthRequest } from "../middleware/auth";
import { db } from "../db";
import { sql } from "drizzle-orm";

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return getErrorMessage(error);
  return String(error);
}

const router = Router();

export function setupPatientExtendedRoutes(): Router {

  // =====================
  // ALLERGIES ROUTES
  // =====================

  // Get patient allergies
  router.get("/patients/:id/allergies", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);

      const result = await db.execute(sql`
        SELECT 
          id,
          patient_id as "patientId",
          allergen,
          allergy_type as "allergyType",
          severity,
          reaction,
          onset_date as "onsetDate",
          notes,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM patient_allergies 
        WHERE patient_id = ${patientId} 
        ORDER BY created_at DESC
      `);

      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching allergies:', error);
      res.status(500).json({ message: "Failed to fetch allergies" });
    }
  });

  // Add allergy
  router.post("/patients/:id/allergies", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const allergyData = req.body;

      const result = await db.execute(sql`
        INSERT INTO patient_allergies 
        (patient_id, allergen, allergy_type, severity, reaction, onset_date, notes, created_at)
        VALUES (
          ${patientId}, 
          ${allergyData.allergen}, 
          ${allergyData.allergyType}, 
          ${allergyData.severity}, 
          ${allergyData.reaction},
          ${allergyData.onsetDate || null},
          ${allergyData.notes || null},
          NOW()
        )
        RETURNING *
      `);

      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error adding allergy:', error);
      res.status(500).json({ message: "Failed to add allergy", error: getErrorMessage(error) });
    }
  });

  // Update allergy
  router.patch("/patients/:id/allergies/:allergyId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const allergyId = Number.parseInt(req.params.allergyId);
      const allergyData = req.body;

      const result = await db.execute(sql`
        UPDATE patient_allergies 
        SET 
          allergen = ${allergyData.allergen},
          allergy_type = ${allergyData.allergyType},
          severity = ${allergyData.severity},
          reaction = ${allergyData.reaction},
          onset_date = ${allergyData.onsetDate || null},
          notes = ${allergyData.notes || null},
          updated_at = NOW()
        WHERE id = ${allergyId} AND patient_id = ${patientId}
        RETURNING *
      `);

      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error updating allergy:', error);
      res.status(500).json({ message: "Failed to update allergy", error: getErrorMessage(error) });
    }
  });

  // Delete allergy
  router.delete("/patients/:id/allergies/:allergyId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const allergyId = Number.parseInt(req.params.allergyId);

      await db.execute(sql`
        DELETE FROM patient_allergies WHERE id = ${allergyId}
      `);

      res.json({ message: "Allergy deleted successfully" });
    } catch (error) {
      console.error('Error deleting allergy:', error);
      res.status(500).json({ message: "Failed to delete allergy", error: getErrorMessage(error) });
    }
  });

  // =====================
  // IMMUNIZATIONS ROUTES
  // =====================

  // Get ALL immunizations across all patients (for dashboard/reports)
  router.get("/vaccinations/all", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const result = await db.execute(sql`
        SELECT 
          v.id,
          v.patient_id as "patientId",
          v.vaccine_name as "vaccineName",
          v.date_administered as "dateAdministered",
          v.administered_by as "administeredBy",
          v.batch_number as "batchNumber",
          v.manufacturer,
          v.next_due_date as "nextDueDate",
          v.notes,
          v.created_at as "createdAt"
        FROM vaccinations v
        ORDER BY v.date_administered DESC
        LIMIT 1000
      `);

      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching all immunizations:', error);
      res.status(500).json({ message: "Failed to fetch immunizations" });
    }
  });

  // Get patient immunizations
  router.get("/patients/:id/immunizations", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);

      const result = await db.execute(sql`
        SELECT 
          id,
          patient_id as "patientId",
          vaccine_name as "vaccineName",
          date_administered as "dateAdministered",
          administered_by as "administeredBy",
          batch_number as "batchNumber",
          manufacturer,
          next_due_date as "nextDueDate",
          notes,
          created_at as "createdAt"
        FROM vaccinations 
        WHERE patient_id = ${patientId} 
        ORDER BY date_administered DESC
      `);

      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching immunizations:', error);
      res.status(500).json({ message: "Failed to fetch immunizations" });
    }
  });

  // Add immunization
  router.post("/patients/:id/immunizations", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const immunizationData = req.body;

      console.log('Adding immunization for patient:', patientId, 'Data:', immunizationData);

      const result = await db.execute(sql`
        INSERT INTO vaccinations 
        (patient_id, vaccine_name, date_administered, administered_by, 
         batch_number, manufacturer, next_due_date, notes, created_at)
        VALUES (
          ${patientId}, 
          ${immunizationData.vaccineName}, 
          ${immunizationData.dateAdministered}, 
          ${immunizationData.administeredBy || 'Unknown'},
          ${immunizationData.batchNumber || immunizationData.lotNumber || null},
          ${immunizationData.manufacturer || null},
          ${immunizationData.nextDueDate || null},
          ${immunizationData.notes || null},
          NOW()
        )
        RETURNING 
          id,
          patient_id as "patientId",
          vaccine_name as "vaccineName",
          date_administered as "dateAdministered",
          administered_by as "administeredBy",
          batch_number as "batchNumber",
          manufacturer,
          next_due_date as "nextDueDate",
          notes,
          created_at as "createdAt"
      `);

      console.log('Immunization added successfully:', result);
      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error adding immunization:', error);
      res.status(500).json({ message: "Failed to add immunization", error: getErrorMessage(error) });
    }
  });

  // Update immunization
  router.patch("/patients/:id/immunizations/:immunizationId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const immunizationId = Number.parseInt(req.params.immunizationId);
      const immunizationData = req.body;

      const result = await db.execute(sql`
        UPDATE vaccinations 
        SET 
          vaccine_name = ${immunizationData.vaccineName},
          date_administered = ${immunizationData.dateAdministered},
          administered_by = ${immunizationData.administeredBy || 'Unknown'},
          batch_number = ${immunizationData.batchNumber || immunizationData.lotNumber || null},
          manufacturer = ${immunizationData.manufacturer || null},
          next_due_date = ${immunizationData.nextDueDate || null},
          notes = ${immunizationData.notes || null}
        WHERE id = ${immunizationId} AND patient_id = ${patientId}
        RETURNING 
          id,
          patient_id as "patientId",
          vaccine_name as "vaccineName",
          date_administered as "dateAdministered",
          administered_by as "administeredBy",
          batch_number as "batchNumber",
          manufacturer,
          next_due_date as "nextDueDate",
          notes,
          created_at as "createdAt"
      `);

      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error updating immunization:', error);
      res.status(500).json({ message: "Failed to update immunization", error: getErrorMessage(error) });
    }
  });

  // Delete immunization
  router.delete("/patients/:id/immunizations/:immunizationId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const immunizationId = Number.parseInt(req.params.immunizationId);

      await db.execute(sql`
        DELETE FROM vaccinations WHERE id = ${immunizationId}
      `);

      res.json({ message: "Immunization deleted successfully" });
    } catch (error) {
      console.error('Error deleting immunization:', error);
      res.status(500).json({ message: "Failed to delete immunization", error: getErrorMessage(error) });
    }
  });

  // =====================
  // IMAGING ROUTES
  // =====================

  // Get patient imaging studies
  router.get("/patients/:id/imaging", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);

      const result = await db.execute(sql`
        SELECT 
          id,
          patient_id as "patientId",
          study_type as "studyType",
          study_date as "studyDate",
          body_part as "bodyPart",
          indication,
          findings,
          impression,
          radiologist,
          referring_physician as "referringPhysician",
          modality,
          priority,
          status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM patient_imaging 
        WHERE patient_id = ${patientId} 
        ORDER BY study_date DESC
      `);

      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching imaging studies:', error);
      res.status(500).json({ message: "Failed to fetch imaging studies" });
    }
  });

  // Add imaging study
  router.post("/patients/:id/imaging", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const imagingData = req.body;

      const result = await db.execute(sql`
        INSERT INTO patient_imaging 
        (patient_id, study_type, study_date, body_part, indication, findings, 
         impression, radiologist, referring_physician, modality, priority, status, created_at)
        VALUES (
          ${patientId}, 
          ${imagingData.studyType}, 
          ${imagingData.studyDate}, 
          ${imagingData.bodyPart},
          ${imagingData.indication},
          ${imagingData.findings || null},
          ${imagingData.impression || null},
          ${imagingData.radiologist || null},
          ${imagingData.referringPhysician || null},
          ${imagingData.modality || null},
          ${imagingData.priority},
          ${imagingData.status},
          NOW()
        )
        RETURNING *
      `);

      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error adding imaging study:', error);
      res.status(500).json({ message: "Failed to add imaging study", error: getErrorMessage(error) });
    }
  });

  // Update imaging study
  router.patch("/patients/:id/imaging/:imagingId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const imagingId = Number.parseInt(req.params.imagingId);
      const imagingData = req.body;

      const result = await db.execute(sql`
        UPDATE patient_imaging 
        SET 
          study_type = ${imagingData.studyType},
          study_date = ${imagingData.studyDate},
          body_part = ${imagingData.bodyPart},
          indication = ${imagingData.indication},
          findings = ${imagingData.findings || null},
          impression = ${imagingData.impression || null},
          radiologist = ${imagingData.radiologist || null},
          referring_physician = ${imagingData.referringPhysician || null},
          modality = ${imagingData.modality || null},
          priority = ${imagingData.priority},
          status = ${imagingData.status},
          updated_at = NOW()
        WHERE id = ${imagingId} AND patient_id = ${patientId}
        RETURNING *
      `);

      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error updating imaging study:', error);
      res.status(500).json({ message: "Failed to update imaging study", error: getErrorMessage(error) });
    }
  });

  // Delete imaging study
  router.delete("/patients/:id/imaging/:imagingId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const imagingId = Number.parseInt(req.params.imagingId);

      await db.execute(sql`
        DELETE FROM patient_imaging WHERE id = ${imagingId}
      `);

      res.json({ message: "Imaging study deleted successfully" });
    } catch (error) {
      console.error('Error deleting imaging study:', error);
      res.status(500).json({ message: "Failed to delete imaging study", error: getErrorMessage(error) });
    }
  });

  // =====================
  // PROCEDURES ROUTES
  // =====================

  // Get patient procedures
  router.get("/patients/:id/procedures", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);

      const result = await db.execute(sql`
        SELECT 
          id,
          patient_id as "patientId",
          procedure_name as "procedureName",
          procedure_date as "procedureDate",
          procedure_type as "procedureType",
          performed_by as "performedBy",
          assistant,
          indication,
          description,
          outcome,
          complications,
          follow_up_required as "followUpRequired",
          follow_up_date as "followUpDate",
          location,
          anesthesia_type as "anesthesiaType",
          notes,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM patient_procedures 
        WHERE patient_id = ${patientId} 
        ORDER BY procedure_date DESC
      `);

      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching procedures:', error);
      res.status(500).json({ message: "Failed to fetch procedures" });
    }
  });

  // Add procedure
  router.post("/patients/:id/procedures", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const procedureData = req.body;

      const result = await db.execute(sql`
        INSERT INTO patient_procedures 
        (patient_id, procedure_name, procedure_date, procedure_type, performed_by, 
         assistant, indication, description, outcome, complications, follow_up_required,
         follow_up_date, location, anesthesia_type, notes, created_at)
        VALUES (
          ${patientId}, 
          ${procedureData.procedureName}, 
          ${procedureData.procedureDate}, 
          ${procedureData.procedureType},
          ${procedureData.performedBy || null},
          ${procedureData.assistant || null},
          ${procedureData.indication},
          ${procedureData.description || null},
          ${procedureData.outcome || null},
          ${procedureData.complications || null},
          ${procedureData.followUpRequired || false},
          ${procedureData.followUpDate || null},
          ${procedureData.location || null},
          ${procedureData.anesthesiaType || null},
          ${procedureData.notes || null},
          NOW()
        )
        RETURNING *
      `);

      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error adding procedure:', error);
      res.status(500).json({ message: "Failed to add procedure", error: getErrorMessage(error) });
    }
  });

  // Update procedure
  router.patch("/patients/:id/procedures/:procedureId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const patientId = Number.parseInt(req.params.id);
      const procedureId = Number.parseInt(req.params.procedureId);
      const procedureData = req.body;

      const result = await db.execute(sql`
        UPDATE patient_procedures 
        SET 
          procedure_name = ${procedureData.procedureName},
          procedure_date = ${procedureData.procedureDate},
          procedure_type = ${procedureData.procedureType},
          performed_by = ${procedureData.performedBy || null},
          assistant = ${procedureData.assistant || null},
          indication = ${procedureData.indication},
          description = ${procedureData.description || null},
          outcome = ${procedureData.outcome || null},
          complications = ${procedureData.complications || null},
          follow_up_required = ${procedureData.followUpRequired || false},
          follow_up_date = ${procedureData.followUpDate || null},
          location = ${procedureData.location || null},
          anesthesia_type = ${procedureData.anesthesiaType || null},
          notes = ${procedureData.notes || null},
          updated_at = NOW()
        WHERE id = ${procedureId} AND patient_id = ${patientId}
        RETURNING *
      `);

      res.json(result.rows?.[0] || result);
    } catch (error) {
      console.error('Error updating procedure:', error);
      res.status(500).json({ message: "Failed to update procedure", error: getErrorMessage(error) });
    }
  });

  // Delete procedure
  router.delete("/patients/:id/procedures/:procedureId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const procedureId = Number.parseInt(req.params.procedureId);

      await db.execute(sql`
        DELETE FROM patient_procedures WHERE id = ${procedureId}
      `);

      res.json({ message: "Procedure deleted successfully" });
    } catch (error) {
      console.error('Error deleting procedure:', error);
      res.status(500).json({ message: "Failed to delete procedure", error: getErrorMessage(error) });
    }
  });

  return router;
}

export default setupPatientExtendedRoutes;

