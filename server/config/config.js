'use strict';
let path = require('path');
module.exports = {
    appConfig: {
        app: {
            name: 'WashBay.in',
            version: '0.01',
            uploads: __dirname + '/../../uploads',
        }
    },
    systemConfig: {
        app: {
            port: '9135',
            pubKey: __dirname + '/../../keys/washbay.pub',
            privateKey: __dirname + '/../../keys/washbay',
            inviteHtml: '<table id="emailContainer" style="font-family: Arial,Helvetica,sans-serif; max-width:700px;" border="0" cellpadding="0" cellspacing="0" align="center"><tbody><tr class="msgHeader" bgcolor= "{{headerBgColor}}"><td colspan="5" height="40">&nbsp;</td></tr><tr class="msgHeader" bgcolor= "{{headerBgColor}}"><td class="msgHeaderTxt" style="font-size: 29px;color: #fff; font-weight: normal;letter-spacing: 1px; line-height: 1;text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.2); font-family: Arial,Helvetica,sans-serif; width:100% " align="center">{{surveyTitle}}</td> </tr> <tr class="msgHeader" bgcolor= "{{headerBgColor}}"><td colspan="5" height="40">&nbsp;</td></tr><tr><td colspan="5" height="10">&nbsp;</td></tr><tr> <td class="msgBodyTxt" colspan="3" style="color:#666666; font-size:13px;"align="left" valign="top"><p>{{surveyBody}}</p></td></tr><tr> <td colspan="5" height="40">&nbsp;</td></tr><tr> <td colspan="3"> <table bgcolor="{{btnbgcolor}}" class="msgBtnColor" style="border-radius: 4px; border: 1px solid #BBBBBB; color:#FFFFFF; font-size:14px; letter-spacing: 1px; text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.8); padding: 10px 18px;" border="0" cellpadding="0" cellspacing="0" align="center"><tbody><tr> <td class="msgBtnTxt" bgcolor="{{btnbgcolor}}" align="center" valign="center"> <a href="{{SurveyLink}}" target="_blank" style="color:#FFFFFF; text-decoration:none;">{{btnTxt}}</a> </td> </tr> </tbody></table> </td></tr><tr> <td colspan="5" height="30">&nbsp;</td></tr><tr style="color: #666666;font-size: 10px;" valign="top"><td colspan="3" align="center" valign="top"><p>Please do not forward this email as its survey link is unique to you. <br><a href="[OptOutLink]" target="_blank" style="color: #333333; text-decoration: underline;">Unsubscribe</a> from this list</p></td> </tr><tr> <td colspan="5" height="20">&nbsp;</td></tr><tr style="color: #999999;font-size: 10px;"> <td colspan="5" align="center"><table cellpadding="2" width="100%"><tbody> <tr> <td style="font-size: 10px; color: #999999;" align="right" width="45%">Powered by </td> <td align="left" width="55%"> &nbsp; Gemini Solutions Pvt Ltd.</td></tr></tbody></table></td></tr><tr> <td colspan="5" height="20">&nbsp;</td></tr></tbody></table>',
        thankuHtml: '<table id="emailContainer" style="font-family: Arial,Helvetica,sans-serif; max-width:700px;" border="0" cellpadding="0" cellspacing="0" align="center"><tbody><tr class="msgHeader" bgcolor= "{{headerBgColor}}"><td colspan="5" height="40">&nbsp;</td></tr><tr class="msgHeader" bgcolor= "{{headerBgColor}}"><td class="msgHeaderTxt" style="font-size: 29px;color: #fff; font-weight: normal;letter-spacing: 1px; line-height: 1;text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.2); font-family: Arial,Helvetica,sans-serif; width:100% " align="center">{{surveyTitle}}</td> </tr> <tr class="msgHeader" bgcolor= "{{headerBgColor}}"><td colspan="5" height="40">&nbsp;</td></tr><tr><td colspan="5" height="10">&nbsp;</td></tr><tr> <td class="msgBodyTxt" colspan="3" style="color:#666666; font-size:13px;"align="left" valign="top"><p>{{surveyBody}}</p></td></tr><tr> <td colspan="5" height="40">&nbsp;</td></tr><tr> <td colspan="5" height="30">&nbsp;</td></tr><tr style="color: #666666;font-size: 10px;" valign="top"><td colspan="3" align="center" valign="top"><p>Please do not forward this email as its survey link is unique to you. <br><a href="[OptOutLink]" target="_blank" style="color: #333333; text-decoration: underline;">Unsubscribe</a> from this list</p></td> </tr><tr> <td colspan="5" height="20">&nbsp;</td></tr><tr style="color: #999999;font-size: 10px;"> <td colspan="5" align="center"><table cellpadding="2" width="100%"><tbody> <tr> <td style="font-size: 10px; color: #999999;" align="right" width="45%">Powered by </td> <td align="left" width="55%"> &nbsp; Gemini Solutions Pvt Ltd.</td></tr></tbody></table></td></tr><tr> <td colspan="5" height="20">&nbsp;</td></tr></tbody></table>'
        },
        mongo: {
            debug: true,
            seed: false,
            host: '127.0.0.1',
            port: '27017',
            dbname: 'washbay-dev'
        },
        log: {
            level: 'debug',
            path: __dirname + '/../../logs/washbay.log'
        }
    }
};
            
