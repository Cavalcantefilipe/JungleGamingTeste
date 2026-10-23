import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { focusClickedElement } from '@/lib/focusClickedElement';

export function MobileFavoritesLink({ authenticated }: { authenticated: boolean }) {
  return authenticated ? (
    <Link className="mobile-tab" to="/" search={{ favorites: true }} aria-label="Favoritos">
      <FigmaIcon name="heart-solid" size={20} aria-hidden="true" />
    </Link>
  ) : (
    <Link
      className="mobile-tab"
      to="/login"
      onClick={focusClickedElement}
      search={{ returnTo: '/?favorites=true' }}
      aria-label="Favoritos"
    >
      <FigmaIcon name="heart-solid" size={20} aria-hidden="true" />
    </Link>
  );
}
