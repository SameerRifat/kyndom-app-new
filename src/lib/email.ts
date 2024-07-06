'use server'

import EmailTemplate from '@/app/_components/auth/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export const sendEmail = async ({email, verificationLink, emailText, preview, subject, btnText}) => {


    const { data, error } = await resend.emails.send({
        from: 'Kyndom <info@kyndom.com>',
        to: [email],
        subject: subject,
        react: EmailTemplate({verificationLink, emailText, preview, btnText}),
    });

    if (error) {
        console.log("Error: in sendEmail function")
        return { error: error };
    }

    return { data };
};



// import { env } from "@/env";

// import mailjet from "node-mailjet";

// const Mailjet = mailjet.apiConnect(
//   env.MAILJET_API_KEY,
//   env.MAILJEY_SECRET_API_KEY,
// );

// export const sendEmail = async (
//   email: string,
//   subject: string,
//   html: string,
// ) => {
//     const request = await Mailjet.post("send").request({
//       Messages: [
//         {
//           FromEmail: `no-reply@${env.MAILJET_DOMAIN}`,
//           Recipients: [{ Email: email }],
//           Subject: subject,
//           "Html-part": html,
//         },
//       ],
//     });
//     if (!request) return false;
//     return true;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// };
