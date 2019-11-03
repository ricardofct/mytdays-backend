import { createTransport, getTestMessageUrl, createTestAccount } from 'nodemailer';

export async function sendMail(email: string, token: string) {
    console.log(process.env.MAIL_HOST, process.env.MAIL_PORT, process.env.MAIL_USER, process.env.MAIL_PASS)
    // create reusable transporter object using the default SMTP transport
    const transporter = createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const info = await transporter.sendMail(
        {
            from: process.env.MAIL_USER, // sender address
            to: 'chyna.labadie0@ethereal.email', // list of receivers
            subject: 'Recuperar pessword!', // Subject line
            // text: 'Hello world?', // plain text body
            html: `
            Se pretende recuperar a sua password clique no link: ${token}
            <br>
            Se não pretende, esqueça este email.
        ` // html body
        }
    );

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}