import * as staffService from "../services/staff.js";

export const createWalkIn = async (req, res, next) => {
  try {
    const appointmentData = {
      ...req.body,
      hospital_id: req.roleData.hospital_id, // Pulled from the Staff table via authorizeRole
      status: "pending"
    };
    const appointment = await staffService.bookWalkInAppointment(appointmentData);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const monitorQueue = async (req, res, next) => {
  try {
    const queue = await staffService.getQueue(req.roleData.hospital_id);
    res.status(200).json({ success: true, data: queue });
  } catch (error) {
    next(error);
  }
};

export const tagEmergency = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const result = await staffService.updateAppointmentStatus(appointmentId, { isEmergency: true });
    res.status(200).json({ success: true, message: "Tagged as emergency", data: result });
  } catch (error) {
    next(error);
  }
};

export const markArrival = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const result = await staffService.updateAppointmentStatus(appointmentId, { status: "arrived" });
    res.status(200).json({ success: true, message: "Patient arrival verified", data: result });
  } catch (error) {
    next(error);
  }
};
