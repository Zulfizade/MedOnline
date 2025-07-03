// Universal orphan file cleaner for MedOnline
// Deletes unused images in tips_photo, profile_photos, certificates
// Like django-cleanup, but for Node.js

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Tip from '../models/tipModel.js';
import Doctor from '../models/doctorModel.js';
import Patient from '../models/patientModel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medonline';
const UPLOADS = path.join(process.cwd(), 'uploads');
const DIRS = {
  tips_photo: path.join(UPLOADS, 'tips_photo'),
  profile_photos: path.join(UPLOADS, 'profile_photos'),
  certificates: path.join(UPLOADS, 'certificates'),
};

async function cleanupOrphanFiles() {
  await mongoose.connect(MONGO_URI);

  // 1. Tips images
  const tips = await Tip.find({}, 'image');
  const usedTips = new Set(tips.map(t => t.image && path.basename(t.image)));
  let deletedTips = 0;
  for (const file of fs.readdirSync(DIRS.tips_photo)) {
    if (!usedTips.has(file)) {
      fs.unlinkSync(path.join(DIRS.tips_photo, file));
      deletedTips++;
    }
  }

  // 2. Profile photos (doctors + patients)
  const doctors = await Doctor.find({}, 'profilePhoto certificates');
  const patients = await Patient.find({}, 'profilePhoto');
  const usedProfiles = new Set([
    ...doctors.map(d => d.profilePhoto && path.basename(d.profilePhoto)).filter(Boolean),
    ...patients.map(p => p.profilePhoto && path.basename(p.profilePhoto)).filter(Boolean),
  ]);
  let deletedProfiles = 0;
  for (const file of fs.readdirSync(DIRS.profile_photos)) {
    if (!usedProfiles.has(file)) {
      fs.unlinkSync(path.join(DIRS.profile_photos, file));
      deletedProfiles++;
    }
  }

  // 3. Certificates (doctors)
  const usedCertificates = new Set(doctors.flatMap(d => (d.certificates || []).map(f => path.basename(f))));
  let deletedCerts = 0;
  for (const file of fs.readdirSync(DIRS.certificates)) {
    if (!usedCertificates.has(file)) {
      fs.unlinkSync(path.join(DIRS.certificates, file));
      deletedCerts++;
    }
  }

  await mongoose.disconnect();
  console.log(`Orphan tip şəkil: ${deletedTips}, orphan profil şəkil: ${deletedProfiles}, orphan sertifikat: ${deletedCerts}`);
}

cleanupOrphanFiles();
