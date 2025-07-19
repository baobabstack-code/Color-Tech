import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Admin emails - these will receive form submission notifications
const ADMIN_EMAILS = [
  "admin@colortech.co.zw",
  "info@colortech.co.zw",
  // Add more admin emails as needed
];

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(EMAIL_CONFIG);
};

// Send email notification to admins about new form submission
export const sendFormSubmissionNotification = async (formData: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  type: string;
}) => {
  try {
    const transporter = createTransporter();

    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Form Submission</h1>
          <p style="color: white; margin: 5px 0;">ColorTech Panel Beaters</p>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
            Contact Form Submission
          </h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <a href="mailto:${formData.email}" style="color: #667eea;">${formData.email}</a>
                </td>
              </tr>
              ${
                formData.phone
                  ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <a href="tel:${formData.phone}" style="color: #667eea;">${formData.phone}</a>
                </td>
              </tr>
              `
                  : ""
              }
              ${
                formData.service
                  ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Service:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.service}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                <td style="padding: 10px;">
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                    ${formData.message.replace(/\n/g, "<br>")}
                  </div>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="mailto:${formData.email}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reply to Customer
            </a>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <p>This email was sent from your ColorTech Panel Beaters website contact form.</p>
            <p>Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;

    const emailPromises = ADMIN_EMAILS.map((adminEmail) =>
      transporter.sendMail({
        from: `"ColorTech Panel Beaters" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Contact Form Submission - ${formData.name}`,
        html: adminEmailContent,
      })
    );

    await Promise.all(emailPromises);
    console.log("Form submission notification emails sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending form submission notification:", error);
    return false;
  }
};

// Send confirmation email to the customer
export const sendCustomerConfirmation = async (customerData: {
  name: string;
  email: string;
  service?: string;
}) => {
  try {
    const transporter = createTransporter();

    const customerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thank You!</h1>
          <p style="color: white; margin: 5px 0;">ColorTech Panel Beaters</p>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Hi ${customerData.name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #555; line-height: 1.6;">
              Thank you for contacting ColorTech Panel Beaters! We have received your inquiry and will get back to you within 24 hours.
            </p>
            
            ${
              customerData.service
                ? `
            <p style="color: #555; line-height: 1.6;">
              We noticed you're interested in our <strong>${customerData.service}</strong> service. Our expert team will provide you with detailed information and a competitive quote.
            </p>
            `
                : ""
            }
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>Our team will review your inquiry</li>
                <li>We'll contact you within 24 hours</li>
                <li>We'll provide a detailed quote if applicable</li>
                <li>We'll schedule a convenient time for service</li>
              </ul>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p style="color: #555; margin: 5px 0;">📞 Phone: +263 77 123 4567</p>
            <p style="color: #555; margin: 5px 0;">📧 Email: info@colortech.co.zw</p>
            <p style="color: #555; margin: 5px 0;">📍 Address: 123 Industrial Road, Harare, Zimbabwe</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <p>This is an automated confirmation email from ColorTech Panel Beaters.</p>
            <p>If you have any urgent questions, please call us directly.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"ColorTech Panel Beaters" <${process.env.SMTP_USER}>`,
      to: customerData.email,
      subject: "Thank you for contacting ColorTech Panel Beaters",
      html: customerEmailContent,
    });

    console.log("Customer confirmation email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending customer confirmation:", error);
    return false;
  }
};
