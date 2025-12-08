
'use client';

import Link from 'next/link';
import './magic-button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

export function MagicButton() {
  const text = "Explore Our Team";
  const letters = text.split('');

  return (
    <div className="btn-wrapper">
      <Link href="/team" passHref>
        <button className="btn">
          <FontAwesomeIcon icon={faPeopleGroup} className="btn-svg" />
          <div className="txt-wrapper">
            <div className="txt-1">
                {letters.map((letter, index) => (
                    <span key={index} className="btn-letter">{letter === ' ' ? '\u00A0' : letter}</span>
                ))}
            </div>
            <div className="txt-2">
                 {letters.map((letter, index) => (
                    <span key={index} className="btn-letter">{letter === ' ' ? '\u00A0' : letter}</span>
                ))}
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
}
