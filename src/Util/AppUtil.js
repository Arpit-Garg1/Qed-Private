
export const isNullOrEmpty = (s) =>{
        if (s === undefined || s === null || s === '' || s === 'null' || s === 'undefined' || s == 0) {
            return true;
        } else {
            return false;
        }
    }
    export const isNullOrEmptyNew = (s) =>{
        if (s === undefined || s === null || s === '' || s === 'null' || s === 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    export function isNullEmpty(data) {
    if (data === undefined || data === null ) {
        return true;
    }
    // if(typeof(data) == 'Object') {
    //     return Object.keys(data)?.length == 0;
    // }
    return false;
}

    export const isNotNull = (data) => {
        return !isNullEmpty(data);
    }

    export const isListNullOrEmpty = (list) => {
        if (list === undefined || list === null || list.length === 0) {
            return true;
        }
        return false;
    }

    export const removeNullKeys = (list) => {
        if (Array.isArray(list)) {
            if (!isListNullOrEmpty(list)) {
                list.forEach(ele => {
                    if(!isNullOrEmpty(ele)){
                        delete list[ele];
                    }
                })
            }
        } else {
            removeNullKeys(Object.keys(list));
        }
        return list;
    }