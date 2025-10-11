import { Router } from "express";
import { db } from "../db";
import { patients, appointments, labResults, labOrders, prescriptions, visits, users, organizations, vitalSigns } from "@shared/schema";
import { authenticateApiKey, requireApiPermission, type ApiAuthRequest } from "../middleware/api-auth";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

const router = Router();

// All routes require API key authentication
router.use(authenticateApiKey);

// Health check endpoint
router.get('/health', (req: ApiAuthRequest, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    organization: req.apiKey?.organizationId
  });
});

// Patient endpoints
router.get('/patients', requireApiPermission('patients:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { limit = 50, offset = 0, search } = req.query;
    const orgId = req.apiKey!.organizationId;

    let query = db
      .select()
      .from(patients)
      .where(eq(patients.organizationId, orgId))
      .limit(Number(limit))
      .offset(Number(offset));

    const results = await query;

    res.json({
      data: results,
      meta: {
        limit: Number(limit),
        offset: Number(offset),
        count: results.length
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

router.get('/patients/:id', requireApiPermission('patients:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { id } = req.params;
    const orgId = req.apiKey!.organizationId;

    const [patient] = await db
      .select()
      .from(patients)
      .where(and(
        eq(patients.id, Number(id)),
        eq(patients.organizationId, orgId)
      ))
      .limit(1);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ data: patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Appointments endpoints
router.get('/appointments', requireApiPermission('appointments:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { limit = 50, offset = 0, status, from, to } = req.query;
    const orgId = req.apiKey!.organizationId;

    let conditions = [eq(appointments.organizationId, orgId)];

    if (status) {
      conditions.push(eq(appointments.status, status as string));
    }

    if (from) {
      conditions.push(gte(appointments.appointmentDate, new Date(from as string)));
    }

    if (to) {
      conditions.push(lte(appointments.appointmentDate, new Date(to as string)));
    }

    const results = await db
      .select({
        id: appointments.id,
        patientId: appointments.patientId,
        patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        doctorId: appointments.doctorId,
        doctorName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.doctorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(appointments.appointmentDate))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({
      data: results,
      meta: {
        limit: Number(limit),
        offset: Number(offset),
        count: results.length
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Lab results endpoints
router.get('/lab-results', requireApiPermission('lab:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { limit = 50, offset = 0, patientId, from, to } = req.query;
    const orgId = req.apiKey!.organizationId;

    let conditions = [eq(labOrders.organizationId, orgId)];

    if (patientId) {
      conditions.push(eq(labOrders.patientId, Number(patientId)));
    }

    if (from) {
      conditions.push(gte(labOrders.createdAt, new Date(from as string)));
    }

    if (to) {
      conditions.push(lte(labOrders.createdAt, new Date(to as string)));
    }

    const results = await db
      .select({
        orderId: labOrders.id,
        patientId: labOrders.patientId,
        patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        orderDate: labOrders.createdAt,
        status: labOrders.status,
        resultId: labResults.id,
        testName: labResults.testName,
        result: labResults.result,
        unit: labResults.unit,
        referenceRange: labResults.referenceRange,
        status: labResults.status,
        resultDate: labResults.createdAt
      })
      .from(labOrders)
      .leftJoin(patients, eq(labOrders.patientId, patients.id))
      .leftJoin(labResults, eq(labResults.orderId, labOrders.id))
      .where(and(...conditions))
      .orderBy(desc(labOrders.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({
      data: results,
      meta: {
        limit: Number(limit),
        offset: Number(offset),
        count: results.length
      }
    });
  } catch (error) {
    console.error('Error fetching lab results:', error);
    res.status(500).json({ error: 'Failed to fetch lab results' });
  }
});

// Prescriptions endpoints
router.get('/prescriptions', requireApiPermission('prescriptions:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { limit = 50, offset = 0, patientId, status } = req.query;
    const orgId = req.apiKey!.organizationId;

    let conditions = [eq(prescriptions.organizationId, orgId)];

    if (patientId) {
      conditions.push(eq(prescriptions.patientId, Number(patientId)));
    }

    if (status) {
      conditions.push(eq(prescriptions.status, status as string));
    }

    const results = await db
      .select({
        id: prescriptions.id,
        patientId: prescriptions.patientId,
        patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        doctorId: prescriptions.doctorId,
        doctorName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        medicationName: prescriptions.medicationName,
        dosage: prescriptions.dosage,
        frequency: prescriptions.frequency,
        duration: prescriptions.duration,
        status: prescriptions.status,
        startDate: prescriptions.startDate,
        endDate: prescriptions.endDate,
        createdAt: prescriptions.createdAt
      })
      .from(prescriptions)
      .leftJoin(patients, eq(prescriptions.patientId, patients.id))
      .leftJoin(users, eq(prescriptions.doctorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(prescriptions.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({
      data: results,
      meta: {
        limit: Number(limit),
        offset: Number(offset),
        count: results.length
      }
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Vital signs endpoints
router.get('/vital-signs', requireApiPermission('vitals:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { limit = 50, offset = 0, patientId, from, to } = req.query;
    const orgId = req.apiKey!.organizationId;

    let conditions = [eq(vitalSigns.organizationId, orgId)];

    if (patientId) {
      conditions.push(eq(vitalSigns.patientId, Number(patientId)));
    }

    if (from) {
      conditions.push(gte(vitalSigns.recordedAt, new Date(from as string)));
    }

    if (to) {
      conditions.push(lte(vitalSigns.recordedAt, new Date(to as string)));
    }

    const results = await db
      .select({
        id: vitalSigns.id,
        patientId: vitalSigns.patientId,
        patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        temperature: vitalSigns.temperature,
        bloodPressure: vitalSigns.bloodPressure,
        heartRate: vitalSigns.heartRate,
        respiratoryRate: vitalSigns.respiratoryRate,
        oxygenSaturation: vitalSigns.oxygenSaturation,
        weight: vitalSigns.weight,
        height: vitalSigns.height,
        recordedAt: vitalSigns.recordedAt,
        recordedBy: vitalSigns.recordedBy
      })
      .from(vitalSigns)
      .leftJoin(patients, eq(vitalSigns.patientId, patients.id))
      .where(and(...conditions))
      .orderBy(desc(vitalSigns.recordedAt))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({
      data: results,
      meta: {
        limit: Number(limit),
        offset: Number(offset),
        count: results.length
      }
    });
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    res.status(500).json({ error: 'Failed to fetch vital signs' });
  }
});

// Organization info endpoint (read-only)
router.get('/organization', async (req: ApiAuthRequest, res) => {
  try {
    const orgId = req.apiKey!.organizationId;

    const [org] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        type: organizations.type,
        address: organizations.address,
        phone: organizations.phone,
        email: organizations.email,
        website: organizations.website,
        isActive: organizations.isActive
      })
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({ data: org });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

export default router;
