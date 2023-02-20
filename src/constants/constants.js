//Search Filter Keys By Screen
export const FILTER_ASSETS = [{filterName: "Serial No", value: "serialNo", isChecked:false},{filterName: "UPC Code", value: "upcCode", isChecked:false},{filterName: "Category", value: "type", isChecked:false},{filterName: "Make", value: "Brand", isChecked:false}, {filterName: "Model", value: "Model", isChecked:false}];
export const FILTER_MODELS = [{filterName: "Category", value: "Category", isChecked:false},{filterName: "Make", value: "Brand", isChecked:false}, {filterName: "Model Name", value: "name", isChecked:false}, {filterName: "Submodel", value: "subModel", isChecked:false}];
export const FILTER_MAKES = [{filterName: "Name", value: "name", isChecked:false},{filterName: "Description", value: "description", isChecked:false}];
export const FILTER_CATEGORY = [{filterName: "Name", value: "name", isChecked:false},{filterName: "Description", value: "description", isChecked:false}];
export const FILTER_USER = [{filterName: "Email", value: "email", isChecked:false},{filterName: "Name", value: "displayName", isChecked:false}, {filterName: "Type", value: "displayRole", isChecked:false}, {filterName: "Status", value: "status", isChecked:false}, {filterName: "Organization", value: "Org", isChecked:false}];
export const FILTER_EMAIL_TEMPLATE = [{filterName: "Template For", value: "templateFor", isChecked:false},{filterName: "Subject", value: "subject", isChecked:false}, {filterName: "Mail Body", value: "mailBody", isChecked:false}];
export const FILTER_ORGANIZATION = [{filterName: "Name", value: "name", isChecked:false},{filterName: "Type", value: "type", isChecked:false}];
export const PAGE_NUMBER = 1;
export const MAX_ITEM_PER_PAGE = 50;
export const MAX_PAGINATION_PER_PAGE = [50,100,250,500,1000];

// Validation Regex Patterns
export const vFirstName= new RegExp(/^[A-Za-z][A-Za-z0-9\-_.\s]{3,50}$/);
export const vName= new RegExp(/^[A-Z][A-Za-z\d\ \s]{3,100}$/);
export const vCodeRqAlphaNumeric= new RegExp(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i);
export const vCode= new RegExp(/^[A-Z0-9]{3,7}$/);
export const vCompanyName= new RegExp(/^[a-z\d\-_.\s]{3,100}$/i);
export const vEmail= new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
export const vAadhar= new RegExp(/^\d{4}\s\d{4}\s\d{4}$/);
export const vPan= new RegExp(/[a-zA-z]{5}\d{4}[a-zA-Z]{1}$/);
export const vMob= new RegExp(/^\d{10}$/);
export const vMobnum= new RegExp(/^((\\+[1-12]{0,12}[ \\-]*)|(\\([0-12]{0,13}\\)[ \\-]*)|([0-12]{0,13})[ \\-]*)/);
export const vAge= new RegExp(/^\d{1,3}$/);
export const vAcc= new RegExp(/^\d{15}$/);
export const vHsn= new RegExp(/^\d{8}$/);
export const vPin= new RegExp(/^[1-9][0-9]{5}$/);
export const vNum= new RegExp(/^[0-9]*$/);
export const vPrice= new RegExp(/^[0.1-9]+(\.[0.1-9]{1,2})?$/);
export const vTim= new RegExp(/^(10|11|12|13|14|15|16|17|18|19|20|21|22|23|[1-9]):[0-5][0-9]$/);
export const vMinTenPer= new RegExp(/^(10?[1-9]|[1-9][0-9]|100)$/);
export const vNumNew= new RegExp(/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/);
export const vPercent= new RegExp(/^(0|[1-9]\d?)\.\d{4}|100\.0000$/);
export const vTelephoneNum= new RegExp(/^[1-9][0-9]{9,13}$/);
export const vGst= new RegExp(/^([0-9][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/);
export const vPasswod= new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#^()-_+=%*?&]).{8,}/);
export const vCountrycode= new RegExp(/^(\+?\d{1,3}|\d{1,6})$/);
export const vIfsccode= new RegExp(/^[A-Za-z]{4}[0-9]{6,7}$/);
export const vCurrencyCode= new RegExp(/^[A-Z]{2,3}$/);
export const strongRegularExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
