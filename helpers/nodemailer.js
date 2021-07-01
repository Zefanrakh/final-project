const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "smartdaycare.cs@gmail.com",
        pass: "sandisandi"
    }
});

const sendEmail = (toEmail, link)=>{
    const mailOptions = {
        from: "smartdaycare.cs@gmail.com",
        to: toEmail, 
        subject: 'Informasi akses kamera',
        html: `
        <p>Gunakan link berikut untuk mengontrol kondisi anak ada melalui kamera :</p>
        <table>
            <tr><td><button><a href="${link}">Open Akes Kamera</a></button></td></tr>
        </table>
        `
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log(response);
        }
    });
}

module.exports = sendEmail