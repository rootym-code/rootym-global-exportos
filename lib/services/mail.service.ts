/**
 * ============================================================
 * ROOTYM Mail Service
 * File: lib/services/mail.service.ts
 * ============================================================
 */

import nodemailer, {
  Transporter,
  SendMailOptions,
} from "nodemailer";

import { Readable } from "stream";

export interface MailAttachment {
  filename: string;
  content: Buffer | string | Readable;
  contentType?: string;
}

export interface SendMailInput {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: MailAttachment[];
}

class MailService {
  private transporter: Transporter;

  constructor() {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASSWORD,
      MAIL_FROM,
    } = process.env;

    if (
      !SMTP_HOST ||
      !SMTP_PORT ||
      !SMTP_USER ||
      !SMTP_PASSWORD ||
      !MAIL_FROM
    ) {
      throw new Error(
        "Missing SMTP configuration. Check .env variables."
      );
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  async verify(): Promise<void> {
    await this.transporter.verify();
  }

  async send(input: SendMailInput) {
    const attachments =
      input.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })) ?? [];

    const options: SendMailOptions = {
      from: process.env.MAIL_FROM!,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html,
      attachments,
    };

    return this.transporter.sendMail(options);
  }

  async sendText(
    to: string,
    subject: string,
    text: string
  ) {
    return this.send({
      to,
      subject,
      text,
    });
  }

  async sendHtml(
    to: string,
    subject: string,
    html: string
  ) {
    return this.send({
      to,
      subject,
      html,
    });
  }
}

export const mailService = new MailService();