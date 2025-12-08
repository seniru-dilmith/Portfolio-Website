export const getBaseEmailStyle = () => `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
  .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .email-header { background-color: #0f172a; padding: 20px; text-align: center; color: #ffffff; }
  .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }
  .email-body { padding: 30px; color: #475569; }
  .email-body h2 { color: #1e293b; font-size: 20px; margin-top: 0; }
  .email-body p { margin-bottom: 15px; }
  .email-footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  .highlight { color: #2563eb; font-weight: 500; }
  .btn { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 10px; font-weight: 500; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
`;

export const getConfirmationEmailHtml = (name: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request Received</title>
  <style>${getBaseEmailStyle()}</style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Request Received</h1>
    </div>
    <div class="email-body">
      <h2>Hi ${name},</h2>
      <p>Thanks for reaching out! I've successfully received your project request titled:</p>
      <p class="highlight" style="font-size: 18px; text-align: center; padding: 10px; background-color: #eff6ff; border-radius: 4px;">"${title}"</p>
      <p>I will review the details and get back to you shortly regarding availability and next steps.</p>
      <hr />
      <p>Best regards,<br><strong>${process.env.NEXT_PUBLIC_SITE_NAME || 'Seniru Dilmith'}</strong></p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_NAME || 'Seniru Dilmith'}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const getReplyEmailHtml = (name: string, replyMessage: string, originalTitle: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Response to your Request</title>
  <style>${getBaseEmailStyle()}</style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>New Message</h1>
    </div>
    <div class="email-body">
      <h2>Hi ${name},</h2>
      <p style="font-size: 14px; color: #64748b;">Regarding your request: <strong>${originalTitle}</strong></p>
      <hr />
      <div style="white-space: pre-wrap; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155;">
        ${replyMessage.replace(/\n/g, '<br>')}
      </div>
      <br>
      <hr />
      <p>Best regards,<br><strong>${process.env.NEXT_PUBLIC_SITE_NAME || 'Seniru Dilmith'}</strong></p>
    </div>
    <div class="email-footer">
      <p>You received this email because you submitted a request on our website.</p>
      <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_NAME || 'Seniru Dilmith'}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
