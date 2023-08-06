import { env } from '@/env';
import { ForgotPasswordEmail } from '@/providers/emails/forgot-password';
import { mailer } from '@/providers/nodemailer';
import { render } from '@react-email/render';
import { add } from 'date-fns';
import { randomUUID } from 'node:crypto';

import { UsersRepository } from '@/repositories/users-repository';

import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

interface GetResetPasswordTokenUseCaseRequest {
  email: string;
}

export class GetResetPasswordTokenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email }: GetResetPasswordTokenUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError();
    }
    const token = randomUUID();

    const userUpdated = await this.usersRepository.update(user.id, {
      reset_password_token: token,
      reset_password_expiration: add(new Date(), { days: 1 }),
    });

    const html = render(
      ForgotPasswordEmail({
        name: user.name,
        token,
      })
    );

    const testingEmails = ['user-test@photolink.com.br']

    if (env.ACTIVE_SEND_EMAILS && !testingEmails.includes(user.email)) {
      mailer.sendMail({
        from: 'contato@photolink.com.br',
        to: user.email,
        replyTo: 'contato@photolink.com.br',
        subject: 'Recuperação de senha',
        html,
      });
    }

    return {
      token: userUpdated!.reset_password_token,
      expires_at: userUpdated!.reset_password_expiration,
    };
  }
}
