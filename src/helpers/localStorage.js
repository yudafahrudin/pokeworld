const localStorage = (key) => {
    const globalKey = key;

    const getValue = () => {
        const value = window.localStorage.getItem(globalKey);
        return JSON.parse(JSON.parse(value)) || [];
    }

    const setValue = (value = []) => {
        window.localStorage.setItem(globalKey, JSON.stringify(value));
    }

    return [getValue, setValue]
}

export default localStorage;