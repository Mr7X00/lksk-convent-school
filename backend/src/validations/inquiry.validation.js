/**
 * Validation rules and spam protection for Contact and Admission inquiries
 * L.K.S.K Convent School
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  // Strip null bytes and dangerous script injections
  return str.replace(/\0/g, '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
};

const validateContactInquiry = (req) => {
  const { name, email, phone, subject, message, hp_website, hp_field, website_hp } = req.body || {};
  const errors = [];

  // 1. Anti-spam Honeypot Check
  if (hp_website || hp_field || website_hp) {
    errors.push({ field: 'bot_detected', message: 'Spam detected. Submission rejected.' });
    return errors;
  }

  // 2. Name validation
  const cleanName = sanitizeString(name);
  if (!cleanName || cleanName.length < 2) {
    errors.push({ field: 'name', message: 'Full name is required and must be at least 2 characters.' });
  } else if (cleanName.length > 80) {
    errors.push({ field: 'name', message: 'Name cannot exceed 80 characters.' });
  }

  // 3. Email validation
  const cleanEmail = sanitizeString(email).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });
  } else if (cleanEmail.length > 120) {
    errors.push({ field: 'email', message: 'Email address cannot exceed 120 characters.' });
  }

  // 4. Phone validation (optional for contact, but if provided must be valid)
  if (phone) {
    const cleanPhone = sanitizeString(phone);
    const phoneRegex = /^[0-9+\-\s()]{8,18}$/;
    if (!phoneRegex.test(cleanPhone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number (8-18 digits).' });
    }
  }

  // 5. Subject validation
  const cleanSubject = sanitizeString(subject);
  if (!cleanSubject || cleanSubject.length < 3) {
    errors.push({ field: 'subject', message: 'Subject is required and must be at least 3 characters.' });
  } else if (cleanSubject.length > 150) {
    errors.push({ field: 'subject', message: 'Subject cannot exceed 150 characters.' });
  }

  // 6. Message validation
  const cleanMessage = sanitizeString(message);
  if (!cleanMessage || cleanMessage.length < 10) {
    errors.push({ field: 'message', message: 'Message is required and must be at least 10 characters.' });
  } else if (cleanMessage.length > 2000) {
    errors.push({ field: 'message', message: 'Message cannot exceed 2000 characters.' });
  }

  return errors;
};

const validateAdmissionInquiry = (req) => {
  const {
    studentName,
    parentName,
    email,
    phone,
    classSeeking,
    gradeApplying,
    dateOfBirth,
    dob,
    gender,
    address,
    message,
    hp_website,
    hp_field,
    website_hp,
  } = req.body || {};
  const errors = [];

  // 1. Anti-spam Honeypot Check
  if (hp_website || hp_field || website_hp) {
    errors.push({ field: 'bot_detected', message: 'Spam detected. Submission rejected.' });
    return errors;
  }

  // 2. Student Name
  const cleanStudent = sanitizeString(studentName);
  if (!cleanStudent || cleanStudent.length < 2) {
    errors.push({ field: 'studentName', message: 'Student name is required and must be at least 2 characters.' });
  } else if (cleanStudent.length > 80) {
    errors.push({ field: 'studentName', message: 'Student name cannot exceed 80 characters.' });
  }

  // 3. Parent / Guardian Name
  const cleanParent = sanitizeString(parentName);
  if (!cleanParent || cleanParent.length < 2) {
    errors.push({ field: 'parentName', message: 'Parent or guardian name is required and must be at least 2 characters.' });
  } else if (cleanParent.length > 80) {
    errors.push({ field: 'parentName', message: 'Parent name cannot exceed 80 characters.' });
  }

  // 4. Contact Phone Number (Mandatory for admissions)
  const cleanPhone = sanitizeString(phone);
  const phoneRegex = /^[0-9+\-\s()]{8,18}$/;
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    errors.push({ field: 'phone', message: 'A valid contact phone number (8-18 digits) is required.' });
  }

  // 5. Email Address
  const cleanEmail = sanitizeString(email).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  } else if (cleanEmail.length > 120) {
    errors.push({ field: 'email', message: 'Email cannot exceed 120 characters.' });
  }

  // 6. Class Seeking / Grade Applying
  const cleanClass = sanitizeString(classSeeking || gradeApplying);
  if (!cleanClass || cleanClass.length === 0) {
    errors.push({ field: 'classSeeking', message: 'Class or grade seeking admission is required.' });
  } else if (cleanClass.length > 60) {
    errors.push({ field: 'classSeeking', message: 'Class selection is invalid.' });
  }

  // 7. Date of Birth (Optional but if provided must be a valid date)
  const rawDob = dateOfBirth || dob;
  if (rawDob) {
    const parsedDate = new Date(rawDob);
    if (isNaN(parsedDate.getTime()) || parsedDate > new Date()) {
      errors.push({ field: 'dateOfBirth', message: 'Please enter a valid date of birth.' });
    }
  }

  // 8. Gender (Optional, check valid option if given)
  if (gender) {
    const cleanGender = sanitizeString(gender).toLowerCase();
    const validGenders = ['male', 'female', 'other', 'unspecified'];
    if (!validGenders.includes(cleanGender)) {
      errors.push({ field: 'gender', message: 'Please select a valid gender option.' });
    }
  }

  // 9. Address
  if (address) {
    const cleanAddress = sanitizeString(address);
    if (cleanAddress.length > 500) {
      errors.push({ field: 'address', message: 'Address cannot exceed 500 characters.' });
    }
  }

  // 10. Message / Notes
  if (message) {
    const cleanMessage = sanitizeString(message);
    if (cleanMessage.length > 2000) {
      errors.push({ field: 'message', message: 'Additional remarks cannot exceed 2000 characters.' });
    }
  }

  return errors;
};

module.exports = {
  validateContactInquiry,
  validateAdmissionInquiry,
};
