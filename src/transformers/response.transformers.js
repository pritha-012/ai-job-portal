export const responseTransformer = (req, res, next) => {
  console.log("📍 5. Reached Transformer"); // 👈 ADD THIS

  if (!res.locals.response) return next();

  const { statusCode = 200, message = "Success", data = null } = res.locals.response;
  
  const responsePayload = { success: true, code: statusCode, message, data };

  console.log("📍 6. Sending JSON to Postman!"); // 👈 ADD THIS
  
  // 👉 CRITICAL: If you don't have this exact line, Postman will buffer forever!
  return res.status(statusCode).json(responsePayload); 
};