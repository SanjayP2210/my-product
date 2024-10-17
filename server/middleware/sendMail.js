import nodeMailer from 'nodemailer';

export const sendMail = async ({ message, email, subject, html }) => {
    try {

        const transport = nodeMailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            service: 'gmail',
            // secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            }
        })

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: subject,
            // text: message,
            html: html
        }
        try {
            const response = await transport.sendMail(mailOptions);
            const preview = await nodeMailer.getTestMessageUrl(response);
            return { ...response, preview: preview };
        } catch (error) {
            return { isError: true, error };
        }

    } catch (error) {
        return error;
    }
}