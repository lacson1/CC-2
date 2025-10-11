import { Router } from "express";
import { db } from "../db";
import { patients, appointments, labResults, labOrders, prescriptions, vitalSigns, users } from "@shared/schema";
import { authenticateApiKey, requireApiPermission, type ApiAuthRequest } from "../middleware/api-auth";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

const router = Router();

// All routes require API key authentication
router.use(authenticateApiKey);

/**
 * Mobile API - Optimized endpoints with minimal payload
 * - Only essential fields returned
 * - Simplified response structure
 * - Optimized for mobile bandwidth
 */

// Patient summary (minimal data for list views)
router.get('/patients/summary', requireApiPermission('patients:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const orgId = req.apiKey!.organizationId;

    const results = await db
      .select({
        id: patients.id,
        name: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        phone: patients.phone,
        dob: patients.dateOfBirth
      })
      .from(patients)
      .where(eq(patients.organizationId, orgId))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Single patient essential info
router.get('/patients/:id/info', requireApiPermission('patients:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { id } = req.params;
    const orgId = req.apiKey!.organizationId;

    const [patient] = await db
      .select({
        id: patients.id,
        name: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        phone: patients.phone,
        email: patients.email,
        dob: patients.dateOfBirth,
        gender: patients.gender,
        allergies: patients.allergies
      })
      .from(patients)
      .where(and(
        eq(patients.id, Number(id)),
        eq(patients.organizationId, orgId)
      ))
      .limit(1);

    if (!patient) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Today's appointments (optimized for dashboard)
router.get('/appointments/today', requireApiPermission('appointments:read'), async (req: ApiAuthRequest, res) => {
  try {
    const orgId = req.apiKey!.organizationId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const results = await db
      .select({
        id: appointments.id,
        patient: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        time: appointments.appointmentTime,
        status: appointments.status
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(and(
        eq(appointments.organizationId, orgId),
        gte(appointments.appointmentDate, today),
        lte(appointments.appointmentDate, tomorrow)
      ))
      .orderBy(appointments.appointmentTime);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Upcoming appointments (next 7 days)
router.get('/appointments/upcoming', requireApiPermission('appointments:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { limit = 10 } = req.query;
    const orgId = req.apiKey!.organizationId;
    const now = new Date();

    const results = await db
      .select({
        id: appointments.id,
        patient: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        date: appointments.appointmentDate,
        time: appointments.appointmentTime,
        status: appointments.status
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(and(
        eq(appointments.organizationId, orgId),
        gte(appointments.appointmentDate, now)
      ))
      .orderBy(appointments.appointmentDate, appointments.appointmentTime)
      .limit(Number(limit));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Patient's recent vitals (last 5)
router.get('/patients/:id/vitals/recent', requireApiPermission('vitals:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { id } = req.params;
    const orgId = req.apiKey!.organizationId;

    const results = await db
      .select({
        id: vitalSigns.id,
        temp: vitalSigns.temperature,
        bp: vitalSigns.bloodPressure,
        hr: vitalSigns.heartRate,
        spo2: vitalSigns.oxygenSaturation,
        date: vitalSigns.recordedAt
      })
      .from(vitalSigns)
      .where(and(
        eq(vitalSigns.patientId, Number(id)),
        eq(vitalSigns.organizationId, orgId)
      ))
      .orderBy(desc(vitalSigns.recordedAt))
      .limit(5);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
});

// Patient's active prescriptions
router.get('/patients/:id/prescriptions/active', requireApiPermission('prescriptions:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { id } = req.params;
    const orgId = req.apiKey!.organizationId;

    const results = await db
      .select({
        id: prescriptions.id,
        med: prescriptions.medicationName,
        dose: prescriptions.dosage,
        freq: prescriptions.frequency,
        end: prescriptions.endDate
      })
      .from(prescriptions)
      .where(and(
        eq(prescriptions.patientId, Number(id)),
        eq(prescriptions.organizationId, orgId),
        eq(prescriptions.status, 'active')
      ))
      .orderBy(desc(prescriptions.startDate));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Patient's recent lab results
router.get('/patients/:id/labs/recent', requireApiPermission('lab:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;
    const orgId = req.apiKey!.organizationId;

    const results = await db
      .select({
        id: labResults.id,
        test: labResults.testName,
        result: labResults.result,
        unit: labResults.unit,
        status: labResults.status,
        date: labResults.createdAt
      })
      .from(labResults)
      .leftJoin(labOrders, eq(labResults.orderId, labOrders.id))
      .where(and(
        eq(labOrders.patientId, Number(id)),
        eq(labOrders.organizationId, orgId)
      ))
      .orderBy(desc(labResults.createdAt))
      .limit(Number(limit));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// Dashboard stats (for mobile home screen)
router.get('/dashboard/stats', async (req: ApiAuthRequest, res) => {
  try {
    const orgId = req.apiKey!.organizationId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get counts in parallel
    const [patientsCount, todayAppointments, pendingLabs, activePrescriptions] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(patients)
        .where(eq(patients.organizationId, orgId))
        .then(r => r[0]?.count || 0),
      
      db.select({ count: sql<number>`count(*)` })
        .from(appointments)
        .where(and(
          eq(appointments.organizationId, orgId),
          gte(appointments.appointmentDate, today)
        ))
        .then(r => r[0]?.count || 0),
      
      db.select({ count: sql<number>`count(*)` })
        .from(labOrders)
        .where(and(
          eq(labOrders.organizationId, orgId),
          eq(labOrders.status, 'pending')
        ))
        .then(r => r[0]?.count || 0),
      
      db.select({ count: sql<number>`count(*)` })
        .from(prescriptions)
        .where(and(
          eq(prescriptions.organizationId, orgId),
          eq(prescriptions.status, 'active')
        ))
        .then(r => r[0]?.count || 0)
    ]);

    res.json({
      patients: patientsCount,
      appointments: todayAppointments,
      labs: pendingLabs,
      prescriptions: activePrescriptions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Quick search (patients only, minimal data)
router.get('/search', requireApiPermission('patients:read'), async (req: ApiAuthRequest, res) => {
  try {
    const { q, limit = 10 } = req.query;
    const orgId = req.apiKey!.organizationId;

    if (!q || typeof q !== 'string') {
      return res.json([]);
    }

    const searchTerm = `%${q}%`;

    const results = await db
      .select({
        id: patients.id,
        name: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        phone: patients.phone
      })
      .from(patients)
      .where(and(
        eq(patients.organizationId, orgId),
        sql`(${patients.firstName} || ' ' || ${patients.lastName}) ILIKE ${searchTerm} OR ${patients.phone} ILIKE ${searchTerm}`
      ))
      .limit(Number(limit));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
