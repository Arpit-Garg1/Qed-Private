export const isStringValue = (value) => {
    if (value) {
        return value;
    } else {
        return '';
    };
};

export const isIntegerValue = (value) => {
    if (value) {
        return value;
    } else {
        return 0;
    };
};

export const isArrayValue = (value) => {
    if (value && value?.length !== 0) {
        return value;
    } else {
        return [];
    };
};

export const isObjectValue = (value) => {
    if (value && Object.keys(value).length !== 0) {
        return value;
    } else {
        return {};
    };
};
