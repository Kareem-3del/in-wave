'use client';

import { useEffect } from 'react';
import { SplashScreen } from './loading-screen/splash-screen';
import { MotionLazy } from './loading-screen/motion-lazy';

export default function Preloader() {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let showTimeoutId: ReturnType<typeof setTimeout>;

    // Function to show the page
    const showPage = () => {
      document.body.classList.add('loaded');
      showTimeoutId = setTimeout(() => {
        document.body.classList.add('show');
      }, 1500);
    };

    // Try to wait for fonts, but have a maximum wait time
    const maxWait = setTimeout(showPage, 2000);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        clearTimeout(maxWait);
        showPage();
      }).catch(() => {
        // If fonts fail, still show the page
        clearTimeout(maxWait);
        showPage();
      });
    } else {
      // Fallback for browsers without Font Loading API
      clearTimeout(maxWait);
      timeoutId = setTimeout(showPage, 500);
    }

    // No cleanup - keep classes on body for page functionality
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(showTimeoutId);
      clearTimeout(maxWait);
    };
  }, []);

  return (
    // <div className="preloader">
    //   <div className="preloader__logo">
    //     <div className="preloader__logo__item">
    //       <img
    //         src="/images/logo.svg"
    //         alt="IN-WAVE Architects"
    //         style={{ width: 84, height: 'auto' }}
    //       />
    //     </div>
    //   </div>
    //   {/* <div className="preloader__progress"></div> */}
    // </div>
    <div className="preloader">
      {/* <MotionLazy> */}
      <SplashScreen />
      {/* </MotionLazy> */}
    </div>



  );
}
