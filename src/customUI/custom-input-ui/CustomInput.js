import React from 'react'
import { vNum, vEmail, strongRegularExp } from '../../constants/constants';
import * as DateUtil from '../../Util/DateUtil'

function CustomInput(props) {
    const { fieldType, classType, setFieldData, filedData, keyName, selectList, defaultName, isReadOnly, getSearchResults, headerName, objKey, isRequired = false, disabled } = props;
    const handleInputValues = (inputKey, data) => {
        let charLength = data?.length;
        let minLength = charLength <= 50;
        let maxLength = charLength <= 500;
        let textAreaLength = charLength <= 1000;
        switch (inputKey) {
            case 'text':
                if (keyName === 'description' && maxLength) {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                } else if (objKey && minLength) {
                    setFieldData(state => ({ ...state, [objKey]: { ...filedData[objKey], [keyName]: data } }))
                } else if (minLength) {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                }
                break;
            case 'textarea':
                if (keyName === 'description' && maxLength) {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                } else if (keyName === 'mailBody' && textAreaLength) {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                }
                break;
            case 'search':
                if (!headerName) {
                    getSearchResults(data);
                } else {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                }
                break;
            case 'number':
                if (keyName === 'noOfAssets' && data?.match(vNum) && parseInt(data[0]) !== 0 && data.length <= 4) {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                } else if (keyName !== 'noOfAssets' && data?.match(vNum) && parseInt(data[0]) !== 0 && data.length <= 5) {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                }
                break;
            case 'password':
                if (keyName === 'confirmPassword') {
                    setFieldData(state => ({ ...state, [keyName]: data, isConfirmPasswordValid: strongRegularExp?.test(data) }));
                } else {
                    setFieldData(state => ({ ...state, [keyName]: data, isPasswordValid: strongRegularExp?.test(data) }));
                }
                break;
            case 'email':
                if (keyName === 'email') {
                    setFieldData(state => ({ ...state, [keyName]: data, isValid: vEmail?.test(data) }));
                }
                break;
            default:
                if (inputKey && keyName && minLength) {
                    setFieldData(state => ({ ...state, [keyName]: data }));
                }
                break;
        }

    };

    const inputValues = () => {
        if (fieldType === "email") {
            return <input type={fieldType} pattern={vEmail} required={isRequired} id={fieldType} value={filedData && keyName ? filedData[keyName] : defaultName || ''} className={classType || "input"} onChange={(event) => handleInputValues(fieldType, event.target.value)} />
        };

        if (fieldType === "password") {
            return <input type={fieldType} required={isRequired} id={fieldType} value={filedData && keyName ? filedData[keyName] : defaultName || ''} className={classType || "password"} onChange={(event) => handleInputValues(fieldType, event.target.value)} />
        };

        if (fieldType === "text" && !objKey) {
            return <input disabled={disabled} type={fieldType} required={isRequired} id={fieldType} value={filedData && keyName ? filedData[keyName] : defaultName || ''} className={classType || ""} onChange={(event) => handleInputValues(fieldType, event.target.value)} readOnly={isReadOnly === 'true' ? true : false} />
        };

        if (fieldType === "text" && objKey) {
            return <input disabled={disabled} type={fieldType} required={isRequired} id={fieldType} value={filedData && keyName ? filedData[objKey][keyName] : defaultName || ''} className={classType || ""} onChange={(event) => handleInputValues(fieldType, event.target.value)} readOnly={isReadOnly === 'true' ? true : false} />
        };

        if (fieldType === "textarea") {
            return <textarea id={keyName} required={isRequired} name={keyName} value={filedData && keyName ? filedData[keyName] : defaultName || ''} rows="4" cols="50" onChange={(event) => handleInputValues(fieldType, event.target.value)} readOnly={isReadOnly === 'true' ? true : false} />
        };

        if (fieldType === "number") {
            return <input type={'Text'} oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" required={isRequired} id={fieldType} value={filedData && keyName && filedData[keyName] !== 0 ? filedData[keyName] : defaultName || ''} className={classType || ""} onChange={(event) => handleInputValues(fieldType, event.target.value)} readOnly={isReadOnly === 'true' ? true : false} />
        };

        if (fieldType === "date") {
            let tomorrow = DateUtil.addDaysToDate(new Date(), 1, 'YYYY-MM-DD')
            return <input type={fieldType} required={isRequired} id={fieldType} min={tomorrow} value={filedData && keyName && filedData[keyName] ? DateUtil.getQedRulesDateFormat(filedData[keyName]) : ''} className={classType || ""} onChange={(event) => handleInputValues(fieldType, event.target.value)} />
        };

        if (fieldType === "search" && headerName) {
            return <input type={fieldType} required={isRequired} name={fieldType} value={filedData && keyName ? filedData[keyName] : ''} onChange={(event) => handleInputValues(fieldType, event.target.value)} className={classType || ""} placeholder="Search keyword here" id={fieldType} />
        };

        if (fieldType === "search" && !headerName) {
            return <input type={fieldType} required={isRequired} name={fieldType} onChange={(event) => getSearchResults(event.target.value)} className={classType || ""} placeholder="Search keyword here" id={fieldType} />
        };

        if (fieldType === "select" && selectList?.length !== 0) {
            return <select name={`${keyName}`} required={isRequired} id={`${keyName}`} value={filedData && keyName ? filedData[keyName] : ''} onChange={(event) => handleInputValues(fieldType, event.target.value)}>
                {selectList?.map((item) => {
                    return <option key={item?.id} value={item?.id}>{item?.name}</option>
                })}
            </select>
        };

        if (fieldType === "color") {
            return <input type={fieldType} className={classType || ""}  value={filedData && keyName ? filedData[keyName] : ''} onChange={(event) => handleInputValues(fieldType, event.target.value)} />
        }
    }

    return (<> {inputValues()} </>)
}

export default CustomInput