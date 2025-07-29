const forgetpassword = async (otp:string): Promise<string> => {

   return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
       <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
          <title>Forget Password</title>
          <style type="text/css">
             a{
              text-decoration: none;
              outline: none;
             }
             .container {
             box-shadow: 0px 0px 6px 0px #ccc;
             }
             body{
             font-family: 'Roboto', sans-serif;
             }
          </style>
       </head>
       <body>
          <table cellpadding="0" width="600" class="container" align="center" cellspacing="0" border="0">
             <tr>
                <td>
                   <table cellpadding="0" width="600" class="container" align="center" cellspacing="0" border="0" >
                      <tr style="
                         background-color: #ee4d29 !important;
                         height: 50px;">
                         <td></td>
                      </tr>
                      <tr>
                         <td>
                            <div align='center' >
                               <img style="text-align: center;margin-top: 0;width: 160px; margin-top: 30px;" src="${process.env.API_URL}/public/img/brand-logo-email.png">
                            </div>
                         </td>
                      </tr>
                      <tr height="40">
                         <td>
                            <p style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: #000; font-size: 20px; text-align: center;">Forgot Password </p>
                         </td>
                      </tr>
                      <tr>
                         <td>
                            <p style="font-family: 'Montserrat', sans-serif;color: #707070;text-align: left;padding: 0px 20px;font-size: 14px;line-height: 22px;">Hello,</p>
                            <p style="font-family: 'Montserrat', sans-serif;color: #707070;text-align: left;padding: 0px 20px;font-size: 14px;line-height: 22px;">We’ve received your request to reset your Itechno Portal password. To do so, Use the following OTP to complete your Sign Up procedures. 
                         </td>
                      </tr>
                      <tr>
                         <td style="
                            text-align: center;
                            padding: 30px 0;
                            "><p style="
                            background-color: #ee4d29;
                            padding: 18px 48px;
                            color: #fff;
                            display: inline-block;
                            border-radius: 20px;
                            font-size: 20px;
                            font-family: 'Montserrat', sans-serif;
                            ">${otp}</p></td>
                      </tr>
                      <tr>
                         <td>
                            <p style="font-family: 'Montserrat', sans-serif;color: #707070;text-align: left;padding: 0px 20px;margin-bottom: 30px;font-size: 14px;line-height: 22px;">Please do not reply to the email address above. If you have any questions, please email devteam@itechnolabs.biz</p>
                            <p style="font-family: 'Montserrat', sans-serif;color: #707070;text-align: left;padding: 0px 20px;margin-bottom: 30px;font-size: 14px;line-height: 22px;">Thank you,<br>Itechnolabs Team Support</p>
                            <p style="font-family: 'Montserrat', sans-serif;color: #707070;text-align: left;padding: 0px 20px;margin-bottom: 30px;font-size: 14px;line-height: 22px;">If you did not make this request or no longer want to change your password, please disregard this message; your account remains safe and your existing password will not be changed.</p>
                         </td>
                      </tr>
                      <tr style=" background-color:   #ee4d29   ;">
                         <td>
                            <div>
                               <p style="font-family: 'Montserrat', sans-serif;color: #fff;text-align: center;font-size: 14px;width: 100%;padding: 3px 0;">Copyright @Itechnolabs </p>
                            </div>
                         </td>
                      </tr>
                      </td>
                      </tr>
                   </table>
          </table>
       </body>
    </html>`
}

export default forgetpassword;