import info from '../../../config'
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, MY_EMAIL } = info

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendMail = async (receiver, mail) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MY_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from: 'Hê hê',
            to: receiver,
            subject: mail.subject,
            text: mail.text,
            html: mail.html
        }

        console.log(`Sending email to ${receiver}...`);
        const result = await transport.sendMail(mailOptions);
        if (result.accepted != null) console.info(`\x1b[32mSent to ${result.accepted[0]}`)
        else console.error(`\x1b[31mFailed to send email to ${result.accepted[0]}`)
    } catch (e) {
        console.log(e)
    }
}

const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export { sendMail, isValidEmail };