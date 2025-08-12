import slugify from '@sindresorhus/slugify';
import { CreateEmailResponseSuccess, ErrorResponse, Resend } from 'resend';

interface EmailStatus {
	data: CreateEmailResponseSuccess | null;
	error: ErrorResponse | null;
}

export default async function send(env: Env, email: string, article: ArrayBuffer, url: string): Promise<EmailStatus> {
	if (!env.RESEND_KEY) {
		throw new Error('RESEND_KEY is not set');
	}
	if (!env.FROM_EMAIL) {
		throw new Error('FROM_EMAIL is not set');
	}

	const resend = new Resend(env.RESEND_KEY);
	return resend.emails.send({
		from: env.FROM_EMAIL,
		to: email,
		subject: 'New Webpage Order Just Got Delivered! 🚚',
		text: `Hey there, here's your freshly baked webpage from web2kindle. Enjoy! \n\n Generated from ${url}`,
		attachments: [{ content: Buffer.from(article), filename: slugify(url) + '.pdf' }],
	});
}
