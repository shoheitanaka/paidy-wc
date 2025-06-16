import { __ } from '@wordpress/i18n';
import {
    TextControl,
    RadioControl,
    CheckboxControl,
    TextareaControl,
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

const SecuritySurvey01RadioControl = ( { value, onChange } ) => {
    return (
        <RadioControl
            label={ __( 'Do you use two-step or two-factor authentication to prevent compromised accounts?', 'paidy-wc' ) }
            selected={ value }
            onChange={ onChange }
            options={[
                {
                    label: __( 'Yes', 'paidy-wc' ),
                    value: 'yes'
                },
                {
                    label: __( 'No', 'paidy-wc' ),
                    value: 'no'
                },
                {
                    label: __( 'Unknown', 'paidy-wc' ),
                    value: 'unknown'
                },
            ]}
        />
    );
};

const SecuritySurvey01TextControl = ( { value, onChange } ) => {
    return (
        <TextareaControl
            label={ __( 'If the answer is "no", please provide an alternative.', 'paidy-wc' ) }
            value={ value }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey11CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'Restricting access from suspicious IP addresses', 'paidy-wc' ) }
            checked={ value }
            help={ __( 'This refers to restricting access from suspicious IP addresses, such as those from overseas, using firewalls, WAFs, apps, etc.', 'paidy-wc' ) }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey12CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'Identity verification using two-factor authentication, etc.', 'paidy-wc' ) }
            checked={ value }
            help={ __( 'This refers to increasing security strength by combining multiple levels or elements of authentication, such as biometric authentication using fingerprints or faces, or email or SMS authentication, in addition to ID and password.', 'paidy-wc' ) }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey13CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'Fraud detection system (Fraud service)', 'paidy-wc' ) }
            checked={ value }
            help={ __( 'It is a security technology that constantly monitors communications on the network and detects fraudulent transactions in advance, such as the use of credit cards by third parties or impersonation.', 'paidy-wc' ) }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey14CheckControl = ( { value, onChange } ) => {
    return (
        <CheckboxControl
            label={ __( 'Device fingerprinting, etc.', 'paidy-wc' ) }
            help={ __( 'This technology tracks online behavior by using the characteristics of the operating environment of the user\'s device as a kind of fingerprint.', 'paidy-wc' ) }
            checked={ value }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey10TextAreaControl = ( { value, onChange } ) => {
    return (
        <TextareaControl
            label={ __( 'If there is more than one question with a "yes" answer, please provide an alternative solution.', 'paidy-wc' ) }
            value={ value }
            onChange={ onChange }
        />
    );
};

const SecuritySurvey08RadioControl = ( { value, onChange } ) => {
    return (
        <RadioControl
            label={ __( 'Have you received any administrative disposition under the Specified Commercial Transactions Act in the past five years? If so, please describe the details.', 'paidy-wc' ) }
            selected={ value }
            onChange={ onChange }
            options={[
                {
                    label: __( 'No', 'paidy-wc' ),
                    value: 'no'
                },
                {
                    label: __( 'Yes', 'paidy-wc' ),
                    value: 'yes'
                },
            ]}
        />
    );
};

const SecuritySurvey09RadioControl = ( { value, onChange } ) => {
    return (
        <RadioControl
            label={ __( 'Have you ever been sued in a civil lawsuit for violating the Consumer Contract Act and lost the case? If so, please describe the details.', 'paidy-wc' ) }
            selected={ value }
            onChange={ onChange }
            options={[
                {
                    label: __( 'No', 'paidy-wc' ),
                    value: 'no'
                },
                {
                    label: __( 'Yes', 'paidy-wc' ),
                    value: 'yes'
                },
            ]}
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
    SecuritySurvey01RadioControl,
    SecuritySurvey01TextControl,
    SecuritySurvey11CheckControl,
    SecuritySurvey12CheckControl,
    SecuritySurvey13CheckControl,
    SecuritySurvey14CheckControl,
    SecuritySurvey10TextAreaControl,
    SecuritySurvey08RadioControl,
    SecuritySurvey09RadioControl,
};