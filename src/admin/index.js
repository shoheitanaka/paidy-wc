import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { OnBoardingStep } from './onboarding-step';
import './index.scss';

domReady( () => {
    const root = createRoot(
        document.getElementById( 'paidy-admin-settings' )
    );

    root.render( <OnBoardingStep /> );
} );