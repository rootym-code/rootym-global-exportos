/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 *
 * Purpose:
 * Central email service for ROOTYM ExportOS transactional
 * emails such as password-reset messages.
 *
 * Provider:
 * - Hostinger SMTP
 * - SSL on port 465 by default
 *
 * Security:
 * - SMTP credentials are read only from environment variables.
 * - Credentials must never be committed to source control.
 * - This service does not expose SMTP credentials to callers.
 *
 * Environment variables:
 * - EXPORTOS_SMTP_HOST
 * - EXPORTOS_SMTP_PORT
 * - EXPORTOS_SMTP_USER
 * - EXPORTOS_SMTP_PASSWORD
 * - EXPORTOS_SMTP_FROM
 *
 * ============================================================
 */

import nodemailer from "nodemailer";

const SMTP_HOST =
  process.env.EXPORTOS_SMTP_HOST ?? "smtp.hostinger.com";

const SMTP_PORT = Number(
  process.env.EXPORTOS_SMTP_PORT ?? "465",
);

const SMTP_USER =
  process.env.EXPORTOS_SMTP_USER;

const SMTP_PASSWORD =
  process.env.EXPORTOS_SMTP_PASSWORD;

const SMTP_FROM =
  process.env.EXPORTOS_SMTP_FROM ??
  "ROOTYM ExportOS <prem@rootym.com>";

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    throw new Error(
      "ExportOS SMTP email configuration is missing. Set EXPORTOS_SMTP_USER and EXPORTOS_SMTP_PASSWORD.",
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailInput): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  });
}