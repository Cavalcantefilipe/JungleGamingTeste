import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { focusClickedElement } from '@/lib/focusClickedElement';

export function MobileProfileLink() {
  return (
    <Link
      className="mobile-tab"
      to="/account/profile"
      aria-label="Perfil"
      onClick={focusClickedElement}
    >
      <FigmaIcon name="user-solid" size={20} aria-hidden="true" />
    </Link>
  );
}
