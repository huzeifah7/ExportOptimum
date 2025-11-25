
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

export function AnimatedButton() {
    return (
      <div className="btn-wrapper">
        <button className="btn">
            <FontAwesomeIcon icon={faPeopleGroup} className="btn-svg" />
      
          <div className="txt-wrapper">
            <div className="txt-1">
              <span className="btn-letter">M</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">&nbsp;</span>
              <span className="btn-letter">o</span>
              <span className="btn-letter">u</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">&nbsp;</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">m</span>
            </div>
            <div className="txt-2">
              <span className="btn-letter">M</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">&nbsp;</span>
              <span className="btn-letter">o</span>
              <span className="btn-letter">u</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">&nbsp;</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">m</span>
            </div>
          </div>
        </button>
      </div>
    )
}
