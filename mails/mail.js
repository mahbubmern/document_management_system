import nodemailer from 'nodemailer';

export const AccountVerifyMail = async (to, data) => {
	try {
		const transport = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			auth: {
				user: process.env.MAIL_ID,
				pass: process.env.MAIL_PASS,
			},
		});

		await transport.sendMail({
			form: `Blood Donation App <${process.env.MAIL_ID}>`,
			to: to,
			subject: 'Account Activation Mail',
			text: 'Please Verify Your Account ',
			html: `
            <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Email Templete</title> <style> .main { width: 500px; /* height: 100vh; */ background-color: #e9e9e9; margin: 50px auto; } .email-wrapper .header img { width: 100%; height: 200px; object-fit: cover; } .middle-part img { width: 100%; } .body-part, .button, .footer { padding: 20px 15px; } .button button { width: 100%; cursor: pointer; background-color: rgb(19, 137, 216); outline: none; border: none; color: white; padding: 7px 0px; } .footer { display: flex; justify-content: space-between; background-color: rgba(230, 187, 102, 0.66); } .body-part h2{ text-align: center; } </style> </head> <body> <div class="main"> <div class="email-wrapper"> <div class="header"> <a href=""> <img src="https://img.freepik.com/free-vector/graphic-design-geometric-wallpaper_52683-34399.jpg?w=2000" alt="" /> </a> </div> <div class="middle-part"> <a href=""> <img src="https://media.istockphoto.com/photos/confident-in-her-abilities-picture-id876977896?b=1&k=20&m=876977896&s=170667a&w=0&h=GkOMIVv9PZZfrvs35QsIuBTVC9noD-fqgB569tlojdA=" alt="" /> </a> </div> <div class="body-part"> <h2>Welcome ${data.name} </h2> 
	
			<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. At rem omnis, fugiat facere possimus, sint maxime aliquid velit ipsa placeat error consectetur quo tenetur officiis aperiam ratione modi quia! Quasi eaque quisquam voluptas qui magnam eum consectetur quas commodi aspernatur delectus velit harum similique, molestiae ad ratione error, temporibus alias! </p> <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur soluta molestias veniam temporibus sint eveniet eos voluptatem possimus, eius inventore quo iste numquam quis at et iusto dignissimos sequi similique. </p> </div> <div class="button"> <a href=${data.link}><button type="submit" >Confirmation</button></a> </div> <div class="footer"> <div class="left-footer"> <p>Copywright Reserve</p> </div> <div class="right-footer"> <p>Designed By Md Mahbubur Rahman</p> </div> </div> </div> </div> 
			<div><button >Your OTP : ${data.otp}</button></div>
			</body> </html>
        `,
		});
	} catch (error) {
		console.log(error.message);
	}
};
