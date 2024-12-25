import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';

const SettingsPage = () => {
    return <div>Placeholder for settings page</div>;
};

domReady( () => {
    render(
        <SettingsPage />,
        document.getElementById( 'paidy-admin-settings' )
    );
} );