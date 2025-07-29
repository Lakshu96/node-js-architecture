
const verificationTemplate = async (otp: string): Promise<string> => {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Verify your email address </title>
        <style type="text/css" rel="stylesheet" media="all">
          /* Base ------------------------------ */
          *:not(br):not(tr):not(html) {
            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
          body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            line-height: 1.4;
            background-color: #F5F7F9;
            color: #839197;
            -webkit-text-size-adjust: none;
          }
          a {
            color: #414EF9;
          }
      
          /* Layout ------------------------------ */
          .email-wrapper {
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #F5F7F9;
          }
          .email-content {
            width: 100%;
            margin: 0;
            padding: 0;
          }
      
          /* Masthead ----------------------- */
          .email-masthead {
            padding: 25px 0;
            text-align: center;
          }
          .email-masthead_logo {
            max-width: 400px;
            border: 0;
          }
          .email-masthead_name {
            font-size: 16px;
            font-weight: bold;
            color: #839197;
            text-decoration: none;
            text-shadow: 0 1px 0 white;
          }
      
          /* Body ------------------------------ */
          .email-body {
            width: 100%;
            margin: 0;
            padding: 0;
            border-top: 1px solid #E7EAEC;
            border-bottom: 1px solid #E7EAEC;
            background-color: #FFFFFF;
          }
          .email-body_inner {
            width: 570px;
            margin: 0 auto;
            padding: 0;
          }
          .email-footer {
            width: 570px;
            margin: 0 auto;
            padding: 0;
            text-align: center;
          }
          .email-footer p {
            color: #839197;
          }
          .body-action {
            width: 100%;
            margin: 30px auto;
            padding: 0;
            text-align: center;
          }
          .body-sub {
            margin-top: 25px;
            padding-top: 25px;
            border-top: 1px solid #E7EAEC;
          }
          .content-cell {
            padding: 35px;
            border-radius:20px;
          }
          .align-right {
            text-align: right;
          }
      
          /* Type ------------------------------ */
          h1 {
            margin-top: 0;
            color: #292E31;
            font-size: 19px;
            font-weight: bold;
            text-align: left;
          }
          h2 {
            margin-top: 0;
            color: #292E31;
            font-size: 16px;
            font-weight: bold;
            text-align: left;
          }
          h3 {
            margin-top: 0;
            color: #292E31;
            font-size: 14px;
            font-weight: bold;
            text-align: left;
          }
          p {
            margin-top: 0;
            color: #839197;
            font-size: 16px;
            line-height: 1.5em;
            text-align: left;
          }
          p.sub {
            font-size: 12px;
          }
          p.center {
            text-align: center;
          }
      
          /* Buttons ------------------------------ */
          .button {
            display: inline-block;
            width: 200px;
            background-color: #414EF9;
            border-radius: 3px;
            color: #ffffff;
            font-size: 15px;
            line-height: 45px;
            text-align: center;
            text-decoration: none;
            -webkit-text-size-adjust: none;
            mso-hide: all;
          }
          .button--green {
            background-color: #28DB67;
          }
          .button--red {
            background-color: #FF3665;
          }
          .button--blue {
            background-color: #414EF9;
          }
      
          /*Media Queries ------------------------------ */
          @media only screen and (max-width: 600px) {
            .email-body_inner,
            .email-footer {
              width: 100% !important;
            }
          }
          @media only screen and (max-width: 500px) {
            .button {
              width: 100% !important;
            }
          }
        </style>
      </head>
      <body>
        <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
                <!-- Logo -->
                <tr style="
                    background-color: #ee4d29 !important;
                    height: 50px;">
                    <td></td>
                </tr>
                <!--
                  <td>
                    <div align='center' >
                        <img style="text-align: center;margin-top: 0;width: 160px; margin-top: 30px;" src="${process.env.API_URL}/public/img/brand-logo-email.png">
                    </div>
                  </td>
                -->
                <!-- Email Body -->
                <tr>
                  <td class="email-body" width="100%">
                    <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                      <!-- Body content -->
                      <tr>
                        <td class="content-cell">
                        <h2>Verification needed</h2>
                        <br>
                        To finalize the account we need to verify your email address.
                        Please enter the following code on the app signup screen to complete the process:<br>
                        <br>
                        <div style="text-align:center ; margin: 20px 0">
                          <div style="background-color:#ee4d29;padding:2px 20px;color:#FFFFFF !important; display:inline-block; text-align:center; border-radius:15px">
                              <h1 style="letter-spacing: 10px;">${otp}</h1>
                          </div>
                        </div>
                        <br>
                        If you did not sign up, please ignore this email.
                        <br>
                        <br>
                        Yours truly,<br>
                        <br>
                        Laksh
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="margin-top:20px">
                    <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                      <tr>
                        <td class="content-cell" style=" background-color:#ee4d29; border-radius:"20px; width:100%">
                          <p class="sub center" style="color:#FFFFFF; text-align:center ; width:100% ; font-size:"16px; font-weight:600">
                          © ${currentYear}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html> 
  `
}

export default verificationTemplate;