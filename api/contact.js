import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    try {
        await resend.emails.send({
            from: 'RSD Solutions <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL,
            subject: `Nuevo contacto de ${name}`,
            html: `
                <h2>Nuevo mensaje desde la landing page</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            `,
            reply_to: email,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error al enviar email:', error);
        return res.status(500).json({ error: 'Error al enviar el mensaje.' });
    }
}
