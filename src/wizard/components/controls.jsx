import { __ } from '@wordpress/i18n';
import {
    TextControl,
    RadioControl,
    CheckboxControl,
} from '@wordpress/components';

const StoreNameTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Trade name / Store name', 'paidy-wc' ) }
            className="paidy-store-name"
            type="text"
            onChange={ onChange }
            value={ value }
        />
    );
};

const SiteNameTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Your EC site name', 'paidy-wc' ) }
            className="paidy-site-name"
            type="text"
            onChange={ onChange }
            value={ value }
        />
    );
}

const StoreUrlTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Store URL', 'paidy-wc' ) }
            value={ value }
            onChange={ onChange }
        />
    );
};

const RegistEmailTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Email address for registering Paidy', 'paidy-wc' ) }
            value={ value }
            onChange={ onChange }
        />
    );
}

const ContactPhoneTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Contact phone number', 'paidy-wc' ) }
            type="tel"
            onChange={ onChange }
            value={ value }
        />
    );
}

const RepresentativeLastNameTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Representative (last name)', 'paidy-wc' ) }
            onChange={ onChange }
            value={ value }
        />
    );
}

const RepresentativeFirstNameTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Representative (first name)', 'paidy-wc' ) }
            onChange={ onChange }
            value={ value }
        />
    );
}

const RepresentativeLastNameKanaTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Representative (last name kana)', 'paidy-wc' ) }
            help={ __( 'Please enter in full-width katakana.', 'paidy-wc' ) }
            value={ value }
            onChange={ onChange }
        />
    );
}

const RepresentativeFirstNameKanaTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Representative (first name kana)', 'paidy-wc' ) }
            help={ __( 'Please enter in full-width katakana.', 'paidy-wc' ) }
            value={ value }
            onChange={ onChange }
        />
    );
}

const RepresentativeDateOfBirthTextControl = ( { value, onChange } ) => {
    return (
        <TextControl
            label={ __( 'Representative\'s date of birth (Gregorian calendar)', 'paidy-wc' ) }
            value={ value }
            type="date"
            onChange={ onChange }
        />
    );
}

const AnnualGrossValueRadioControl = ( { value, onChange } ) => {
    return (
        <RadioControl
            label={ __( 'Annual gross merchandise value', 'paidy-wc' ) }
            selected={ value }
            options={ [
                { label: __( 'Less than 10 million yen', 'paidy-wc' ), value: 'less-than-10-million-yen' },
                { label: __( '10 million yen or more', 'paidy-wc' ), value: '10-million-yen-or-more' },
            ] }
            onChange={ onChange }
        />
    );
};

const AveragePurchaseAmountRadioControl = ( { value, onChange } ) => {
    return (
        <RadioControl
            label={ __( 'Average purchase amount per order', 'paidy-wc' ) }
            selected={ value }
            options={ [
                { label: __( 'Less than 50,000 yen', 'paidy-wc' ), value: 'less-than-50000-yen' },
                { label: __( 'Over 50,000 yen', 'paidy-wc' ), value: '50000-yen-or-more' },
            ] }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey01CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'To access (log in to) the cart system management screen, you must enter a password.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey02CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'The cart system\'s management screen allows for login restrictions using ID and password, as well as access restrictions.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey03CheckControl = ( { value, onChange } ) => {
    return (
        <>
        <CheckboxControl
            label={ __( 'Regarding access restrictions to the administration screen, one of the following measures can be taken.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
        <ul>
            <li>{ __( 'Administrators can restrict the IP addresses that can access the system.', 'paidy-wc' ) }</li>
            <li>{ __( 'It is possible to set access restrictions such as basic authentication in the administration screen.', 'paidy-wc' ) }</li>
            <li>{ __( 'This is handled in other ways.', 'paidy-wc' ) }</li>
        </ul>
        </>
    );
};

const SecuritySurvey04CheckControl = ( { value, onChange } ) => {
    return (
        <>
        <CheckboxControl
            label={ __( 'The settings for data directory* disclosure are configured in one of the following ways:', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
        <ul>
            <li>{ __( 'Make certain directories private so that important files cannot be placed in the public directory.', 'paidy-wc' ) }</li>
            <li>{ __( 'Take care to place important files outside of public directories.', 'paidy-wc' ) }</li>
        </ul>
        </>
    );
};

const SecuritySurvey05CheckControl = ( { value, onChange } ) => {
    return (
        <>
        <CheckboxControl
            label={ __( 'Settings are made to restrict the extensions and files that can be uploaded by the web server or web application.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
        <ul>
            <li>{ __( 'This is handled in other ways.', 'paidy-wc' ) }</li>
        </ul>
        </>
    );
};

const SecuritySurvey06CheckControl = ( { value, onChange } ) => {
    return (
        <>
        <CheckboxControl
            label={ __( 'Vulnerability assessments or penetration tests* are conducted regularly (once a year or when the system is changed).', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
        <ul>
            <li>{ __( 'Vulnerability assessments or penetration tests are conducted on a regular basis, and any necessary corrective actions are taken.', 'paidy-wc' ) }</li>
            <li>{ __( 'To counter SQL injection and cross-site scripting vulnerabilities, we are using plugins that do not have the vulnerabilities and upgrading our software.', 'paidy-wc' ) }</li>
            <li>{ __( 'When developing or customizing a web application, we conduct a source code review to confirm that it is securely coded. At that time, we also check the input values of input forms.', 'paidy-wc' ) }</li>
            <li>{ __( 'This is handled in other ways.', 'paidy-wc' ) }</li>
        </ul>
        </>
    );
};

const SecuritySurvey07CheckControl = ( { value, onChange } ) => {
    return (
        <>
        <CheckboxControl
            label={ __( 'Anti-virus software is introduced and operated as a measure against malware using the following methods.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
        <ul>
            <li>{ __( 'We have introduced antivirus software as a measure to detect and remove malware, and we update signatures and perform regular full scans.', 'paidy-wc' ) }</li>
            <li>{ __( 'This is handled in other ways.', 'paidy-wc' ) }</li>
        </ul>
        </>
    );
};

const SecuritySurvey08CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'We have not received any disciplinary action under the Act on Specified Commercial Transactions in the past five years.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey09CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'In the last five years, we have not been the subject of a civil lawsuit for violating the Consumer Contract Act and have not lost the case.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
    );
};

export {
    StoreNameTextControl,
    SiteNameTextControl,
    StoreUrlTextControl,
    RegistEmailTextControl,
    ContactPhoneTextControl,
    RepresentativeLastNameTextControl,
    RepresentativeFirstNameTextControl,
    RepresentativeLastNameKanaTextControl,
    RepresentativeFirstNameKanaTextControl,
    RepresentativeDateOfBirthTextControl,
    AnnualGrossValueRadioControl,
    AveragePurchaseAmountRadioControl,
    SecuritySurvey01CheckControl,
    SecuritySurvey02CheckControl,
    SecuritySurvey03CheckControl,
    SecuritySurvey04CheckControl,
    SecuritySurvey05CheckControl,
    SecuritySurvey06CheckControl,
    SecuritySurvey07CheckControl,
    SecuritySurvey08CheckControl,
    SecuritySurvey09CheckControl,
};