import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER || "seuemail@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "sua_senha_app";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export class EmailService {
  
  /**
   * Envia email de boas-vindas para novos usuários
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"SempreFit" <${EMAIL_USER}>`,
        to: email,
        subject: "Bem-vindo(a) ao SempreFit! 🏃‍♂️",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #1a1a2e; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">🏃‍♂️ SempreFit</h1>
              <p style="margin: 5px 0 0; opacity: 0.8;">Sua jornada saudável começa aqui!</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1a1a2e;">Olá, ${name}! 👋</h2>
              
              <p>Bem-vindo(a) ao <strong>SempreFit</strong>!</p>
              
              <p>Estamos muito felizes por ter você conosco. Com o SempreFit, você pode:</p>
              
              <ul style="padding-left: 20px;">
                <li>🍽️ Registrar suas refeições e calorias</li>
                <li>🏃‍♂️ Acompanhar seus exercícios</li>
                <li>🧘 Monitorar suas meditações</li>
                <li>📊 Visualizar seu progresso no dashboard</li>
              </ul>
              
              <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                <p style="margin: 0; color: #2e7d32;">
                  <strong>📝 Dica:</strong> Comece registrando sua primeira refeição ou exercício hoje mesmo!
                </p>
              </div>
              
              <p style="margin-top: 20px;">Seus dados de acesso:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                Este é um email automático, por favor não responda.<br />
                © ${new Date().getFullYear()} SempreFit - Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email de boas-vindas enviado para ${email}`);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      // Não lançar erro para não bloquear o registro
    }
  }

  async sendLoginNotification(email: string, name: string, ip?: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"SempreFit" <${EMAIL_USER}>`,
        to: email,
        subject: "Novo login detectado no SempreFit",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #1a1a2e; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">SempreFit</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1a1a2e;">Olá, ${name}! 👋</h2>
              
              <p>Detectamos um novo login na sua conta.</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>📍 Data/Hora:</strong> ${new Date().toLocaleString()}</p>
                ${ip ? `<p style="margin: 5px 0;"><strong>🌐 IP:</strong> ${ip}</p>` : ''}
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Se não foi você que fez login, entre em contato imediatamente.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                © ${new Date().getFullYear()} SempreFit - Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Notificação de login enviada para ${email}`);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }
  }


  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async isValidDomain(email: string): Promise<boolean> {
    try {
      const domain = email.split('@')[1];
      const dns = await import('dns');
      
      return new Promise((resolve) => {
        dns.resolveMx(domain, (err) => {
          resolve(!err);
        });
      });
    } catch {
      return true;
    }
  }
}