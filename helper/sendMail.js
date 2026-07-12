const nodemailer = require("nodemailer");

module.exports.sendEmail = async (emailReceiver,otp) =>{

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    console.log(JSON.stringify(process.env.EMAIL_PASS));

    try{
        const info = await transporter.sendMail({
            from: "baosom2k6@gmail.com",
            to: emailReceiver,
            subject: "Mã xác thực OTP",
            html: `
                <h2>Xác thực tài khoản</h2>

                <p>Xin chào,</p>

                <p>Bạn vừa yêu cầu xác thực tài khoản.</p>

                <p>Mã OTP của bạn là:</p>

                <h1 style="color:#0d6efd;">${otp}</h1>

                <p>Mã có hiệu lực trong <strong>5 phút</strong>.</p>

                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>

                <hr>

                <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
            `
        })
        console.log(info);
    }catch(err){
        console.log("Lỗi trong quá trình gửi email: "+err);
    }
}