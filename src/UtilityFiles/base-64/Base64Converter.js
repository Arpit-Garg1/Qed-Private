export const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            let baseURL = fileReader.result
            resolve(baseURL);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export const randomNumberGenerator = () => {
    let num = Date.now() + Math.random()
    return Math.round(num);
};