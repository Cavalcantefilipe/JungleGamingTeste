import { TextField } from '@/components/forms/TextField';
import type { Profile, UpdateProfileInput } from '@/contracts/profile';

import { AvatarField } from './AvatarField';

export function ProfileFields({ profile }: { profile: Profile }) {
  return (
    <div className="grid items-start gap-x-7 gap-y-6 lg:grid-cols-2">
      <TextField<UpdateProfileInput>
        name="displayName"
        required
        label="Nome de exibição"
        autoComplete="name"
      />
      <TextField<UpdateProfileInput>
        name="username"
        required
        label="Nome de usuário"
        autoComplete="username"
      />
      <TextField<UpdateProfileInput>
        name="email"
        required
        label="E-mail"
        type="email"
        autoComplete="email"
      />
      <TextField<UpdateProfileInput>
        name="ensName"
        prefix=".eth"
        label="Nome ENS"
        placeholder="Seu nome sem .eth"
      />
      <TextField<UpdateProfileInput> name="walletNickname" label="Apelido da carteira" />
      <AvatarField profile={profile} />
    </div>
  );
}
