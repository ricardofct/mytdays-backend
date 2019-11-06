
import * as sendGrid from 'sendgrid';
const { Email, Content, Mail } = sendGrid.mail;

import { IInviteModel, IInviteDoc } from '../models/Invite';
import { EmailTypes } from '../contants';
import e = require('express');

export const sendForgotPasswordEmail = (email: string, token: string) => {
    const from_email = new Email('noreply@mytdays.com');
    const to_email = new Email(email);
    let subject = 'MyTDays: Recuperar password!';
    const content = new Content('text/html', `
    Se pretende recuperar a sua password clique no link: ${token}
    <br>
    Se não pretende, esqueça este email.
    `);;

    const mail = new Mail(from_email, subject, to_email, content);

    const sg = sendGrid(process.env.SENDGRID_API_KEY);
    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    try {
        sg.API(request, function (error, response) {
            if (error) {
                throw error;
            }
        });
    } catch (e) {
        return e;
    }
}

export const sendInviteEmail = (emailType: number, invite: IInviteDoc) => {
    const from_email = new Email('noreply@mytdays.com');
    const to_email = new Email(invite.invitedEmail);
    let subject: string;
    let content: any;

    switch (emailType) {
        case EmailTypes.INVITE_TO_REGISTER: {
            subject = 'MyTDays: Foste convidado!';
            content = new Content('text/html', inviteToRegisterMessage(invite.token));
        }
        case EmailTypes.INVITE_TO_ACCEPT: {
            subject = 'MyTDays: Foste convidado!';
            content = new Content('text/html', inviteToAcceptMessage());
        }
    }

    const mail = new Mail(from_email, subject, to_email, content);

    const sg = sendGrid(process.env.SENDGRID_API_KEY);
    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });
    try {
        sg.API(request, function (error, response) {
            if (error) {
                invite.set({
                    error
                });
            } else {
                invite.set({
                    sented: true
                });
            }

            invite.save();
        });
    } catch (e) {
        return e;
    }
}

const inviteToRegisterMessage = (token: string): string => {
    return `
    Olá!
    <br>
    <br>
    Foste convidado para te registares na plataform <strong>MyTDays</strong>!
    <br>
    Clica no link a seguir para te registares: <a href="${process.env.EMAIL_URL_INVITE}${token}">${process.env.EMAIL_URL_INVITE}${token}</a>
    <br>
    <br>
    Cumprimentos,
    Equipa MyTDays,
    `;
}

const inviteToAcceptMessage = (): string => {
    return `
    Olá!
    <br>
    <br>
    Foste convidado para te registares na plataform <strong>MyTDays</strong>!
    <br>
    Acede à tua área de convites para aceitares ou rejeitares o convite.<br>
    <br>
    Cumprimentos,
    Equipa MyTDays,
    `;
}
