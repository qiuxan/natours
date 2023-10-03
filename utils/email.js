//require nodemailer package
const nodemailer = require('nodemailer');
//require pug
const pug = require('pug');
//require html-to-text
const { htmlToText } = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Ian Q <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            //sendgrid
            return 1;
        }

        return nodemailer.createTransport({
            service: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // send the actual email

    async send(template, subject) {
        //1> render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject
            }
        )
        //2> define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)

        }

        // console.log(htmlToText);
        //3> create a transport and send email
        await this.newTransport().sendMail(mailOptions);

    }


    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }
}

